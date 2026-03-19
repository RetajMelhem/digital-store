"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Locale } from "@/lib/constants";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const target = locale === "ar" ? "en" : "ar";
  const nextPath = pathname.replace(/^\/(ar|en)/, `/${target}`);

  function saveLocale(nextLocale: Locale) {
    document.cookie = `locale=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
  }

  return (
    <Link
      href={nextPath || `/${target}`}
      className="rounded-2xl border border-line bg-surface px-3 py-2 text-sm font-semibold text-foreground hover:bg-surface-muted"
      onClick={() => saveLocale(target)}
    >
      {locale === "ar" ? "English" : "العربية"}
    </Link>
  );
}
