"use client";

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
  const links = [
    { href: `/${locale}`, label: t.home, exact: true },
    { href: `/${locale}/products`, label: t.products },
    { href: `/${locale}/cart`, label: t.cart }
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-background/90 backdrop-blur">
      <div className="container-page relative flex h-16 items-center justify-between gap-3 sm:h-20">
        <div className="flex items-center gap-3">
          <MobileNav locale={locale} />
          <Link href={`/${locale}`} className="flex items-center gap-3 text-foreground">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-line bg-surface p-1 shadow-soft sm:h-12 sm:w-12">
              <Image
                src="/images/our logo/our logo.png"
                alt={`${t.brand} logo`}
                width={64}
                height={64}
                className="h-full w-full object-contain"
                priority
              />
            </span>
            <span className="hidden text-lg font-black tracking-tight sm:block">{t.brand}</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-2 text-sm font-medium text-muted md:flex">
          {links.map((link) => {
            const isActive = link.exact ? pathname === link.href : pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-xl px-3 py-2 transition",
                  isActive
                    ? "bg-brand text-[var(--color-text-inverse)] shadow-soft hover:text-[var(--color-text-inverse)]"
                    : "hover:bg-surface-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>
          <CartBadge locale={locale} />
          <LanguageSwitcher locale={locale} />
        </div>
      </div>
    </header>
  );
}
