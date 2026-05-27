"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Locale } from "@/lib/constants";
import { dictionary } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";
import { CartBadge } from "@/components/cart-badge";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = dictionary[locale];
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const isHome = pathname === `/${locale}`;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: t.home, exact: true },
    { href: `/${locale}/products`, label: t.products }
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        isHome && !isScrolled ? "bg-transparent" : "glass-panel border-b border-line/70"
      )}
    >
      <div className={cn("container-page", isHome && !isScrolled ? "py-5" : "py-3")}>
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <Link href={`/${locale}`} className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-transparent sm:h-10 sm:w-10">
              <Image src="/images/our logo/our logo.png" alt={`${t.brand} logo`} width={40} height={40} className="h-full w-full object-cover" priority />
            </div>
            <div className="min-w-0">
              <span className="block truncate text-lg font-semibold tracking-tight text-foreground sm:text-xl">{t.brand}</span>
              <span className="hidden text-xs font-medium text-muted md:block">{locale === "ar" ? "منتجات رقمية موثوقة" : "Trusted digital products"}</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-3 rounded-full border border-white/70 bg-white/70 px-3 py-2 shadow-premium backdrop-blur md:flex dark:border-white/10 dark:bg-white/5">
            {navLinks.map((link) => {
              const isActive = link.exact ? pathname === link.href : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    isActive ? "bg-brand/10 text-brand shadow-[inset_0_0_0_1px_rgba(37,99,235,0.12)]" : "text-muted hover:bg-surface hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <ThemeToggle locale={locale} />
            <CartBadge locale={locale} />
            <Suspense fallback={null}>
              <LanguageSwitcher locale={locale} />
            </Suspense>
            <MobileNav locale={locale} />
          </div>
        </div>
      </div>
    </header>
  );
}
