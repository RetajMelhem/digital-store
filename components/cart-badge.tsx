"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { Locale } from "@/lib/constants";

export function CartBadge({ locale }: { locale: Locale }) {
  const { count } = useCart();
  const fullLabel = locale === "ar" ? `السلة (${count})` : `Cart (${count})`;

  return (
    <Link
      href={`/${locale}/cart`}
      aria-label={fullLabel}
      className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-foreground shadow-sm transition hover:bg-surface-muted"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-none stroke-current stroke-[1.9]">
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
        <path d="M3 4h2l2.2 9.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 7H7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-[10px] font-bold leading-5 text-white">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
