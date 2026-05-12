import type { MetadataRoute } from "next";
import { site } from "@/config/site";

const localizedPaths = ["", "/about", "/privacy", "/terms", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const path of localizedPaths) {
    const enPath = `/en${path}`;
    const zhPath = `/zh${path}`;
    const isHome = path === "";
    const changeFrequency = isHome ? "daily" : "weekly";
    const priority = isHome ? 1 : 0.7;

    entries.push({
      url: new URL(enPath, site.siteUrl).toString(),
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          "en-US": new URL(enPath, site.siteUrl).toString(),
          "zh-CN": new URL(zhPath, site.siteUrl).toString(),
        },
      },
    });

    entries.push({
      url: new URL(zhPath, site.siteUrl).toString(),
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          "en-US": new URL(enPath, site.siteUrl).toString(),
          "zh-CN": new URL(zhPath, site.siteUrl).toString(),
        },
      },
    });
  }

  return entries;
}
