"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Check, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { SUBSCRIPTION_TIERS, CREDITS_TIERS } from "@/config/subscriptions";

interface PricingClientProps {
    locale: string;
}

type CheckoutResponse = {
    checkout_url?: string;
    error?: string;
};

export default function PricingClient({ locale }: PricingClientProps) {
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    const isZh = locale === 'zh';

    const handleCheckout = async (priceId: string, productType: string, credits?: number) => {
        if (!priceId) return;
        setLoadingId(priceId);

        try {
            const formData = new FormData();
            formData.append("priceId", priceId);
            formData.append("productType", productType);
            if (credits) formData.append("credits", credits.toString());

            const response = await fetch("/api/creem/checkout", {
                method: "POST",
                body: formData,
            });

            if (response.status === 401) {
                router.push(`/${locale}/sign-in`);
                return;
            }

            const data = (await response.json()) as CheckoutResponse;

            if (data.checkout_url) {
                window.location.href = data.checkout_url;
            } else {
                throw new Error(data.error || "Checkout failed");
            }
        } catch (error) {
            toast({
                title: isZh ? "错误" : "Error",
                description: isZh ? "支付初始化失败" : "Failed to initiate checkout",
                variant: "destructive",
            });
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="container py-10 px-4 max-w-6xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">
                    {isZh ? '选择适合您的方案' : 'Choose Your Plan'}
                </h1>
                <p className="text-muted-foreground text-lg">
                    {isZh ? '灵活的定价方案，满足您的各种需求' : 'Flexible pricing to meet your needs'}
                </p>
            </div>

            {/* 订阅计划 */}
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                {isZh ? '订阅计划' : 'Subscription Plans'}
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mb-16">
                {SUBSCRIPTION_TIERS.map((tier) => (
                    <Card
                        key={tier.id}
                        className={`flex flex-col relative ${tier.featured ? 'border-primary shadow-lg scale-105' : ''}`}
                    >
                        {tier.featured && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                                {isZh ? '推荐' : 'Popular'}
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle className="text-xl">{tier.name}</CardTitle>
                            <CardDescription>{tier.description}</CardDescription>
                            <div className="text-3xl font-bold mt-2">
                                {tier.priceMonthly}
                                <span className="text-base font-normal text-muted-foreground">
                                    /{isZh ? '月' : 'mo'}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-3 text-sm">
                                {tier.features?.map((feature, i) => (
                                    <li key={i} className="flex gap-2">
                                        <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                variant={tier.featured ? "default" : "outline"}
                                onClick={() => handleCheckout(tier.productId, "subscription")}
                                disabled={loadingId === tier.productId}
                            >
                                {loadingId === tier.productId && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isZh ? '立即订阅' : 'Subscribe Now'}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* 积分包 */}
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                {isZh ? '积分包' : 'Credit Packs'}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
                {CREDITS_TIERS.map((tier) => (
                    <Card
                        key={tier.id}
                        className={`flex flex-col ${tier.featured ? 'border-yellow-500 shadow-lg' : ''}`}
                    >
                        <CardHeader>
                            <CardTitle className="text-xl">{tier.name}</CardTitle>
                            <CardDescription>{tier.description}</CardDescription>
                            <div className="text-3xl font-bold mt-2">
                                {tier.priceMonthly}
                                <span className="text-base font-normal text-muted-foreground ml-2">
                                    ({tier.creditAmount} {isZh ? '积分' : 'credits'})
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-3 text-sm">
                                {tier.features?.map((feature, i) => (
                                    <li key={i} className="flex gap-2">
                                        <Check className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => handleCheckout(tier.productId, "credits", tier.creditAmount)}
                                disabled={loadingId === tier.productId}
                            >
                                {loadingId === tier.productId && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isZh ? '购买积分' : 'Buy Credits'}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
