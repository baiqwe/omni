"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { site } from "@/config/site";

export function Logo() {
  const pathname = usePathname();
  const currentLocale = pathname?.split('/')[1] || 'en';
  const localePrefix = `/${currentLocale}`;

  return (
    <Link
      href={localePrefix}
      className="flex items-center gap-3 hover:opacity-90 transition-opacity"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.05))] shadow-[0_10px_30px_-18px_rgba(34,211,238,0.3)]">
        <Image
          src="/favicon.svg"
          alt={`${site.siteName} Logo`}
          width={20}
          height={20}
          className="rounded-lg"
        />
      </div>
      <span className="font-bold text-lg bg-gradient-to-r from-cyan-200 via-white to-fuchsia-200 bg-clip-text text-transparent">
        {site.siteName}
      </span>
    </Link>
  );
}
