"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Locale } from "@/lib/constants";
import { dictionary } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function MobileNav({ locale }: { locale: Locale }) {
  const t = dictionary[locale];
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const whatsappPhone = (process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "962776323241").replace(/[^\d]/g, "");

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
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface text-foreground shadow-sm"
        aria-controls="mobile-menu"
        aria-label={open ? t.closeMenu : t.openMenu}
        aria-expanded={open}
      >
        {open ? (
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[2]">
            <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[2]">
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {open ? (
        <div id="mobile-menu" className="glass-panel absolute inset-x-4 top-[4.9rem] z-50 rounded-2xl p-4">
          <nav className="space-y-2">
            {links.map((link) => {
              const isActive = link.exact ? pathname === link.href : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "block rounded-xl px-4 py-3 text-base font-medium transition",
                    isActive ? "bg-brand/10 text-brand" : "text-foreground hover:bg-surface-muted"
                  )}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <a
            href={`https://wa.me/${whatsappPhone}`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center justify-center rounded-xl border border-line bg-surface px-4 py-3 text-sm font-semibold text-foreground hover:bg-surface-muted"
          >
            {locale === "ar" ? "واتساب" : "WhatsApp"}
          </a>
        </div>
      ) : null}
    </div>
  );
}
