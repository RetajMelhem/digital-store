"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { Locale } from "@/lib/constants";
import { dictionary } from "@/lib/i18n";

export function AddToCartButton({
  locale,
  product,
  compact = false
}: {
  locale: Locale;
  compact?: boolean;
  product: {
    id: string;
    slug: string;
    nameEn: string;
    nameAr: string;
    image: string;
    category: string;
    price: number;
  };
}) {
  const { addItem } = useCart();
  const t = dictionary[locale];
  const [quantity, setQuantity] = useState(1);

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold tracking-wide text-muted">{t.quantityLabel}</span>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
          className={`${compact ? "h-11 w-20 rounded-2xl" : "h-12 w-24 rounded-2xl"} border border-line bg-surface px-3 text-center text-base font-semibold text-foreground shadow-sm outline-none transition focus:border-accent focus:ring-4 focus:ring-accent-soft`}
        />
      </div>

      <button
        className={`${compact ? "h-11 text-sm" : "h-12 text-base"} btn-primary w-full`}
        onClick={() => addItem(product, quantity, locale)}
      >
        {compact ? `+ ${t.addToCart}` : t.addToCart}
      </button>
    </div>
  );
}
