"use client";

import { Logo } from "./logo";
import { usePathname } from "next/navigation";
import { MobileNav } from "./mobile-nav";
import { getLocaleFromPathname, Link, stripLocalePrefix } from "@/i18n/routing";

interface NavItem {
  id: string;
  label: string;
  href: string;
}

export default function Header() {
  const pathname = usePathname();
  const currentLocale = getLocaleFromPathname(pathname);
  const pathWithoutLocale = stripLocalePrefix(pathname);

  const mainNavItems: NavItem[] = [
    { id: "overview", label: currentLocale === "zh" ? "概览" : "Overview", href: "#overview" },
    { id: "capabilities", label: currentLocale === "zh" ? "能力预览" : "Capabilities", href: "#capabilities" },
    { id: "indexing", label: currentLocale === "zh" ? "开放进展" : "Rollout", href: "#indexing" },
    { id: "api", label: "API", href: "#api" },
    { id: "faq", label: "FAQ", href: "#faq" },
  ];

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-white/6 bg-black/70 backdrop-blur-xl supports-[backdrop-filter]:bg-black/55">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Logo />
        </div>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-5 md:flex">
          {mainNavItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="text-sm font-medium text-white/66 transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="mr-2 hidden items-center gap-1 rounded-full border border-white/8 bg-white/[0.03] p-1 md:flex">
            <Link
              href={pathWithoutLocale}
              locale="en"
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                currentLocale === "en" ? "bg-white text-black shadow-sm" : "text-white/50 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              EN
            </Link>
            <Link
              href={pathWithoutLocale}
              locale="zh"
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                currentLocale === "zh" ? "bg-white text-black shadow-sm" : "text-white/50 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              中文
            </Link>
          </div>

          <MobileNav items={mainNavItems} currentLocale={currentLocale} />
        </div>
      </div>
    </header>
  );
}
