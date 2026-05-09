import { site } from "@/config/site";

export const runtime = "nodejs";

export async function GET() {
  const body = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /*/sign-in
Disallow: /*/sign-up
Disallow: /*/forgot-password

Sitemap: ${site.siteUrl}/sitemap.xml
Sitemap: ${site.siteUrl}/page-sitemap.xml
Sitemap: ${site.siteUrl}/video-sitemap.xml
Host: ${site.siteUrl}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
