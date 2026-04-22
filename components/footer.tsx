"use client";

import { Logo } from "./logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export function Footer() {
  const pathname = usePathname();
  const t = useTranslations('footer');
  const isDashboard = /^\/(?:en|zh)?\/?dashboard(?:\/|$)/.test(pathname || "");

  // 检测当前 locale
  const pathParts = pathname?.split('/') || [];
  const currentLocale = (pathParts[1] === 'en' || pathParts[1] === 'zh') ? pathParts[1] : 'en';
  const localePrefix = `/${currentLocale}`;
  const isZh = currentLocale === "zh";

  const toolLinks = [
    { label: isZh ? "创作工作台" : "Workspace", href: `${localePrefix}/#workspace` },
    { label: isZh ? "灵感画廊" : "Showcase", href: `${localePrefix}/#showcase` },
    { label: isZh ? "价格方案" : "Pricing", href: `${localePrefix}/pricing` },
    { label: isZh ? "控制台" : "Dashboard", href: `${localePrefix}/dashboard` },
  ];

  const styleLinks = [
    { label: isZh ? "图像转视频" : "Image to Video", href: `${localePrefix}/#workspace` },
    { label: isZh ? "文本转视频" : "Text to Video", href: `${localePrefix}/#workspace` },
    { label: isZh ? "多参考生成" : "Multi-Reference Video", href: `${localePrefix}/#workspace` },
  ];

  const legalLinks = [
    { label: t('link_privacy'), href: `${localePrefix}/privacy` },
    { label: t('link_terms'), href: `${localePrefix}/terms` },
    { label: t('link_about'), href: `${localePrefix}/about` },
    { label: t('link_contact'), href: `${localePrefix}/contact` },
  ];

  if (isDashboard) {
    return (
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              {isZh ? "Seedance 2 工作流改造中" : "Seedance 2 workflow in progress"}
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-border/70 bg-[linear-gradient(180deg,rgba(7,11,21,0.92),rgba(5,8,18,0.98))]">
      <div className="container px-4 py-14 md:py-20">
        <div className="surface-panel px-6 py-8 md:px-8 md:py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-full lg:col-span-2">
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
              {t('tagline')}
            </p>
            <p className="mt-3 inline-flex rounded-full border border-border/80 bg-background/80 px-3 py-1.5 text-xs text-muted-foreground">
              {currentLocale === 'zh'
                ? '提示：真实视频能力接入后，素材会先进入受控存储，再转发到选定的视频模型服务。'
                : 'Note: once live generation is connected, uploads should be staged in controlled storage before provider handoff.'}
            </p>
          </div>

          {/* Tools - 工具内链 */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">
              {currentLocale === 'zh' ? '转换工具' : 'Tools'}
            </h3>
            <nav className="flex flex-col gap-2">
              {toolLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-all hover:translate-x-0.5 hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Styles */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">
              {currentLocale === 'zh' ? '热门风格' : 'Styles'}
            </h3>
            <nav className="flex flex-col gap-2">
              {styleLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-all hover:translate-x-0.5 hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">{t('legal')}</h3>
            <nav className="flex flex-col gap-2">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-all hover:translate-x-0.5 hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/70 pt-8 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © {new Date().getFullYear()} {t('brand')}. {t('rights')}
          </p>
          <p className="text-center text-sm text-muted-foreground md:text-right">
            {t('built_by')}
          </p>
        </div>
        </div>
      </div>
    </footer>
  );
}
