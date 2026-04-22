"use client";

import { signOutAction } from "@/app/actions";
import { Button } from "./ui/button";
import { Logo } from "./logo";
import { usePathname } from "next/navigation";
import { MobileNav } from "./mobile-nav";
import { useTranslations } from "next-intl";
import { useUser } from "@/hooks/use-user";
import { getLocaleFromPathname, Link, stripLocalePrefix } from "@/i18n/routing";
import { Skeleton } from "./ui/skeleton";

interface NavItem {
  id: string;
  label: string;
  href: string;
}

export default function Header() {
  const pathname = usePathname();
  const t = useTranslations('nav');
  const isDashboard = /^\/(?:en|zh)?\/?dashboard(?:\/|$)/.test(pathname || "");
  const { user, loading } = useUser();
  const currentLocale = getLocaleFromPathname(pathname);
  const pathWithoutLocale = stripLocalePrefix(pathname);

  // Main navigation items
  const mainNavItems: NavItem[] = [
    { id: "home", label: t('home'), href: '/' },
    { id: "tools", label: t('tools'), href: '/#showcase' },
    { id: "pricing", label: t('pricing'), href: '/pricing' },
    { id: "about", label: t('about'), href: '/#workspace' },
  ];

  // Dashboard items
  const dashboardItems: NavItem[] = [];
  const navItems = isDashboard ? dashboardItems : mainNavItems;

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-border/80 bg-background/[0.88] shadow-[0_14px_40px_-34px_rgba(27,31,45,0.28)] backdrop-blur-2xl supports-[backdrop-filter]:bg-background/[0.78]">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Centered Navigation */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-border/80 bg-background/[0.94] px-2 py-1 shadow-[0_10px_35px_-24px_rgba(27,31,45,0.18)] backdrop-blur-xl md:flex">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-foreground/75 transition-all duration-300 hover:scale-[1.02] hover:bg-primary/[0.1] hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Pass locale-free href to the locale-aware Link component. */}
          <div className="mr-2 hidden items-center gap-1 rounded-full border border-border/80 bg-background/[0.94] p-1 shadow-[0_10px_35px_-24px_rgba(27,31,45,0.18)] md:flex">
            <Link
              href={pathWithoutLocale}
              locale="en"
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${currentLocale === 'en'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
            >
              EN
            </Link>
            <Link
              href={pathWithoutLocale}
              locale="zh"
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${currentLocale === 'zh'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
            >
              中文
            </Link>
          </div>

          {loading ? (
            <div className="hidden md:flex gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-24" />
            </div>
          ) : user ? (
            <div className="hidden md:flex items-center gap-2">
              <Button asChild size="sm" variant="ghost">
                <Link href="/dashboard">
                  {currentLocale === 'zh' ? '控制台' : 'Dashboard'}
                </Link>
              </Button>
              <form action={signOutAction}>
                <Button type="submit" variant="outline" size="sm">
                  {t('sign_out')}
                </Button>
              </form>
            </div>
          ) : (
            <div className="hidden md:flex gap-2">
              <Button asChild size="sm" variant="outline" className="rounded-full">
                <Link href="/sign-in">{t('sign_in')}</Link>
              </Button>
              <Button asChild size="sm" className="rounded-full shadow-[0_16px_30px_-18px_hsl(var(--primary))]">
                <Link href="/sign-up">{t('sign_up')}</Link>
              </Button>
            </div>
          )}
          <MobileNav items={navItems} user={user} loading={loading} isDashboard={isDashboard} currentLocale={currentLocale} />
        </div>
      </div>
    </header>
  );
}
