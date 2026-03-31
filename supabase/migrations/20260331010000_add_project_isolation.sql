create table if not exists public.app_projects (
    id uuid primary key default gen_random_uuid(),
    key text not null unique,
    name text not null,
    created_at timestamp with time zone not null default timezone('utc'::text, now())
);

insert into public.app_projects (key, name)
values ('anima', 'Anima')
on conflict (key) do update set name = excluded.name;

create or replace function public.get_request_app_key()
returns text
language sql
stable
as $$
    select coalesce(
        nullif((current_setting('request.headers', true)::jsonb ->> 'x-app-key'), ''),
        'anima'
    );
$$;

alter function public.get_request_app_key() set search_path = public;

create or replace function public.get_current_project_id()
returns uuid
language sql
stable
as $$
    select id
    from public.app_projects
    where key = public.get_request_app_key()
    limit 1;
$$;

alter function public.get_current_project_id() set search_path = public;

create or replace function public.is_current_project(p_project_id uuid)
returns boolean
language sql
stable
as $$
    select p_project_id = public.get_current_project_id();
$$;

alter function public.is_current_project(uuid) set search_path = public;

alter table public.customers add column if not exists project_id uuid;
alter table public.subscriptions add column if not exists project_id uuid;
alter table public.credits_history add column if not exists project_id uuid;
alter table public.generations add column if not exists project_id uuid;

update public.customers
set project_id = (
    select id from public.app_projects where key = 'anima'
)
where project_id is null;

update public.subscriptions s
set project_id = c.project_id
from public.customers c
where s.customer_id = c.id
  and s.project_id is null;

update public.credits_history ch
set project_id = c.project_id
from public.customers c
where ch.customer_id = c.id
  and ch.project_id is null;

update public.generations
set project_id = (
    select id from public.app_projects where key = 'anima'
)
where project_id is null;

alter table public.customers
    alter column project_id set default public.get_current_project_id(),
    alter column project_id set not null;

alter table public.subscriptions
    alter column project_id set default public.get_current_project_id(),
    alter column project_id set not null;

alter table public.credits_history
    alter column project_id set default public.get_current_project_id(),
    alter column project_id set not null;

alter table public.generations
    alter column project_id set default public.get_current_project_id(),
    alter column project_id set not null;

alter table public.customers drop constraint if exists customers_creem_customer_id_key;
alter table public.subscriptions drop constraint if exists subscriptions_creem_subscription_id_key;

create unique index if not exists customers_project_user_id_uidx
    on public.customers(project_id, user_id);

create unique index if not exists customers_project_creem_customer_id_uidx
    on public.customers(project_id, creem_customer_id);

create unique index if not exists customers_id_project_id_uidx
    on public.customers(id, project_id);

create unique index if not exists subscriptions_project_creem_subscription_id_uidx
    on public.subscriptions(project_id, creem_subscription_id);

create index if not exists customers_project_id_idx
    on public.customers(project_id);

create index if not exists subscriptions_project_customer_id_idx
    on public.subscriptions(project_id, customer_id);

create index if not exists credits_history_project_customer_id_idx
    on public.credits_history(project_id, customer_id);

create index if not exists generations_project_user_id_idx
    on public.generations(project_id, user_id);

alter table public.subscriptions
    drop constraint if exists subscriptions_customer_id_project_id_fkey;

alter table public.subscriptions
    add constraint subscriptions_customer_id_project_id_fkey
    foreign key (customer_id, project_id)
    references public.customers(id, project_id)
    on delete cascade;

alter table public.credits_history
    drop constraint if exists credits_history_customer_id_project_id_fkey;

alter table public.credits_history
    add constraint credits_history_customer_id_project_id_fkey
    foreign key (customer_id, project_id)
    references public.customers(id, project_id)
    on delete cascade;

alter table public.app_projects enable row level security;

drop policy if exists "Anyone can view app projects" on public.app_projects;
create policy "Anyone can view app projects"
    on public.app_projects for select
    using (true);

drop policy if exists "Users can view their own customer data" on public.customers;
drop policy if exists "Users can update their own customer data" on public.customers;
drop policy if exists "Users can insert their own customer data" on public.customers;
drop policy if exists "Service role can manage customer data" on public.customers;

create policy "Users can view their own customer data"
    on public.customers for select
    using (auth.uid() = user_id and public.is_current_project(project_id));

create policy "Users can update their own customer data"
    on public.customers for update
    using (auth.uid() = user_id and public.is_current_project(project_id))
    with check (auth.uid() = user_id and public.is_current_project(project_id));

create policy "Users can insert their own customer data"
    on public.customers for insert
    with check (auth.uid() = user_id and public.is_current_project(project_id));

create policy "Service role can manage customer data"
    on public.customers for all
    using (auth.role() = 'service_role')
    with check (auth.role() = 'service_role');

drop policy if exists "Users can view their own subscriptions" on public.subscriptions;
drop policy if exists "Service role can manage subscriptions" on public.subscriptions;

