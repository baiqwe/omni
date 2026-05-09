import type { Metadata } from "next";
import { getMessages } from "next-intl/server";
import { site } from "@/config/site";
import { buildLocaleAlternates } from "@/utils/seo/metadata";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { MultiModalWorkspace } from "@/components/feature/multi-modal-workspace";
import { WorkspaceQuerySync } from "@/components/feature/workspace-query-sync";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const params = await props.params;
    const { locale } = params;
    const messages = await getMessages({ locale }) as {
        metadata: { title: string; description: string; keywords: string };
    };
    const canonical = `/${locale}/creative-center`;

    return {
        title: locale === "zh"
            ? `创作中心 | ${messages.metadata.title}`
            : `Creation Center | ${messages.metadata.title}`,
        description: locale === "zh"
            ? "进入 Seedance 2 创作中心，使用完整多模态工作台处理图生视频、文生视频、参考动作、音频节奏和视频延展。"
            : "Open the Seedance 2 creation center to use the full multi-modal workspace for image to video, text to video, reference motion, audio-guided pacing, and video extension.",
        alternates: buildLocaleAlternates(canonical),
        openGraph: {
            title: locale === "zh" ? "Seedance 2 创作中心" : "Seedance 2 Creation Center",
            description: locale === "zh"
                ? "完整多模态工作台，用于处理图片、视频、音频参考和更精细的生成控制。"
                : "The full multi-modal workspace for references, motion control, pacing, and deeper generation controls.",
            url: new URL(canonical, site.siteUrl).toString(),
        },
    };
}

export default async function CreativeCenterPage(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;

    const breadcrumbs = [
        { name: locale === "zh" ? "首页" : "Home", href: `/${locale}` },
        { name: locale === "zh" ? "创作中心" : "Creation Center", href: `/${locale}/creative-center` },
    ];

    return (
        <div className="container flex-1 px-4 py-10 md:px-6 lg:py-14">
            <div className="mx-auto max-w-6xl space-y-8">
                <Breadcrumbs items={breadcrumbs} />

                <div className="space-y-4 text-center">
                    <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/76">
                        {locale === "zh" ? "Seedance 2 创作中心" : "Seedance 2 Creation Center"}
                    </div>
                    <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                        {locale === "zh" ? "Seedance 2 完整多模态工作台" : "The full Seedance 2 multi-modal workspace"}
                    </h1>
                    <p className="mx-auto max-w-3xl text-base leading-8 text-white/66 sm:text-lg">
                        {locale === "zh"
                            ? "这里保留完整的 Seedance 2 生成器，用来处理图片、视频、音频参考，设置时长、画幅、参考策略和更细的输出控制。首页负责快速进入，这里负责真正的深度创作。"
                            : "This is the full Seedance 2 generator for image, video, and audio references, duration, aspect ratio, reference strategy, and deeper output controls. The homepage gets you moving; the creation center handles serious production work."}
                    </p>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-black/24 p-3 shadow-[0_26px_80px_-46px_rgba(0,0,0,0.82)] backdrop-blur-sm">
                    <WorkspaceQuerySync />
                    <MultiModalWorkspace locale={locale} />
                </div>
            </div>
        </div>
    );
}
