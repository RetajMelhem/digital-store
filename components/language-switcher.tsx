"use client";

import Link from "next/link";
import { Globe } from "lucide-react";
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
      className="inline-flex h-10 shrink-0 items-center justify-center gap-0 rounded-2xl border border-white/70 bg-white/80 px-2.5 text-sm font-semibold text-foreground shadow-premium transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/5 min-[400px]:gap-2 min-[400px]:px-3 sm:h-11"
      onClick={() => saveLocale(target)}
    >
      <Globe aria-hidden="true" className="h-4 w-4" strokeWidth={1.9} />
      <span className="hidden min-[400px]:inline">{locale === "ar" ? "EN" : "AR"}</span>
    </Link>
  );
}
