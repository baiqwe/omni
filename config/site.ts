export type SiteConfig = {
  siteName: string;
  siteUrl: string;
  ogImagePath: string;
  supportEmail: string;
  googleSiteVerification?: string;
  socialLinks: {
    linkedin?: string;
    reddit?: string;
  };
};

const PRODUCTION_SITE_URL = "https://seedance2video.cc";
const SUPPORT_EMAIL_FALLBACK = "hello@seedance2video.cc";
const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "0.0.0.0"]);
const PLACEHOLDER_SUPPORT_EMAILS = new Set(["support@example.com", "hello@example.com"]);

function normalizeSiteUrl(url: string): string {
  try {
    const u = new URL(url);
    if (LOCAL_HOSTNAMES.has(u.hostname)) {
      return PRODUCTION_SITE_URL;
    }
    return u.origin;
  } catch {
    return PRODUCTION_SITE_URL;
  }
}

function normalizeSupportEmail(email?: string): string {
  const value = email?.trim().toLowerCase();
  if (!value || PLACEHOLDER_SUPPORT_EMAILS.has(value)) {
    return SUPPORT_EMAIL_FALLBACK;
  }
  return email!;
}

export const site: SiteConfig = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || "Seedance 2.0",
  siteUrl: normalizeSiteUrl(process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_SITE_URL),
  ogImagePath: process.env.NEXT_PUBLIC_OG_IMAGE_PATH || "/web-app-manifest-512x512.png",
  supportEmail: normalizeSupportEmail(process.env.NEXT_PUBLIC_SUPPORT_EMAIL),
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  socialLinks: {
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL,
    reddit: process.env.NEXT_PUBLIC_REDDIT_URL,
  },
};
