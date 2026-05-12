// config/credit-packs.ts

export type PricingPlan = {
    id: string;
    productId: string; // Creem Product ID
    name: string;
    nameZh: string;
    price: number;       // 美元价格
    credits: number;     // 获得的积分
    type: 'one_time' | 'subscription';
    interval?: 'month' | 'year';
    label?: string;      // 营销标签
    labelZh?: string;
    description?: string;
    descriptionZh?: string;
    isPopular?: boolean;
    originalPrice?: number; // 原价（用于展示划线价格或计算折扣）
    badge?: string;
    badgeZh?: string;
};

// Credits will eventually become dynamic by duration and resolution.
export const CREDITS_PER_GENERATION = 1;

// === 核心定价策略 ===

// 1. Buy-out: Starter Pack
export const PLAN_MINI: PricingPlan = {
    id: "mini_refill",
    productId: "prod_6YOc0hnaYoimusgXJkh3a2",
    name: "Creator Starter",
    nameZh: "创作体验包",
    price: 4.99,
    credits: 40,
    type: 'one_time',
    description: "A small one-time pack for testing short Omni workflows.",
    descriptionZh: "适合轻量试水的单次买断包，用来体验短时长工作流。",
    originalPrice: 6.99
};

// 2. Subscription: Pro Monthly
export const PLAN_PRO_MONTHLY: PricingPlan = {
    id: "pro_monthly",
    productId: "prod_4pBVe6NzowRcuNB77DECWu",
    name: "Pro Monthly",
    nameZh: "Pro 月订阅",
    price: 29.99,
    credits: 320,
    type: 'subscription',
    interval: 'month',
    label: "Most Popular",
    labelZh: "最受欢迎",
    isPopular: true,
    description: "Monthly credits for consistent multi-modal video production.",
    descriptionZh: "适合稳定产出的多模态视频创作月度额度。",
    originalPrice: 49.99,
    badge: "Save 40%",
    badgeZh: "立省 40%"
};

export const PLAN_PRO_YEARLY: PricingPlan = {
    id: "pro_yearly",
    productId: "prod_6Yo0APx53tCUDX0ph4RBWe",
    name: "Pro Yearly",
    nameZh: "Pro 年订阅",
    price: 89.99,
    credits: 4800,
    type: 'subscription',
    interval: 'year',
    label: "Best Value",
    labelZh: "最佳价值",
    isPopular: true,
    description: "Best-value plan for teams and high-frequency production.",
    descriptionZh: "面向高频创作和团队协作的高性价比方案。",
    originalPrice: 179.99,
    badge: "Save 50%",
    badgeZh: "立省 50%"
};

// 3. Buy-out: Creator Pack
export const PLAN_ANCHOR: PricingPlan = {
    id: "lifetime_anchor",
    productId: "prod_74hGM82264trVHdwGAP897",
    name: "Production Pack",
    nameZh: "制作买断包",
    price: 19.99,
    credits: 180,
    type: 'one_time',
    description: "A larger one-time pack for client demos and campaign tests.",
    descriptionZh: "适合客户提案和营销试片的单次大包。",
    originalPrice: 24.99
};

export const ALL_PLANS = [PLAN_MINI, PLAN_PRO_MONTHLY, PLAN_PRO_YEARLY, PLAN_ANCHOR];

// 辅助函数：计算单次生成的成本
export function calculateCostPerGeneration(plan: PricingPlan): number {
    const generations = plan.credits / CREDITS_PER_GENERATION;
    return plan.price / generations;
}

// 获取本地化的包信息
export function getLocalizedPlan(plan: PricingPlan, locale: string) {
    return {
        ...plan,
        displayName: locale === 'zh' ? plan.nameZh : plan.name,
        displayLabel: locale === 'zh' ? plan.labelZh : plan.label,
        displayDescription: locale === 'zh' ? plan.descriptionZh : plan.description,
        displayBadge: locale === 'zh' ? plan.badgeZh : plan.badge,
    };
}
