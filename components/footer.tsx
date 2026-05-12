"use client";

import { Logo } from "./logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/config/site";

export function Footer() {
  const pathname = usePathname();
  const currentLocale = pathname?.split("/")[1] === "zh" ? "zh" : "en";
  const isZh = currentLocale === "zh";
  const localePrefix = `/${currentLocale}`;

  const productLinks = [
    { label: "Seedance2Video", href: "https://seedance2video.cc" },
    { label: "GPTImage2", href: "https://gptimage2.online" },
  ];

  const pageLinks = [
    { label: isZh ? "概览" : "Overview", href: "#overview" },
    { label: isZh ? "能力预览" : "Capabilities", href: "#capabilities" },
    { label: isZh ? "开放进展" : "Rollout", href: "#indexing" },
    { label: isZh ? "接口示例" : "API", href: "#api" },
    { label: isZh ? "常见问题" : "FAQ", href: "#faq" },
  ];

  return (
    <footer className="border-t border-border/70 bg-[linear-gradient(180deg,rgba(7,11,21,0.92),rgba(5,8,18,0.98))]">
      <div className="container px-4 py-14 md:py-20">
        <div className="surface-panel px-6 py-8 md:px-8 md:py-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <Logo />
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {isZh
                  ? "面向创作者的 Gemini Omni 单页站点，帮助你快速了解能力、跟踪开放进展，并尽快开始创作。"
                  : "A user-first Gemini Omni single-page site to understand capabilities, track rollout progress, and start creating sooner."}
              </p>
              <p className="mt-3 inline-flex rounded-full border border-border/80 bg-background/80 px-3 py-1.5 text-xs text-muted-foreground">
                {isZh ? "状态：功能逐步开放中" : "Status: features rolling out"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold">{isZh ? "页面导航" : "Page Navigation"}</h3>
              <nav className="mt-3 flex flex-col gap-2">
                {pageLinks.map((link) => (
                  <a key={link.href} href={link.href} className="text-sm text-muted-foreground transition-all hover:translate-x-0.5 hover:text-primary">
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            <div>
              <h3 className="text-sm font-semibold">{isZh ? "替代工具入口" : "Alternative Tools"}</h3>
              <nav className="mt-3 flex flex-col gap-2">
                {productLinks.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground transition-all hover:translate-x-0.5 hover:text-primary">
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="mt-4 text-sm text-muted-foreground">
                <Link href={`${localePrefix}/privacy`} className="hover:text-primary">
                  {isZh ? "隐私政策" : "Privacy"}
                </Link>
                <span className="mx-2 text-muted-foreground/50">/</span>
                <Link href={`${localePrefix}/terms`} className="hover:text-primary">
                  {isZh ? "服务条款" : "Terms"}
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/70 pt-8 md:flex-row">
            <p className="text-center text-sm text-muted-foreground md:text-left">
              © {new Date().getFullYear()} {site.siteName}. {isZh ? "保留所有权利。" : "All rights reserved."}
            </p>
            <p className="text-center text-sm text-muted-foreground md:text-right">
              {isZh ? "为真实创作流程而构建" : "Built for real creative workflows"}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
