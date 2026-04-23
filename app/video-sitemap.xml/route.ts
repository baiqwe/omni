import { galleryItems } from "@/config/gallery";
import { locales } from "@/i18n/routing";
import { site } from "@/config/site";

export const runtime = "nodejs";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const now = new Date().toISOString();
  const entries = locales.flatMap((locale) =>
    galleryItems.map((item) => {
      const pageUrl = new URL(`/${locale}/${item.slug}`, site.siteUrl).toString();
      const thumb = new URL(item.afterImage, site.siteUrl).toString();
      const title = locale === "zh" ? item.titleZh : item.title;
      const description = locale === "zh" ? item.descriptionZh : item.description;

      return `
  <url>
    <loc>${escapeXml(pageUrl)}</loc>
    <lastmod>${now}</lastmod>
    <video:video>
      <video:thumbnail_loc>${escapeXml(thumb)}</video:thumbnail_loc>
      <video:title>${escapeXml(title)}</video:title>
      <video:description>${escapeXml(description)}</video:description>
      <video:content_loc>${escapeXml(thumb)}</video:content_loc>
      <video:player_loc>${escapeXml(pageUrl)}#showcase</video:player_loc>
      <video:duration>5</video:duration>
    </video:video>
  </url>`;
    })
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${entries.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
