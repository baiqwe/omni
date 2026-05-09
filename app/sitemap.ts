import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { locales } from "@/i18n/routing";
import { indexableLandingPageSlugs } from "@/config/landing-pages";

const staticPages = ["", "creative-center", "guides", "pricing", "about", "contact"];
const PAGE_LASTMOD: Record<string, string> = {
  "": "2026-05-09T12:00:00+08:00",
  "creative-center": "2026-05-09T12:00:00+08:00",
  "guides": "2026-05-09T12:00:00+08:00",
  "pricing": "2026-05-02T12:00:00+08:00",
  "about": "2026-05-09T12:00:00+08:00",
  "contact": "2026-05-09T12:00:00+08:00",
};
const LANDING_LASTMOD = "2026-05-09T12:00:00+08:00";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = locales.flatMap((locale) =>
    staticPages.map((page) => {
      const path = page ? `/${locale}/${page}` : `/${locale}`;
      return {
        url: new URL(path, site.siteUrl).toString(),
        lastModified: new Date(PAGE_LASTMOD[page] || LANDING_LASTMOD),
        changeFrequency: page ? "weekly" : "daily",
        priority: page ? 0.8 : 1,
        alternates: {
          languages: {
            "en-US": new URL(page ? `/en/${page}` : "/en", site.siteUrl).toString(),
            "zh-CN": new URL(page ? `/zh/${page}` : "/zh", site.siteUrl).toString(),
          },
        },
      } satisfies MetadataRoute.Sitemap[number];
    })
  );

  const landingEntries = locales.flatMap((locale) =>
    indexableLandingPageSlugs.map((slug) => ({
      url: new URL(`/${locale}/${slug}`, site.siteUrl).toString(),
      lastModified: new Date(LANDING_LASTMOD),
      changeFrequency: "weekly" as const,
      priority: 0.9,
      alternates: {
        languages: {
          "en-US": new URL(`/en/${slug}`, site.siteUrl).toString(),
          "zh-CN": new URL(`/zh/${slug}`, site.siteUrl).toString(),
        },
      },
    }))
  );

  return [...staticEntries, ...landingEntries];
}