create policy "Users can view their own subscriptions"
    on public.subscriptions for select
    using (
        public.is_current_project(project_id)
        and exists (
            select 1 from public.customers
            where customers.id = subscriptions.customer_id
              and customers.project_id = subscriptions.project_id
              and customers.user_id = auth.uid()
        )
    );

create policy "Service role can manage subscriptions"
    on public.subscriptions for all
    using (auth.role() = 'service_role')
    with check (auth.role() = 'service_role');

drop policy if exists "Users can view their own credits history" on public.credits_history;
drop policy if exists "Service role can manage credits history" on public.credits_history;

create policy "Users can view their own credits history"
    on public.credits_history for select
    using (
        public.is_current_project(project_id)
        and exists (
            select 1 from public.customers
            where customers.id = credits_history.customer_id
              and customers.project_id = credits_history.project_id
              and customers.user_id = auth.uid()
        )
    );

create policy "Service role can manage credits history"
    on public.credits_history for all
    using (auth.role() = 'service_role')
    with check (auth.role() = 'service_role');

drop policy if exists "Users can view their own generations" on public.generations;
drop policy if exists "Users can insert their own generations" on public.generations;
drop policy if exists "Service role can manage generations" on public.generations;

create policy "Users can view their own generations"
    on public.generations for select
    using (auth.uid() = user_id and public.is_current_project(project_id));

create policy "Users can insert their own generations"
    on public.generations for insert
    with check (auth.uid() = user_id and public.is_current_project(project_id));

create policy "Service role can manage generations"
    on public.generations for all
    using (auth.role() = 'service_role')
    with check (auth.role() = 'service_role');

grant select on public.app_projects to anon;
grant select on public.app_projects to authenticated;
grant all on public.app_projects to service_role;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
declare
    v_app_key text;
    v_project_id uuid;
    v_customer_id uuid;
begin
    v_app_key := coalesce(new.raw_user_meta_data ->> 'app_key', 'anima');

    select id into v_project_id
    from public.app_projects
    where key = v_app_key
    limit 1;

    if v_project_id is null then
        select id into v_project_id
        from public.app_projects
        where key = 'anima'
        limit 1;
    end if;

    if exists (
        select 1
        from public.customers
        where user_id = new.id
          and project_id = v_project_id
    ) then
        return new;
    end if;

    insert into public.customers (
        project_id,
        user_id,
        email,
        credits,
        creem_customer_id,
        created_at,
        updated_at,
        metadata
    ) values (
        v_project_id,
        new.id,
        new.email,
        30,
        'auto_' || new.id::text,
        now(),
        now(),
        jsonb_build_object(
            'source', 'auto_registration',
            'initial_credits', 30,
            'registration_date', now(),
            'app_key', v_app_key
        )
    )
    returning id into v_customer_id;

    insert into public.credits_history (
        project_id,
        customer_id,
        amount,
        type,
        description,
        created_at,
        metadata
    ) values (
        v_project_id,
        v_customer_id,
        30,
        'add',
        'Welcome bonus: 30 credits for new user',
        now(),
        jsonb_build_object(
            'source', 'welcome_bonus',
            'user_registration', true,
            'app_key', v_app_key
        )
    );

    return new;
end;
$$;

alter function public.handle_new_user() set search_path = public;

create or replace function public.decrease_credits(
    p_user_id uuid,
    p_amount integer,
    p_description text default 'AI Generation'
)
returns boolean
language plpgsql
security definer
as $$
declare
    v_customer_id uuid;
    v_current_credits integer;
    v_project_id uuid;
begin
    v_project_id := public.get_current_project_id();

    if v_project_id is null then
        return false;
    end if;

    select id, credits
    into v_customer_id, v_current_credits
    from public.customers
    where user_id = p_user_id
      and project_id = v_project_id
    for update;

    if v_customer_id is null then
        return false;
    end if;

    if p_amount < 0 then
        update public.customers
        set credits = credits - p_amount,
            updated_at = now()
        where id = v_customer_id
          and project_id = v_project_id;

        insert into public.credits_history (
            project_id,
            customer_id,
            amount,
            type,
            description,
            created_at,
            metadata
        ) values (
            v_project_id,
            v_customer_id,
            abs(p_amount),
            'add',
            p_description,
            now(),
            jsonb_build_object('action', 'refund')
        );

        return true;
    end if;

    if v_current_credits < p_amount then
        return false;
    end if;

    update public.customers
    set credits = credits - p_amount,
        updated_at = now()
    where id = v_customer_id
      and project_id = v_project_id;

    insert into public.credits_history (
        project_id,
        customer_id,
        amount,
        type,
        description,
        created_at,
        metadata
    ) values (
        v_project_id,
        v_customer_id,
        p_amount,
        'subtract',
        p_description,
        now(),
        jsonb_build_object('action', 'ai_generation')
    );

    return true;
end;
$$;

alter function public.decrease_credits(uuid, integer, text) set search_path = public;
grant execute on function public.decrease_credits(uuid, integer, text) to authenticated;
