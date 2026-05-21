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
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-surface-muted">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-10 w-10 fill-none stroke-muted stroke-[1.8]">
            <circle cx="9" cy="20" r="1.5" />
            <circle cx="18" cy="20" r="1.5" />
            <path d="M3 4h2l2.2 9.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 7H7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground">{t.emptyCart}</h1>
        <Link href={`/${locale}/products`} className="btn-primary mt-6">{t.startShopping}</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container-page">
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground">{t.cart}</h1>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-10">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-line bg-surface-muted">
                    <Image src={item.image} alt={getLocalizedName(item, locale)} fill className="object-cover" unoptimized />
                  </div>

                  <div className="min-w-0">
                    <div className="truncate text-lg font-bold text-foreground">{getLocalizedName(item, locale)}</div>
                    <div className="mt-1 text-sm text-muted">{formatCurrency(item.price, locale)}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-5 sm:w-auto">
                  <div className="flex items-center gap-3 rounded-xl border border-line bg-surface-muted p-1">
                    <button
                      className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-background hover:text-foreground"
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      aria-label={locale === "ar" ? "تقليل الكمية" : "Decrease quantity"}
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-medium text-foreground">{item.quantity}</span>
                    <button
                      className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-background hover:text-foreground"
                      onClick={() => updateQuantity(item.id, Math.min(20, item.quantity + 1))}
                      aria-label={locale === "ar" ? "زيادة الكمية" : "Increase quantity"}
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground">{formatCurrency(item.price * item.quantity, locale)}</div>
                  </div>

                  <button className="rounded-lg p-2 text-muted hover:text-red-500" onClick={() => removeItem(item.id)} aria-label={t.remove}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.9]">
                      <path d="M4 7h16M9 7V4h6v3M10 11v6M14 11v6M6 7l1 13h10l1-13" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            <div className="rounded-xl border border-success/20 bg-success-soft p-4 text-sm text-foreground">
              {locale === "ar"
                ? "بعد إكمال الطلب، سيتم تزويدك بتفاصيل الدفع عبر CliQ ثم متابعة التفعيل على واتساب."
                : "After checkout, you will receive the CliQ payment details and continue activation on WhatsApp."}
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="card sticky top-28 p-6">
              <h2 className="text-xl font-bold text-foreground">{t.orderSummary}</h2>
              <div className="mt-6 border-t border-line pt-4">
                <div className="flex items-end justify-between gap-3">
                  <span className="font-medium text-foreground">{t.total}</span>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-foreground">{formatCurrency(subtotal, locale)}</div>
                  </div>
                </div>
              </div>
              <Link href={`/${locale}/checkout`} className="btn-primary mt-6 w-full">{t.continueToCheckout}</Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
