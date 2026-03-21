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
      className="rounded-2xl border border-line bg-surface px-3 py-2 text-sm font-semibold text-foreground hover:bg-surface-muted"
      onClick={() => saveLocale(target)}
    >
      {locale === "ar" ? "English" : "العربية"}
    </Link>
  );
}
