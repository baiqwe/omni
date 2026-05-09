import { galleryItems } from "@/config/gallery";
import { locales } from "@/i18n/routing";
import { site } from "@/config/site";
import { toSchemaDateTime } from "@/utils/seo/date";
import { parseDurationLabelToSeconds } from "@/utils/seo/video";

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
  const publicationDate = toSchemaDateTime("2026-04-23T00:00:00+08:00") || now;
  const entries = locales.flatMap((locale) =>
    galleryItems.map((item) => {
      const pageUrl = new URL(`/${locale}/${item.slug}`, site.siteUrl).toString();
      const thumb = new URL(item.afterImage, site.siteUrl).toString();
      const videoUrl = new URL(item.videoUrl, site.siteUrl).toString();
      const title = locale === "zh" ? item.titleZh : item.title;
      const description = locale === "zh" ? item.descriptionZh : item.description;
      const durationSeconds = parseDurationLabelToSeconds(item.durationLabel) ?? 5;

      return `
  <url>
    <loc>${escapeXml(pageUrl)}</loc>
    <lastmod>${now}</lastmod>
    <video:video>
    <video:thumbnail_loc>${escapeXml(thumb)}</video:thumbnail_loc>
      <video:title>${escapeXml(title)}</video:title>
      <video:description>${escapeXml(description)}</video:description>
      <video:content_loc>${escapeXml(videoUrl)}</video:content_loc>
      <video:player_loc>${escapeXml(pageUrl)}#showcase</video:player_loc>
      <video:duration>${durationSeconds}</video:duration>
      <video:publication_date>${escapeXml(publicationDate)}</video:publication_date>
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
