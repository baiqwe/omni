import fs from "node:fs/promises";
import path from "node:path";

const ROOT = "/Users/fanqienigehamigua/Documents/seedance/anima";
const PUBLIC_DIR = path.join(ROOT, "public");
const SITE_URL = "https://seedance2video.cc";
const LOCALES = ["en", "zh"];

const landingPages = JSON.parse(
  await fs.readFile(path.join(ROOT, "config", "landing-pages.json"), "utf8")
);

const staticPages = ["", "creative-center", "guides", "pricing", "about", "contact"];
const PAGE_LASTMOD = {
  "": "2026-05-09T12:00:00+08:00",
  "creative-center": "2026-05-09T12:00:00+08:00",
  "guides": "2026-05-09T12:00:00+08:00",
  "pricing": "2026-05-02T12:00:00+08:00",
  "about": "2026-05-09T12:00:00+08:00",
  "contact": "2026-05-09T12:00:00+08:00",
};
const LANDING_LASTMOD = "2026-05-09T12:00:00+08:00";
const VIDEO_PUBLICATION_DATE = "2026-04-23T00:00:00+08:00";

const galleryItems = [
  {
    slug: "image-to-video",
    title: "Balance beam motion study",
    titleZh: "平衡木动作镜头",
    description:
      "A compact performance clip that works well as a keyframe-to-motion example for Seedance 2 image-to-video workflows.",
    descriptionZh: "一条更适合图生视频场景的动作样片：先锁住角色起始画面，再把运动感逐步推出来。",
    afterImage: "/images/gallery/custom/seedance-hero-4.png",
    videoUrl: "/videos/gallery/seedance-hero-4.mp4",
    durationLabel: "05s",
  },
  {
    slug: "ai-short-drama-maker",
    title: "Street rush sequence",
    titleZh: "街头追逐片段",
    description:
      "A fast narrative moment that fits short-drama, storyboard, and text-led video ideation with stronger urgency.",
    descriptionZh: "一条更有叙事冲突感的街头奔跑样片，适合短剧、分镜预演和文本驱动的镜头构思。",
    afterImage: "/images/gallery/custom/seedance-hero-6.png",
    videoUrl: "/videos/gallery/seedance-hero-6.mp4",
    durationLabel: "05s",
  },
  {
    slug: "reference-video-generator",
    title: "Space travel sequence",
    titleZh: "宇宙穿梭场景片段",
    description:
      "A full Seedance 2 clip that moves from stylized terrain into large-scale sci-fi worldbuilding.",
    descriptionZh: "一条完整的 Seedance 2 场景视频，从体素地貌一路推进到更宏观的宇宙世界观。",
    afterImage: "/images/gallery/custom/seedance-space-travel.png",
    videoUrl: "/videos/gallery/seedance-space-travel.mp4",
    durationLabel: "15s",
  },
  {
    slug: "storyboard-to-video",
    title: "Autumn duel sequence",
    titleZh: "秋林决斗完整片段",
    description:
      "A complete cinematic action sample with stronger blocking, camera travel, and character momentum.",
    descriptionZh: "一条完整的动作型样片，镜头调度、走位关系和人物动势都更完整。",
    afterImage: "/images/gallery/custom/seedance-autumn-duel.png",
    videoUrl: "/videos/gallery/seedance-autumn-duel.mp4",
    durationLabel: "13s",
  },
  {
    slug: "product-ad-generator",
    title: "Product reveal sequence",
    titleZh: "产品广告揭幕镜头",
    description:
      "Turn still product shots and one motion reference into a polished campaign-ready reveal.",
    descriptionZh: "把静态产品图和一段参考运镜，转成更像广告片开场的揭幕镜头。",
    afterImage: "/images/gallery/generated/ghibli.jpg",
    videoUrl: "/videos/gallery/product-reveal.mp4",
    durationLabel: "05s",
  },
  {
    slug: "dance-motion-transfer",
    title: "Dance motion transfer",
    titleZh: "舞蹈动作迁移",
    description:
      "Clone choreography timing from reference footage while preserving a fresh character identity.",
    descriptionZh: "沿用参考视频里的舞蹈节奏和动作语言，同时保持新的角色设定。",
    afterImage: "/images/gallery/generated/webtoon.jpg",
    videoUrl: "/videos/gallery/dance-motion.mp4",
    durationLabel: "05s",
  },
  {
    slug: "storyboard-to-video",
    title: "Storyboard to previs",
    titleZh: "分镜到预演视频",
    description:
      "Extend still frames into continuous camera moves for previs, blocking, and scene timing tests.",
    descriptionZh: "把静态分镜延展成连续镜头，用于影视预演、走位和节奏验证。",
    afterImage: "/images/gallery/generated/retro_90s.jpg",
    videoUrl: "/videos/gallery/storyboard-previs.mp4",
    durationLabel: "05s",
  },
  {
    slug: "image-to-video",
    title: "Image to video seed shot",
    titleZh: "图像转视频起始镜头",
    description:
      "Use still imagery as a locked visual seed, then push into motion with camera direction and timing.",
    descriptionZh: "先把静态图片当成锁定起始画面，再用运镜和节奏把它推成视频镜头。",
    afterImage: "/images/gallery/generated/cyberpunk.jpg",
    videoUrl: "/videos/gallery/image-to-video.mp4",
    durationLabel: "05s",
  },
  {
    slug: "reference-video-generator",
    title: "Reference-led video generation",
    titleZh: "多参考视频生成",
    description:
      "Blend images, clips, and audio into a single prompt-driven job instead of relying on text alone.",
    descriptionZh: "把图片、视频和音频一起融入单个任务，而不是只靠一句文字描述。",
    afterImage: "/images/gallery/generated/standard.jpg",
    videoUrl: "/videos/gallery/reference-led.mp4",
    durationLabel: "05s",
  },
  {
    slug: "video-extension",
    title: "Scene extension workflow",
    titleZh: "视频平滑扩写",
    description:
      "Continue an existing clip with the same scene logic, motion direction, and tonal continuity.",
    descriptionZh: "沿着原视频的场景逻辑、动作方向和画面气质，继续把镜头平滑扩写下去。",
    afterImage: "/images/gallery/generated/cosplay.jpg",
    videoUrl: "/videos/gallery/video-extension.mp4",
    durationLabel: "05s",
  },
];

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function secondsFromLabel(label) {
  const parsed = Number.parseInt(String(label).replace(/s$/i, ""), 10);
  return Number.isFinite(parsed) ? parsed : 5;
}

