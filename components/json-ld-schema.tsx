/**
 * JSON-LD Structured Data for SoftwareApplication
 * Helps search engines understand the app as a web application
 * 
 * Note: This is a server component to avoid hydration issues
 */
import { getTranslations } from 'next-intl/server';
import { site } from '@/config/site';
import { galleryItems } from '@/config/gallery';
import { toSchemaDateTime } from '@/utils/seo/date';
import { parseDurationLabelToSeconds, secondsToIsoDuration } from '@/utils/seo/video';

export async function SoftwareApplicationSchema({ locale }: { locale: string }) {
    const t = await getTranslations({ locale, namespace: 'metadata' });
    const sameAs = [site.socialLinks.linkedin, site.socialLinks.reddit].filter(
        (value): value is string => Boolean(value)
    );

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": site.siteName,
        "url": site.siteUrl,
        "email": site.supportEmail,
        ...(sameAs.length ? { sameAs } : {}),
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": site.siteName,
        "alternateName": "Seedance 2",
        "url": site.siteUrl,
        "inLanguage": locale === "zh" ? "zh-CN" : "en-US",
        "publisher": {
            "@type": "Organization",
            "name": site.siteName,
            "url": site.siteUrl,
        },
    };

    const appSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": `${site.siteName} - Multi-Modal AI Video Workspace`,
        "description": t('description'),
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web Browser",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "Multi-modal AI video generation workspace",
            "Image, video, audio, and text references",
            "Reference-driven motion and camera control",
            "Async-ready generation queue",
            "Video extension and production workflow planning"
        ],
        "screenshot": new URL(site.ogImagePath, site.siteUrl).toString(),
        "provider": {
            "@type": "Organization",
            "name": site.siteName,
            "url": site.siteUrl
        }
    };

    const videoSchemas = galleryItems.slice(0, 3).map((item) => {
        const durationSeconds = parseDurationLabelToSeconds(item.durationLabel) ?? 5;

        return {
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": locale === "zh" ? item.titleZh : item.title,
            "description": locale === "zh" ? item.descriptionZh : item.description,
            "thumbnailUrl": new URL(item.afterImage, site.siteUrl).toString(),
            "contentUrl": new URL(item.videoUrl, site.siteUrl).toString(),
            "embedUrl": new URL(`/${locale}/${item.slug}#showcase`, site.siteUrl).toString(),
            "duration": secondsToIsoDuration(durationSeconds),
            "uploadDate": toSchemaDateTime("2026-04-23T00:00:00+08:00"),
            "publisher": {
                "@type": "Organization",
                "name": site.siteName
            }
        };
    });

    const schema = [organizationSchema, websiteSchema, appSchema, ...videoSchemas];

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
