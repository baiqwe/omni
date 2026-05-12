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
        "alternateName": "Gemini Omni Hub",
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
        "name": `${site.siteName} - Gemini Omni Intelligence Hub`,
        "description": t('description'),
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web Browser",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/PreOrder",
            "url": site.siteUrl
        },
        "featureList": [
            "Gemini Omni launch signal monitoring",
            "Google Omni Video Model capability tracking",
            "Multimodal AI video trend aggregation",
            "Rapid indexing and schema-ready landing structure",
            "Traffic routing to production-ready AI tools"
        ],
        "screenshot": new URL(site.ogImagePath, site.siteUrl).toString(),
        "provider": {
            "@type": "Organization",
            "name": site.siteName,
            "url": site.siteUrl
        }
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is Gemini Omni?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Gemini Omni refers to Google's emerging multimodal AI direction combining text, image, audio, and video capabilities."
                }
            },
            {
                "@type": "Question",
                "name": "How to access Gemini Omni?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Access depends on official rollout and API release timelines announced by Google."
                }
            }
        ]
    };

    const schema = [organizationSchema, websiteSchema, appSchema, faqSchema];

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
