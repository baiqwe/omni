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
      className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[linear-gradient(135deg,#5ad7ff,#7d57ff)] shadow-[0_8px_20px_-12px_rgba(80,120,255,0.8)]">
        <Image
          src="/favicon.svg"
          alt={`${site.siteName} Logo`}
          width={16}
          height={16}
          className="rounded-full"
        />
      </div>
      <span className="text-base font-semibold tracking-tight text-white">
        {site.siteName}
      </span>
    </Link>
  );
}
