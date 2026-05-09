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

                <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
                        <div className="section-kicker">{locale === "zh" ? "Model Guide" : "Model Guide"}</div>
                        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">
                            {locale === "zh" ? "先决定你要更高质量，还是更快试方向。" : "Choose between higher quality and faster iteration first."}
                        </h2>
                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                            <div className="rounded-2xl border border-white/10 bg-[#141821] p-5">
                                <div className="text-lg font-semibold text-white">Seedance 2</div>
                                <p className="mt-3 text-sm leading-7 text-white/66">
                                    {locale === "zh"
                                        ? "更适合角色一致性、产品质感、镜头层次和需要多参考素材共同配合的生成任务。"
                                        : "Best for stronger identity consistency, product detail, richer shot design, and multi-reference jobs that need steadier results."}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-[#141821] p-5">
                                <div className="text-lg font-semibold text-white">Seedance 2 Fast</div>
                                <p className="mt-3 text-sm leading-7 text-white/66">
                                    {locale === "zh"
                                        ? "更适合快速试镜头方向、快速看节奏、快速验证概念，然后再决定是否切回标准模型。"
                                        : "Best for trying camera direction quickly, validating pacing, and testing concepts before moving back to the standard model."}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
                        <div className="section-kicker">{locale === "zh" ? "Current Kie Support" : "Current Kie Support"}</div>
                        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">
                            {locale === "zh" ? "当前界面只展示 Kie 公开支持集。" : "The interface currently exposes the public Kie-supported set only."}
                        </h2>
                        <ul className="mt-5 space-y-3 text-sm leading-7 text-white/66">
                            <li>{locale === "zh" ? "当前按 Kie 文档展示 720p / 16:9 / 15s，避免出现“能选但不能跑”的假参数。" : "The current UI shows 720p / 16:9 / 15s to avoid exposing settings that look selectable but are not actually runnable."}</li>
                            <li>{locale === "zh" ? "文生视频模式只需要 Prompt；图生视频模式当前按关键帧工作流展示；多参考模式继续承接图像、视频和音频参考。" : "Text-to-video starts from prompt only, image-to-video follows the keyframe workflow, and multi-reference mode keeps image, video, and audio references available."}</li>
                            <li>{locale === "zh" ? "后续如果 Kie 开放更宽的参数区间，这一层界面会再跟着扩开。" : "If Kie exposes a wider parameter range later, this layer can expand with it."}</li>
                        </ul>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {[
                        {
                            title: locale === "zh" ? "Text to Video" : "Text to Video",
                            body: locale === "zh" ? "适合先把主体、镜头和节奏说清楚，再决定后面是否需要补视觉参考。" : "Best when you want to define the subject, camera, and rhythm first, then decide later whether visual references are needed.",
                        },
                        {
                            title: locale === "zh" ? "Image to Video" : "Image to Video",
                            body: locale === "zh" ? "适合从一张起始关键帧出发，控制镜头如何推进，必要时再补尾帧目标。" : "Best when one strong keyframe should anchor the shot and the main decision is how the camera should evolve from it.",
                        },
                        {
                            title: locale === "zh" ? "Multi-Reference Video" : "Multi-Reference Video",
                            body: locale === "zh" ? "适合角色、动作、节奏都需要拆开控制的任务，也是最接近真实团队创作的入口。" : "Best when identity, motion, and rhythm all need their own inputs, which makes it the most team-like production workflow.",
                        },
                    ].map((item) => (
                        <div key={item.title} className="rounded-[22px] border border-white/10 bg-[#11161e]/88 p-5">
                            <div className="text-lg font-semibold text-white">{item.title}</div>
                            <p className="mt-3 text-sm leading-7 text-white/64">{item.body}</p>
                        </div>
                    ))}
                </div>

                <div className="rounded-[28px] border border-white/10 bg-black/24 p-3 shadow-[0_26px_80px_-46px_rgba(0,0,0,0.82)] backdrop-blur-sm">
                    <WorkspaceQuerySync />
                    <MultiModalWorkspace locale={locale} />
                </div>
            </div>
        </div>
    );
}
