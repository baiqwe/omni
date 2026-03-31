# Supabase 多项目隔离方案说明

本文档用于说明当前项目采用的 Supabase 多项目隔离方案，目标是让多个业务项目共用同一个 Supabase 实例，同时保证每个项目的数据、积分、订阅、生成记录彼此隔离。

当前方案已经在 Anima 项目中落地，核心思路是：

- 共用一个 Supabase 项目
- 共用一套业务表结构
- 使用 `APP_KEY + project_id` 对数据进行隔离
- 所有业务读写都自动带上当前项目标识

## 1. 设计目标

这套方案主要解决下面几个问题：

- 多个项目共用同一个 `auth.users`
- 多个项目共用一套支付、积分、订阅、生成记录基础设施
- 避免为每个项目复制一套 `customers`、`subscriptions`、`credits_history`、`generations`
- 让新项目接入时尽量少改数据库结构

## 2. 为什么不用“项目名_表名”

例如 `anima_customers`、`foo_customers` 这种方式虽然直观，但长期会有这些问题：

- 每个项目都要复制整套表、索引、RLS、函数、触发器
- 同一个功能修复需要改很多套表
- 代码层容易出现动态拼表名，维护成本高
- 很难做统一审计、统一运营视图、统一支付回调处理

因此当前采用的是“单表 + 项目隔离字段”的方式。

## 3. 核心模型

### 3.1 app_projects

新增项目表：

- 表名：`public.app_projects`
- 作用：记录每个业务项目

关键字段：

- `id`: 项目主键
- `key`: 项目标识，代码和环境变量通过它识别当前项目
- `name`: 项目名称

示例数据：

```sql
insert into public.app_projects (key, name)
values ('anima', 'Anima');
```

### 3.2 业务表统一增加 project_id

以下表统一增加 `project_id`：

- `public.customers`
- `public.subscriptions`
- `public.credits_history`
- `public.generations`

这样每条业务数据都归属于某一个项目。

## 4. 当前隔离规则

### 4.1 环境变量

项目通过以下环境变量声明自己的身份：

```env
APP_KEY=anima
NEXT_PUBLIC_APP_KEY=anima
```

说明：

- `APP_KEY` 用于服务端和服务角色逻辑
- `NEXT_PUBLIC_APP_KEY` 用于浏览器端 Supabase 请求头

### 4.2 请求头

所有 Supabase client 都会自动带上：

```http
x-app-key: anima
```

当前代码中已经接入：

- [utils/supabase/client.ts](/Users/fanqienigehamigua/Documents/anima/mabw/utils/supabase/client.ts)
- [utils/supabase/server.ts](/Users/fanqienigehamigua/Documents/anima/mabw/utils/supabase/server.ts)
- [utils/supabase/service-role.ts](/Users/fanqienigehamigua/Documents/anima/mabw/utils/supabase/service-role.ts)

### 4.3 数据库函数

数据库侧通过以下函数识别当前项目：

- `public.get_request_app_key()`
- `public.get_current_project_id()`
- `public.is_current_project(uuid)`

它们会从 `request.headers` 中读取 `x-app-key`，再映射到 `app_projects.id`。

## 5. 表设计约束

### 5.1 customers

原本 `customers` 是按 `user_id` 全局唯一，现在改成项目内唯一。

建议唯一约束：

- `(project_id, user_id)`
- `(project_id, creem_customer_id)`

这意味着：

- 同一个 Supabase 用户可以在多个项目里各自拥有一个 `customer`
- 不同项目允许出现相同的 `user_id`
- 不同项目允许各自拥有同名或相似业务数据，只要项目不同就不会冲突

### 5.2 subscriptions

建议唯一约束：

- `(project_id, creem_subscription_id)`

### 5.3 credits_history

`credits_history` 通过 `(project_id, customer_id)` 绑定项目和客户，避免流水串项目。

### 5.4 generations

`generations` 也带 `project_id`，用于隔离不同项目的生成记录。

## 6. RLS 设计原则

RLS 的原则是：

- 用户只能访问自己的数据
- 同时只能访问当前项目的数据
- service role 可以跨项目管理，但应用层默认仍会带当前 `APP_KEY`

例如用户访问 `customers` 时，策略会同时检查：

- `auth.uid() = user_id`
- `project_id` 是否等于当前请求解析出的项目

## 7. 注册流程设计

注册时，系统会把 `app_key` 写入用户元数据。

相关代码：

- [app/actions.ts](/Users/fanqienigehamigua/Documents/anima/mabw/app/actions.ts)

注册逻辑会传入：

```ts
options: {
  data: {
    app_key: getAppKey(),
  },
}
```

数据库触发器 `handle_new_user()` 会读取：

- `new.raw_user_meta_data ->> 'app_key'`

然后为该项目创建：

- `customers`
- 初始 `credits_history`

如果元数据中没有 `app_key`，当前默认回退到 `anima`。

## 8. 积分扣减设计

积分函数 `public.decrease_credits(uuid, integer, text)` 已升级为项目隔离版本。

它会先读取当前请求对应的 `project_id`，然后只操作该项目下的：

- `customers`
- `credits_history`

因此即使同一个用户在多个项目都有账号，也不会串积分。

## 9. 当前已落地文件

### 9.1 迁移文件

- [supabase/migrations/20260331000000_create_generations_table.sql](/Users/fanqienigehamigua/Documents/anima/mabw/supabase/migrations/20260331000000_create_generations_table.sql)
- [supabase/migrations/20260331010000_add_project_isolation.sql](/Users/fanqienigehamigua/Documents/anima/mabw/supabase/migrations/20260331010000_add_project_isolation.sql)

