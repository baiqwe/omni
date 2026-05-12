import { site } from "@/config/site";
import { getLocalizedGalleryItems } from "@/config/gallery";
import type { LandingPageSlug } from "@/config/landing-pages";

export function ImageGallerySchema({
  locale,
  useCase,
}: {
  locale: string;
  useCase?: LandingPageSlug;
}) {
  const items = getLocalizedGalleryItems(locale, useCase);

  const schema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: locale === "zh" ? "Gemini Omni 灵感画廊" : "Gemini Omni Inspiration Gallery",
    associatedMedia: items.map((item) => ({
      "@type": "ImageObject",
      contentUrl: new URL(item.afterImage, site.siteUrl).toString(),
      thumbnailUrl: new URL(item.beforeThumb, site.siteUrl).toString(),
      caption: item.altLabel,
      description: item.descriptionLabel,
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
