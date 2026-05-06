import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Props = {
  locale: string;
};

export default async function HomeHeroContent({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "hero" });
  const localePrefix = `/${locale}`;
  const quickLinks = [
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

  return (
    <div className="mx-auto max-w-5xl space-y-6 text-center">
      <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm text-white/72">
        {locale === "zh"
          ? "Seedance 2.0 • 多模态 AI 视频生成工作台"
          : "Seedance 2.0 • Multi-Modal AI Video Workspace"}
      </div>
      <div className="space-y-4">
        <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
          {locale === "zh" ? "Multi-Modal AI Video Generator" : "Multi-Modal AI Video Generator"}
        </h1>
        <p className="mx-auto max-w-4xl text-xl leading-9 text-white/78">
          {locale === "zh"
            ? "Seedance 2 将文本、图片、视频和音频参考组合进同一个创作工作台，帮助团队完成图生视频、文生视频、参考动作生成、视频延展和广告级 AI 视频制作。"
            : "Seedance 2 combines text, image, video, and audio references in one workspace for image to video, text to video, reference-driven motion, video extension, and production-ready AI video generation."}
        </p>
        <p className="mx-auto max-w-3xl text-base leading-8 text-white/58">
          {t("subtitle")}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/72 transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className="mx-auto grid max-w-4xl gap-3 text-left text-sm text-white/64 md:grid-cols-3">
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
          {locale === "zh"
            ? "支持 image to video、text to video、video to video 与 audio-guided generation。"
            : "Supports image to video, text to video, video to video, and audio-guided generation."}
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
          {locale === "zh"
            ? "适合广告创意、影视预演、角色一致性、产品展示和短视频批量生产。"
            : "Built for ad creative, previs, character consistency, product reveals, and repeatable short-form output."}
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
          {locale === "zh"
            ? "工作台已包含异步任务、预签名上传、视频 sitemap 和多语言 SEO 基础设施。"
            : "The workspace already includes async jobs, signed uploads, video sitemaps, and multilingual SEO foundations."}
        </div>
      </div>
    </div>
  );
}