### 9.2 应用层工具

- [utils/supabase/project.ts](/Users/fanqienigehamigua/Documents/anima/mabw/utils/supabase/project.ts)

### 9.3 业务代码接入点

- [utils/credits.ts](/Users/fanqienigehamigua/Documents/anima/mabw/utils/credits.ts)
- [utils/supabase/subscriptions.ts](/Users/fanqienigehamigua/Documents/anima/mabw/utils/supabase/subscriptions.ts)
- [app/api/ai/generate/route.ts](/Users/fanqienigehamigua/Documents/anima/mabw/app/api/ai/generate/route.ts)
- [app/api/credits/route.ts](/Users/fanqienigehamigua/Documents/anima/mabw/app/api/credits/route.ts)
- [app/api/creem/customer-portal/route.ts](/Users/fanqienigehamigua/Documents/anima/mabw/app/api/creem/customer-portal/route.ts)
- [hooks/use-subscription.ts](/Users/fanqienigehamigua/Documents/anima/mabw/hooks/use-subscription.ts)

## 10. 新项目接入操作清单

以后如果要新建一个项目，并继续共用这个 Supabase，可以按下面步骤执行。

### 步骤 1：为新项目选一个唯一 APP_KEY

例如新项目叫 `manga`，则：

```env
APP_KEY=manga
NEXT_PUBLIC_APP_KEY=manga
```

要求：

- 全局唯一
- 一旦上线后尽量不要改
- 推荐使用简短、稳定、纯小写的 key

### 步骤 2：在 Supabase 中登记项目

执行 SQL：

```sql
insert into public.app_projects (key, name)
values ('manga', 'Manga')
on conflict (key) do update set name = excluded.name;
```

### 步骤 3：项目环境变量中配置 APP_KEY

在新项目的 `.env` 中配置：

```env
APP_KEY=manga
NEXT_PUBLIC_APP_KEY=manga
```

### 步骤 4：注册、登录、支付逻辑复用现有方案

只要项目已经使用当前这套 Supabase helper：

- `utils/supabase/client.ts`
- `utils/supabase/server.ts`
- `utils/supabase/service-role.ts`

那么请求会自动带上对应 `x-app-key`，大部分业务逻辑不需要额外改表名。

### 步骤 5：创建支付单时把 app_key 带进 metadata

当前 `createCheckoutSession()` 已经会附带：

- `user_id`
- `product_type`
- `credits`
- `app_key`

新项目接入时要保持这条规则，不要删掉 `app_key`。

### 步骤 6：确保 webhook 仍走当前项目隔离逻辑

Creem webhook 最终会通过项目内 `customer` 和 `subscription` 写入数据，因此新项目也应继续使用同样的隔离 helper。

## 11. 推荐新增项目时的最小检查

接入一个新项目后，建议至少验证下面这些查询。

### 11.1 项目是否登记成功

```sql
select id, key, name
from public.app_projects
order by created_at desc;
```

### 11.2 当前项目 customer 是否按项目隔离

```sql
select project_id, user_id, email, credits
from public.customers
order by created_at desc;
```

### 11.3 当前项目生成记录是否按项目隔离

```sql
select project_id, user_id, model_id, status, created_at
from public.generations
order by created_at desc
limit 20;
```

## 12. 开发规范

以后开发新功能时，凡是新增业务表，建议都遵守下面规则：

### 12.1 必须带 project_id 的表

只要这个表属于某个项目，而不是纯全局配置表，就应该加：

- `project_id uuid not null`

例如：

- 用户资产
- 订单
- 使用日志
- AI 任务
- 文件记录
- 配额记录

### 12.2 查询必须带 project_id

不要只按 `user_id` 查业务数据，应改成：

- `project_id + user_id`
- 或 `project_id + customer_id`

### 12.3 唯一约束优先做“项目内唯一”

不要轻易使用全局唯一，而应该优先考虑：

- `(project_id, xxx)`

### 12.4 前后端统一使用同一个 APP_KEY

不要出现：

- 前端一个 key
- 服务端另一个 key
- webhook 再用第三个 key

否则数据会落到不同项目里。

## 13. 已知限制

### 13.1 auth.users 仍然是全局用户池

这套方案隔离的是业务数据，不是 Supabase Auth 用户本身。也就是说：

- 同一个邮箱注册到同一个 Supabase 实例，本质上还是同一个 auth 用户
- 业务上是否允许同一用户跨项目共享身份，需要产品层自己决定

### 13.2 触发器只在用户注册时自动建 customer

如果某些项目是在旧用户基础上后接入的，可能需要补数据：

- 为已有 `auth.users` 回填 `customers`
- 为旧数据回填 `project_id`

## 14. 推荐维护方式

后续建议把这套方案当作团队默认规范：

- 新业务表默认考虑 `project_id`
- 新项目默认先创建 `app_projects` 记录
- 新环境默认配置 `APP_KEY`
- 新支付或 webhook 逻辑默认带 `app_key`

这样就能长期维持“一个 Supabase，多个项目，共享基础设施但数据隔离”的结构。

## 15. 快速执行模板

### 15.1 新项目登记 SQL

```sql
insert into public.app_projects (key, name)
values ('your_app_key', 'Your Project Name')
on conflict (key) do update set name = excluded.name;
```

### 15.2 新项目环境变量模板

```env
APP_KEY=your_app_key
NEXT_PUBLIC_APP_KEY=your_app_key
```

### 15.3 新项目接入时必须确认的 4 件事

- 已在 `app_projects` 中插入对应项目
- 项目环境变量已配置 `APP_KEY`
- Supabase client 已自动携带 `x-app-key`
- 新增业务表已带 `project_id`