function fullUrl(pathname) {
  return new URL(pathname, SITE_URL).toString();
}

async function writePublicFile(relativePath, content) {
  const outputPath = path.join(PUBLIC_DIR, relativePath);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, content, "utf8");
}

function buildPageSitemap() {
  const staticEntries = LOCALES.flatMap((locale) =>
    staticPages.map((page) => {
      const pathName = page ? `/${locale}/${page}` : `/${locale}`;
      return {
        url: fullUrl(pathName),
        lastModified: PAGE_LASTMOD[page] || LANDING_LASTMOD,
        en: fullUrl(page ? `/en/${page}` : "/en"),
        zh: fullUrl(page ? `/zh/${page}` : "/zh"),
      };
    })
  );

  const landingEntries = LOCALES.flatMap((locale) =>
    Object.keys(landingPages).map((slug) => ({
      url: fullUrl(`/${locale}/${slug}`),
      lastModified: LANDING_LASTMOD,
      en: fullUrl(`/en/${slug}`),
      zh: fullUrl(`/zh/${slug}`),
    }))
  );

  const entries = [...staticEntries, ...landingEntries];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries
  .map(
    (entry) => `  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <xhtml:link rel="alternate" hreflang="en-US" href="${escapeXml(entry.en)}" />
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${escapeXml(entry.zh)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(entry.en)}" />
  </url>`
  )
  .join("\n")}
</urlset>
`;
}

function buildVideoSitemap() {
  const entries = LOCALES.flatMap((locale) =>
    galleryItems.map((item) => {
      const pageUrl = fullUrl(`/${locale}/${item.slug}`);
      const thumb = fullUrl(item.afterImage);
      const videoUrl = fullUrl(item.videoUrl);
      const title = locale === "zh" ? item.titleZh : item.title;
      const description = locale === "zh" ? item.descriptionZh : item.description;
      const durationSeconds = secondsFromLabel(item.durationLabel);

      return `  <url>
    <loc>${escapeXml(pageUrl)}</loc>
    <lastmod>${LANDING_LASTMOD}</lastmod>
    <video:video>
      <video:thumbnail_loc>${escapeXml(thumb)}</video:thumbnail_loc>
      <video:title>${escapeXml(title)}</video:title>
      <video:description>${escapeXml(description)}</video:description>
      <video:content_loc>${escapeXml(videoUrl)}</video:content_loc>
      <video:player_loc>${escapeXml(pageUrl)}#showcase</video:player_loc>
      <video:duration>${durationSeconds}</video:duration>
      <video:publication_date>${escapeXml(VIDEO_PUBLICATION_DATE)}</video:publication_date>
    </video:video>
  </url>`;
    })
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${entries.join("\n")}
</urlset>
`;
}

function buildSitemapIndex() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/page-sitemap.xml</loc>
    <lastmod>${LANDING_LASTMOD}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/video-sitemap.xml</loc>
    <lastmod>${LANDING_LASTMOD}</lastmod>
  </sitemap>
</sitemapindex>
`;
}

function buildRobots() {
  return `User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /*/sign-in
Disallow: /*/sign-up
Disallow: /*/forgot-password

Sitemap: ${SITE_URL}/sitemap.xml
Sitemap: ${SITE_URL}/page-sitemap.xml
Sitemap: ${SITE_URL}/video-sitemap.xml
Host: ${SITE_URL}
`;
}

await writePublicFile("page-sitemap.xml", buildPageSitemap());
await writePublicFile("video-sitemap.xml", buildVideoSitemap());
await writePublicFile("sitemap.xml", buildSitemapIndex());
await writePublicFile("robots.txt", buildRobots());

console.log("Generated static SEO files in public/");
