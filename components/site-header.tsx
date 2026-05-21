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
        <div className="flex items-center justify-between gap-4">
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl">
              <Image src="/images/our logo/our logo.png" alt={`${t.brand} logo`} width={40} height={40} className="h-full w-full object-contain" priority />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">{t.brand}</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => {
              const isActive = link.exact ? pathname === link.href : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn("text-sm font-medium transition-colors", isActive ? "text-brand" : "text-muted hover:text-foreground")}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
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
