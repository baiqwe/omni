import { site } from "@/config/site";

export const runtime = "nodejs";

function xml(body: string) {
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

export async function GET() {
  const generatedAt = "2026-05-09T12:00:00+08:00";
  const index = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${site.siteUrl}/page-sitemap.xml</loc>
    <lastmod>${generatedAt}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${site.siteUrl}/video-sitemap.xml</loc>
    <lastmod>${generatedAt}</lastmod>
  </sitemap>
</sitemapindex>`;

  return xml(index);
}
