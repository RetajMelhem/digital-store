"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { Locale } from "@/lib/constants";
import { dictionary } from "@/lib/i18n";
import { formatCurrency } from "@/lib/utils";

export function CartPageClient({ locale }: { locale: Locale }) {
  const { items, subtotal, updateQuantity, removeItem, getLocalizedName } = useCart();
  const t = dictionary[locale];

  if (!items.length) {
    return (
      <div className="container-page py-10">
        <div className="card mx-auto max-w-2xl p-8 text-center">
          <h1 className="text-3xl font-black">{t.cart}</h1>
          <p className="mt-3 text-muted">{t.emptyCart}</p>
          <Link href={`/${locale}/products`} className="btn-primary mt-6">{t.startShopping}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page grid gap-6 py-10 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex items-center gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-line bg-surface-muted">
                <Image src={item.image} alt={getLocalizedName(item, locale)} fill className="object-cover" unoptimized />
              </div>

              <div className="min-w-0">
                <div className="truncate text-lg font-bold text-foreground">{getLocalizedName(item, locale)}</div>
                <div className="mt-1 text-sm text-muted">{formatCurrency(item.price, locale)}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={20}
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, Number(e.target.value || 1))}
                className="input w-24"
              />
              <button className="btn-secondary" onClick={() => removeItem(item.id)}>{t.remove}</button>
            </div>
          </div>
        ))}
      </div>

      <aside className="card h-fit p-6">
        <h2 className="text-xl font-bold text-foreground">{t.orderSummary}</h2>
        <div className="mt-4 border-t border-line pt-4 text-lg font-black text-foreground">
          {t.total}: {formatCurrency(subtotal, locale)}
        </div>
        <Link href={`/${locale}/checkout`} className="btn-primary mt-5 w-full">{t.continueToCheckout}</Link>
      </aside>
    </div>
  );
}
