import type { MetadataRoute } from "next";
import { site } from "@/config/site";

const paths = [
  "/en",
  "/zh",
  "/en/about",
  "/zh/about",
  "/en/privacy",
  "/zh/privacy",
  "/en/terms",
  "/zh/terms",
  "/en/contact",
  "/zh/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return paths.map((path) => ({
    url: new URL(path, site.siteUrl).toString(),
    lastModified,
    changeFrequency: path === "/en" || path === "/zh" ? "daily" : "weekly",
    priority: path === "/en" || path === "/zh" ? 1 : 0.7,
  }));
}
