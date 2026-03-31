"use client";

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import {
    PLAN_MINI,
    PLAN_PRO_MONTHLY,
    PLAN_PRO_YEARLY,
    PLAN_ANCHOR,
    CREDITS_PER_GENERATION,
    calculateCostPerGeneration,
    getLocalizedPlan,
    PricingPlan
} from "@/config/credit-packs";

interface PricingSectionProps {
    locale: string;
}

export function PricingSection({ locale }: PricingSectionProps) {
    const t = useTranslations('Pricing');
    const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

    const handlePurchase = async (plan: PricingPlan) => {
        try {
            setLoadingPlanId(plan.id);

            const formData = new FormData();
            formData.append('priceId', plan.productId);
            formData.append('productType', plan.type === 'subscription' ? 'subscription' : 'credits');

            if (plan.credits) {
                formData.append('credits', plan.credits.toString());
            }

            // Redirect back to current page (pricing) or dashboard
            const successUrl = new URL(window.location.href);
            successUrl.pathname = `/${locale}/dashboard`;
            successUrl.searchParams.set('checkout', 'success');
            formData.append('redirectUrl', successUrl.toString());

            const response = await fetch('/api/creem/checkout', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Checkout failed');
            }

            if (data.checkout_url) {
                window.location.href = data.checkout_url;
            } else {
                toast({
                    title: t('error'),
                    description: "Failed to initialize checkout.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Payment error:', error);
            toast({
                title: t('error'),
                description: "Failed to start payment process.",
                variant: "destructive"
            });
        } finally {
            setLoadingPlanId(null);
        }
    };

    // Prepare plans
    const miniPlan = getLocalizedPlan(PLAN_MINI, locale);
    const proMonthlyPlan = getLocalizedPlan(PLAN_PRO_MONTHLY, locale);
    const proYearlyPlan = getLocalizedPlan(PLAN_PRO_YEARLY, locale);
    const anchorPlan = getLocalizedPlan(PLAN_ANCHOR, locale);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(price);
    };

    const renderCard = (
        plan: PricingPlan & { displayName: string, displayLabel?: string, displayDescription?: string },
        highlightType: 'none' | 'popular' | 'best_value' = 'none'
    ) => {
        const costPerGen = calculateCostPerGeneration(plan);
        const refCost = calculateCostPerGeneration(PLAN_ANCHOR); // Anchor price per gen

        const isHighlight = highlightType !== 'none';
        const savings = isHighlight ? Math.round((1 - costPerGen / refCost) * 100) : 0;

        let borderColor = "border-border";
        let shadowClass = "shadow-sm hover:shadow-md";
        let labelColor = "bg-muted text-foreground";
        let buttonClass = "bg-background border-2 border-primary/20 hover:border-primary text-foreground hover:bg-muted";

        if (highlightType === 'popular') {
            borderColor = "border-primary shadow-xl scale-105 z-10";
            shadowClass = "shadow-2xl";
            labelColor = "bg-gradient-to-r from-primary to-purple-600 text-white";
            buttonClass = "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl";
        } else if (highlightType === 'best_value') {
            borderColor = "border-green-500 shadow-xl scale-105 z-10";
            shadowClass = "shadow-2xl";
            labelColor = "bg-green-600 text-white";
            buttonClass = "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl";
        }

        return (
            <div
                key={plan.id}
                className={cn(
                    "relative flex flex-col p-6 rounded-2xl bg-card border transition-all duration-300 h-full",
                    borderColor,
                    shadowClass,
                    !isHighlight && "opacity-90 hover:opacity-100 hover:border-primary/50"
                )}
            >
                {plan.displayLabel && (
                    <div className={cn(
                        "absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-bold shadow-sm whitespace-nowrap",
                        labelColor
                    )}>
                        {plan.displayLabel}
                    </div>
                )}

                <div className="mb-5 text-center">
                    <h3 className="text-xl font-bold">{plan.displayName}</h3>
                    <p className="text-sm text-muted-foreground mt-1 min-h-[40px] flex items-center justify-center">{plan.displayDescription}</p>
                </div>

                <div className="flex items-baseline justify-center gap-1 mb-6">
                    <span className="text-3xl font-extrabold">{formatPrice(plan.price)}</span>
                    {plan.interval && (
                        <span className="text-muted-foreground text-sm">/{plan.interval === 'month' ? t('month') : t('year')}</span>
                    )}
                </div>

                <div className="space-y-4 mb-8 flex-1">
                    <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground text-sm">{t('credits')}</span>
                        <span className="font-bold flex items-center gap-1">
                            {plan.credits.toLocaleString()}
                            <span className="text-xs font-normal text-muted-foreground">pts</span>
                        </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground text-sm">{t('generations')}</span>
                        <span className="font-bold">≈ {Math.floor(plan.credits / CREDITS_PER_GENERATION)}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b bg-muted/20 px-2 rounded">
                        <span className="text-xs text-muted-foreground">{t('price_per_image')}</span>
                        <div className="text-right flex flex-col items-end">
                            <span className={cn("font-bold text-sm", isHighlight ? "text-green-600 dark:text-green-400" : "text-muted-foreground")}>
                                ${costPerGen.toFixed(3)}
                            </span>
                            {isHighlight && (
                                <span className="text-[10px] text-green-600 font-bold bg-green-100 dark:bg-green-900/30 px-1 rounded">
                                    -{savings}%
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-4">
                    <Button
                        className={cn(
                            "w-full font-bold h-12 text-md transition-transform active:scale-95",
                            buttonClass
                        )}
                        onClick={() => handlePurchase(plan)}
                        disabled={!!loadingPlanId}
                    >
                        {loadingPlanId === plan.id ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : highlightType === 'popular' ? t('start_pro') : t('get_pack')}
                    </Button>

                    {/* Secure Payment Note */}
                    <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground opacity-70">
                        <Check className="w-3 h-3" />
                        <span>Secure via Creem</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-12">
            {/* Header */}
            <div className="text-center mb-12 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                    {t('title')}
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    {t('subtitle')}
                </p>
            </div>

            {/* Pricing Grid - 4 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start max-w-7xl mx-auto">
                {/* 1. Mini Refill */}
                <div className="lg:mt-8 h-full">
                    {renderCard(miniPlan, 'none')}
                </div>

                {/* 2. Pro Monthly (Popular) */}
                <div className="h-full transform lg:-translate-y-2">
                    {renderCard(proMonthlyPlan, 'popular')}
                </div>

                {/* 3. Pro Yearly (Best Value) */}
                <div className="h-full transform lg:-translate-y-2">
                    {renderCard(proYearlyPlan, 'best_value')}
                </div>

                {/* 4. Lifetime Anchor */}
                <div className="lg:mt-8 h-full">
                    {renderCard(anchorPlan, 'none')}
                </div>
            </div>
        </div>
    );
}

// Default export if needed
export default PricingSection;
