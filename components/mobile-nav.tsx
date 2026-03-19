"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Locale } from "@/lib/constants";
import { dictionary } from "@/lib/i18n";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function MobileNav({ locale }: { locale: Locale }) {
  const t = dictionary[locale];
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: `/${locale}`, label: t.home, exact: true },
    { href: `/${locale}/products`, label: t.products },
    { href: `/${locale}/cart`, label: t.cart }
  ];

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-surface text-xl text-foreground shadow-sm"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        {open ? "✕" : "☰"}
      </button>

      {open ? (
        <div className="absolute inset-x-4 top-16 z-50 rounded-3xl border border-line bg-surface p-4 shadow-card">
          <div className="space-y-2">
            {links.map((link) => {
              const isActive = link.exact ? pathname === link.href : pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "block rounded-2xl px-4 py-3 text-base font-semibold transition",
                    isActive
                      ? "bg-brand text-[var(--color-text-inverse)] shadow-soft hover:text-[var(--color-text-inverse)]"
                      : "text-foreground hover:bg-surface-muted"
                  )}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-4 border-t border-line pt-4">
            <div className="mb-3 text-sm font-semibold text-muted">{locale === "ar" ? "المظهر" : "Appearance"}</div>
            <ThemeToggle />
          </div>
        </div>
      ) : null}
    </div>
  );
}
