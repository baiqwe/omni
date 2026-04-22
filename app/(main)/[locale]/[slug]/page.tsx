import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { landingPageSlugs, getLocalizedLandingPage, landingPages } from "@/config/landing-pages";
import { MultiModalWorkspace } from "@/components/feature/multi-modal-workspace";
import { site } from "@/config/site";
import { locales } from "@/i18n/routing";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FAQSchema, HowToSchema } from "@/components/breadcrumb-schema";
import { buildLocaleAlternates } from "@/utils/seo/metadata";
import { InspirationGallery } from "@/components/gallery/InspirationGallery";
import { ImageGallerySchema } from "@/components/gallery/ImageGallerySchema";

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    landingPageSlugs.map((slug) => ({
      locale,
      slug,
    }))
  );
}

export async function generateMetadata(props: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const { locale, slug } = params;

  const page = getLocalizedLandingPage(slug, locale);
  if (!page) return {};

  const canonical = `/${locale}/${page.slug}`;
  const ogImage = new URL(site.ogImagePath, site.siteUrl).toString();
  const commonKeywords =
    locale === "zh"
      ? ["AI 视频生成", "多模态视频生成", "视频工作流"]
      : ["ai video generation", "multi-modal video ai", "video workflow"];

  return {
    title: page.title,
    description: page.description,
    keywords: [page.targetKeyword, ...commonKeywords],
    alternates: buildLocaleAlternates(canonical),
    openGraph: {
      title: page.title,
      description: page.description,
      type: "website",
      url: new URL(canonical, site.siteUrl).toString(),
      siteName: site.siteName,
      images: [{ url: ogImage, width: 512, height: 512, alt: site.siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export default async function LandingPage(props: { params: Promise<{ locale: string; slug: string }> }) {
  const params = await props.params;
  const { locale, slug } = params;

  const page = getLocalizedLandingPage(slug, locale);
  if (!page) notFound();

  const t = await getTranslations({ locale, namespace: "landing" });
  const localePrefix = `/${locale}`;
  const relatedPages = Object.values(landingPages)
    .filter((item) => item.slug !== page.slug)
    .slice(0, 3)
    .map((item) => getLocalizedLandingPage(item.slug, locale))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const breadcrumbItems = [
    { name: locale === "zh" ? "首页" : "Home", href: `${localePrefix}` },
    { name: page.h1, href: `${localePrefix}/${page.slug}` },
  ];
  const howToSteps = [
    { name: t("how_step1"), text: t("how_step1") },
    { name: t("how_step2"), text: t("how_step2") },
    { name: t("how_step3"), text: t("how_step3") },
  ];

  return (
    <div className="bg-background">
      <section id="anime-uploader" className="relative overflow-hidden py-12 lg:py-20">
        <div className="magic-mesh" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_30%),linear-gradient(180deg,rgba(4,7,16,0.94),rgba(6,9,18,0.98))]" />
        <div className="container px-4 md:px-6">
          <Breadcrumbs items={breadcrumbItems} className="mb-6" />
          <FAQSchema items={page.faqs} />
          <HowToSchema name={page.h1} description={page.description} steps={howToSteps} />
          <ImageGallerySchema locale={locale} useCase={page.slug} />
          <div className="mb-10 max-w-4xl space-y-4">
            <div className="section-kicker">{locale === "zh" ? "Use Case" : "Use Case"}</div>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">{page.h1}</h1>
            <p className="max-w-3xl text-lg leading-8 text-white/64">{page.subtitle}</p>
          </div>
          <MultiModalWorkspace locale={locale} />
        </div>
      </section>

      <InspirationGallery locale={locale} useCase={page.slug} anchorHrefPrefix={`/${locale}/${page.slug}`} maxItems={3} />

      <section className="border-t border-white/10 bg-[linear-gradient(180deg,rgba(6,10,20,0.98),rgba(7,11,20,0.92))] py-20">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="space-y-4">
              <div className="section-kicker">{locale === "zh" ? "执行路径" : "Execution Flow"}</div>
              <h2 className="text-3xl font-bold tracking-tight">{t("how_title", { keyword: page.targetKeyword })}</h2>
              <ol className="grid gap-3 text-muted-foreground list-decimal pl-5">
                <li>{t("how_step1")}</li>
                <li>{t("how_step2")}</li>
                <li>{t("how_step3")}</li>
              </ol>
              <div className="surface-card p-6 text-sm leading-relaxed text-muted-foreground">
                <p>
                  {locale === "zh"
                    ? `${page.h1} 的关键不是“有没有结果”，而是能不能把参考素材、镜头方向和节奏目标组织成一个可重复执行的工作流。`
                    : `${page.h1} is not about getting any result. It is about turning references, motion direction, and pacing into a workflow that can be repeated reliably.`}
                </p>
                <p className="mt-3">
                  {locale === "zh"
                    ? "这一页更像是面向具体任务的工作流模板：你可以把它当作一个场景落地页，而不是一个单独的花式滤镜入口。"
                    : "Treat this page as a workflow template for a specific production scenario, not as a one-off gimmick landing page."}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="section-kicker">FAQ</div>
              <h2 className="text-3xl font-bold tracking-tight">{t("faq_title")}</h2>
              <div className="grid gap-6">
                {page.faqs.map((faq, idx) => (
                  <div key={idx} className="surface-card p-6">
                    <div className="text-lg font-bold">{faq.question}</div>
                    <div className="mt-2 text-muted-foreground leading-relaxed">{faq.answer}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="surface-card p-5">
                <p className="text-sm text-muted-foreground">
                  {locale === "zh" ? "想先从主工作台开始？" : "Want to start from the main workspace?"}{" "}
                  <Link href={`${localePrefix}`} className="font-medium text-primary hover:underline">
                    {locale === "zh" ? "返回 Seedance 2 首页" : "Go back to the Seedance 2 homepage"}
                  </Link>
                  {locale === "zh"
                    ? "，再进入具体场景页继续做更强的定向生成。"
                    : " and then come back to this scenario page when you need a more targeted workflow."}
                </p>
              </div>
              <h2 className="text-3xl font-bold tracking-tight">
                {locale === "zh" ? "相关视频工作流" : "Related Video Workflows"}
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                {relatedPages.map((related) => (
                  <Link
                    key={related.slug}
                    href={`${localePrefix}/${related.slug}`}
                    className="surface-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
                  >
                    <div className="text-lg font-semibold">{related.h1}</div>
                    <div className="mt-2 text-sm text-muted-foreground">{related.subtitle}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
