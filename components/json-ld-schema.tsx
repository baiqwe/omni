/**
 * JSON-LD Structured Data for SoftwareApplication
 * Helps search engines understand the app as a web application
 * 
 * Note: This is a server component to avoid hydration issues
 */
import { getTranslations } from 'next-intl/server';
import { site } from '@/config/site';

export async function SoftwareApplicationSchema({ locale }: { locale: string }) {
    const t = await getTranslations({ locale, namespace: 'metadata' });

    const schema = {
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
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "1250"
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
