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
      className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-2xl border border-success/30 bg-success-soft px-2.5 py-2 text-sm font-semibold text-success transition hover:border-success/45 hover:bg-success-soft/80 sm:gap-2 sm:px-3.5 sm:text-base"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-none stroke-current stroke-[2] sm:h-4 sm:w-4">
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
        <path d="M3 4h2l2.2 9.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 7H7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="leading-none max-[360px]:hidden">{fullLabel}</span>
      <span className="hidden leading-none max-[360px]:inline">{count}</span>
    </Link>
  );
}
