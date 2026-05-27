"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { Locale } from "@/lib/constants";

export function CartBadge({ locale }: { locale: Locale }) {
  const { count } = useCart();
  const fullLabel = locale === "ar" ? `السلة (${count})` : `Cart (${count})`;

  return (
    <Link
      href={`/${locale}/cart`}
      aria-label={fullLabel}
      className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/70 bg-white/80 text-foreground shadow-premium transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/5 sm:h-11 sm:w-11"
    >
      <ShoppingCart aria-hidden="true" className="h-5 w-5 shrink-0" strokeWidth={1.9} />
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full border border-white/80 bg-brand px-1.5 text-[10px] font-bold leading-5 text-white shadow-[0_10px_24px_rgba(37,99,235,0.35)] dark:border-slate-950">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
