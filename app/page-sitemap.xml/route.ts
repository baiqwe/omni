import { escapeXml, getPageSitemapEntries } from "@/utils/seo/sitemap";

export const runtime = "nodejs";

export async function GET() {
  const entries = getPageSitemapEntries();

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries
  .map(
    (entry) => `  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <xhtml:link rel="alternate" hreflang="en-US" href="${escapeXml(entry.alternates["en-US"])}" />
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${escapeXml(entry.alternates["zh-CN"])}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(entry.alternates["en-US"])}" />
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
