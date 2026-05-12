import { getTranslations } from 'next-intl/server';
import { site } from '@/config/site';

export async function SoftwareApplicationSchema({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const isZh = locale === 'zh';
  const localeCode = isZh ? 'zh-CN' : 'en-US';

  const baseUrl = site.siteUrl.endsWith('/') ? site.siteUrl.slice(0, -1) : site.siteUrl;
  const orgId = `${baseUrl}/#organization`;
  const websiteId = `${baseUrl}/#website`;
  const appId = `${baseUrl}/#softwareapplication`;

  const sameAs = [site.socialLinks.linkedin, site.socialLinks.reddit].filter(
    (value): value is string => Boolean(value)
  );

  const featureList = isZh
    ? [
        '多模态输入创作流程说明',
        'Gemini Omni 能力方向与开放节奏追踪',
        '视频工作流准备与接口示例',
        '可直接访问的在线视频与图像创作工具入口',
      ]
    : [
        'Guided multimodal workflow onboarding',
        'Gemini Omni capability and rollout tracking',
        'API-style integration examples for video workflows',
        'Direct links to live video and image creation tools',
      ];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': orgId,
        name: site.siteName,
        url: site.siteUrl,
        email: site.supportEmail,
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: site.siteUrl,
        name: site.siteName,
        inLanguage: ['en-US', 'zh-CN'],
        publisher: {
          '@id': orgId,
        },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': appId,
        name: site.siteName,
        description: t('description'),
        url: `${site.siteUrl}/${isZh ? 'zh' : 'en'}`,
        inLanguage: localeCode,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web Browser',
        screenshot: new URL(site.ogImagePath, site.siteUrl).toString(),
        provider: {
          '@id': orgId,
        },
        isPartOf: {
          '@id': websiteId,
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/PreOrder',
          url: site.siteUrl,
        },
        featureList,
      },
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
