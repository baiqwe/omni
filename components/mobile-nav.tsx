"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { Link, stripLocalePrefix } from "@/i18n/routing";

interface MobileNavProps {
  items: { id: string; label: string; href: string }[];
  currentLocale?: string;
}

export function MobileNav({ items, currentLocale = "en" }: MobileNavProps) {
  const pathname = usePathname();
  const pathWithoutLocale = stripLocalePrefix(pathname);
  const menuLabel = currentLocale === "zh" ? "打开导航菜单" : "Open navigation menu";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label={menuLabel} title={menuLabel}>
          <Menu className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">{menuLabel}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>{currentLocale === "zh" ? "导航" : "Navigation"}</SheetTitle>
        </SheetHeader>

        <div className="mt-4 flex items-center gap-2 border-b pb-4">
          <span className="text-sm text-muted-foreground">{currentLocale === "zh" ? "语言:" : "Language:"}</span>
          <Link
            href={pathWithoutLocale}
            locale="en"
            className={`rounded px-3 py-1.5 text-sm transition-colors ${
              currentLocale === "en" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            EN
          </Link>
          <Link
            href={pathWithoutLocale}
            locale="zh"
            className={`rounded px-3 py-1.5 text-sm transition-colors ${
              currentLocale === "zh" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            中文
          </Link>
        </div>

        <nav className="mt-4 flex flex-col gap-4">
          {items.map((item) => (
            <a key={item.id} href={item.href} className="text-lg font-semibold text-muted-foreground transition-colors hover:text-primary">
              {item.label}
            </a>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
