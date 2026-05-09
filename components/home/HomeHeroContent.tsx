import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Props = {
  locale: string;
};

function getQuickLinks(locale: string) {
  const localePrefix = `/${locale}`;

  return [
    {
      href: `${localePrefix}/image-to-video`,
      label: locale === "zh" ? "图生视频" : "Image to Video",
    },
    {
      href: `${localePrefix}/reference-video-generator`,
      label: locale === "zh" ? "参考视频生成" : "Reference Video",
    },
    {
      href: `${localePrefix}/video-extension`,
      label: locale === "zh" ? "视频延展" : "Video Extension",
    },
    {
      href: `${localePrefix}/pricing`,
      label: locale === "zh" ? "价格方案" : "Pricing",
    },
  ];
}

export async function HomeHeroHeading({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "hero" });

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center space-y-5 text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-black/22 px-4 py-2 text-sm text-white/80 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.7)] backdrop-blur-xl">
        <span className="inline-flex h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.75)]" />
        {locale === "zh" ? "Seedance 2 已上线" : "Seedance 2 is now live"}
      </div>
      <div className="space-y-4">
        <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
          {locale === "zh" ? (
            <>
              <span className="text-white">Seedance 2</span>
              <span className="block bg-[linear-gradient(90deg,#f8fbff_0%,#93c5fd_38%,#c4b5fd_70%,#f8fbff_100%)] bg-clip-text text-transparent">
                AI 视频生成器
              </span>
            </>
          ) : (
            <>
              <span className="text-white">Seedance 2</span>
              <span className="block bg-[linear-gradient(90deg,#f8fbff_0%,#93c5fd_38%,#c4b5fd_70%,#f8fbff_100%)] bg-clip-text text-transparent">
                AI Video Generator
              </span>
            </>
          )}
        </h1>
        <p className="mx-auto max-w-4xl text-xl leading-9 text-white/82">
          {locale === "zh"
            ? "Seedance 2 把图生视频、文生视频、参考动作生成和视频延展放进同一个多模态工作流，让创作者先写一句话，再按需补充图片、视频和音频参考。"
            : "Seedance 2 combines image to video, text to video, reference-driven motion, and video extension in one multi-modal workflow so creators can start with a single prompt and add images, clips, or audio only when needed."}
        </p>
        <p className="mx-auto max-w-3xl text-base leading-8 text-white/62">
          {t("subtitle")}
        </p>
      </div>
    </div>
  );
}

export async function HomeHeroSupport({ locale }: Props) {
  const quickLinks = getQuickLinks(locale);

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center space-y-7 text-center">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-sm text-white/78 transition-colors hover:bg-white/[0.1] hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="mx-auto grid max-w-4xl gap-3 text-left text-sm text-white/68 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/22 px-4 py-3 backdrop-blur-md">
          {locale === "zh"
            ? "先用一句话把镜头想清楚，再决定是否补图片、视频或音频参考。"
            : "Start with one clear scene description, then decide whether images, clips, or audio references are actually needed."}
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/22 px-4 py-3 backdrop-blur-md">
          {locale === "zh"
            ? "首页负责快速进入，创作中心负责角色、动作、节奏和多模态参考的细化控制。"
            : "Use the homepage to get moving quickly, then switch to the creation center when identity, motion, pacing, and references need finer control."}
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/22 px-4 py-3 backdrop-blur-md">
          {locale === "zh"
            ? "适合广告创意、角色一致性、影视预演、产品展示和短视频批量生产。"
            : "Designed for ad creative, character consistency, previs, product reveals, and repeatable short-form production."}
        </div>
      </div>
    </div>
  );
}

export default HomeHeroHeading;
