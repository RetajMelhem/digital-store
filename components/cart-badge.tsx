"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { Locale } from "@/lib/constants";

export function CartBadge({ locale }: { locale: Locale }) {
  const { count } = useCart();

  return (
    <Link
      href={`/${locale}/cart`}
      className="inline-flex items-center gap-2 rounded-2xl border border-success/30 bg-success-soft px-3.5 py-2 font-semibold text-success transition hover:border-success/45 hover:bg-success-soft/80"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2]">
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
        <path d="M3 4h2l2.2 9.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 7H7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{locale === "ar" ? `السلة (${count})` : `Cart (${count})`}</span>
    </Link>
  );
}
