"use client";

import Link from "next/link";
import { Menu, MessageCircle, X } from "lucide-react";
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
        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/70 bg-white/80 text-foreground shadow-premium transition hover:bg-white dark:border-white/10 dark:bg-white/5 sm:h-11 sm:w-11"
        aria-controls="mobile-menu"
        aria-label={open ? t.closeMenu : t.openMenu}
        aria-expanded={open}
      >
        {open ? <X aria-hidden="true" className="h-5 w-5" strokeWidth={2} /> : <Menu aria-hidden="true" className="h-5 w-5" strokeWidth={2} />}
      </button>

      {open ? (
        <div
          id="mobile-menu"
          className="absolute inset-x-4 top-[4.9rem] z-50 overflow-hidden rounded-[28px] border border-white/70 bg-white/95 p-4 shadow-[0_30px_60px_rgba(15,23,42,0.16)] backdrop-blur-xl dark:border-white/10 dark:bg-[#1a2238]/95"
        >
          <nav className="space-y-2">
            {links.map((link) => {
              const isActive = link.exact ? pathname === link.href : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "block rounded-2xl px-4 py-3 text-base font-medium transition",
                    isActive ? "bg-brand/10 text-brand shadow-[inset_0_0_0_1px_rgba(37,99,235,0.12)]" : "text-foreground hover:bg-surface"
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
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-400/30 bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(37,211,102,0.28)] transition hover:-translate-y-0.5"
          >
            <MessageCircle aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
            {locale === "ar" ? "واتساب" : "WhatsApp"}
          </a>
        </div>
      ) : null}
    </div>
  );
}
