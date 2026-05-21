"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Locale } from "@/lib/constants";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const target = locale === "ar" ? "en" : "ar";
  const nextPath = pathname.replace(/^\/(ar|en)/, `/${target}`);
  const nextUrl = searchParams.toString() ? `${nextPath}?${searchParams.toString()}` : nextPath || `/${target}`;

  function saveLocale(nextLocale: Locale) {
    document.cookie = `locale=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
  }

  return (
    <Link
      href={nextUrl}
      aria-label={locale === "ar" ? "Switch language to English" : "Change language to Arabic"}
      className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm font-semibold text-foreground shadow-sm hover:bg-surface-muted"
      onClick={() => saveLocale(target)}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.9]">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14.5 14.5 0 0 1 0 18M12 3a14.5 14.5 0 0 0 0 18" strokeLinecap="round" />
      </svg>
      <span>{locale === "ar" ? "EN" : "AR"}</span>
    </Link>
  );
}
