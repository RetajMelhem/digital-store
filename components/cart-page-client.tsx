"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShieldCheck, ShoppingCart, Trash2 } from "lucide-react";
import { IconFrame } from "@/components/icon-frame";
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
        <IconFrame tone="neutral" size="xl">
          <ShoppingCart className="h-8 w-8 text-muted" strokeWidth={1.8} />
        </IconFrame>
        <h1 className="mt-6 text-2xl font-black text-foreground">{t.emptyCart}</h1>
        <p className="mt-2 max-w-md text-sm leading-7 text-muted">
          {locale === "ar" ? "أضف بعض المنتجات إلى السلة للمتابعة إلى الدفع والتأكيد على واتساب." : "Add a few products to continue to payment and WhatsApp confirmation."}
        </p>
        <Link href={`/${locale}/products`} className="btn-primary mt-6">
          {t.startShopping}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container-page">
        <div className="mb-8 rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-premium backdrop-blur sm:rounded-[32px] sm:p-8 dark:border-white/10 dark:bg-white/5">
          <span className="theme-chip">{locale === "ar" ? "الخطوة الأولى" : "Step one"}</span>
          <h1 className="mt-4 text-2xl font-black tracking-tight text-foreground sm:text-3xl">{t.cart}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted sm:text-base">
            {locale === "ar" ? "راجع المنتجات المختارة ثم تابع إلى صفحة الطلب والدفع عبر CliQ." : "Review the selected products, then continue to the order and CliQ payment flow."}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-10">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="card p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-line bg-surface-muted sm:h-[72px] sm:w-[72px]">
                    <Image src={item.image} alt={getLocalizedName(item, locale)} fill className="object-cover" unoptimized />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-2 break-words text-base font-semibold leading-7 text-foreground sm:text-lg">{getLocalizedName(item, locale)}</div>
                    <div className="mt-1 text-sm text-muted">{formatCurrency(item.price, locale)}</div>

                    <div className="mt-4 flex flex-col gap-3 min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between">
                      <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface-muted p-1">
                        <button
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-muted transition hover:bg-background hover:text-foreground"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          aria-label={locale === "ar" ? "تقليل الكمية" : "Decrease quantity"}
                        >
                          <Minus className="h-4 w-4" strokeWidth={2} />
                        </button>
                        <span className="w-6 text-center font-semibold text-foreground">{item.quantity}</span>
                        <button
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-muted transition hover:bg-background hover:text-foreground"
                          onClick={() => updateQuantity(item.id, Math.min(20, item.quantity + 1))}
                          aria-label={locale === "ar" ? "زيادة الكمية" : "Increase quantity"}
                        >
                          <Plus className="h-4 w-4" strokeWidth={2} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-3 min-[380px]:justify-end">
                        <div className="min-w-0">
                          <div className="text-base font-bold text-foreground sm:text-lg">{formatCurrency(item.price * item.quantity, locale)}</div>
                        </div>

                        <button
                          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-line/70 bg-surface text-muted transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                          onClick={() => removeItem(item.id)}
                          aria-label={t.remove}
                        >
                          <Trash2 className="h-5 w-5" strokeWidth={1.9} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-[28px] border border-emerald-500/15 bg-emerald-500/5 p-5">
              <div className="flex items-start gap-3">
                <IconFrame tone="success" size="sm">
                  <ShieldCheck className="h-4 w-4" strokeWidth={1.9} />
                </IconFrame>
                <p className="text-sm leading-7 text-foreground">
                  {locale === "ar"
                    ? "بعد إكمال الطلب، سيتم تزويدك بتفاصيل الدفع عبر CliQ ثم متابعة التفعيل على واتساب."
                    : "After checkout, you will receive the CliQ payment details and continue activation on WhatsApp."}
                </p>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-28 rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-premium backdrop-blur sm:rounded-[32px] sm:p-6 dark:border-white/10 dark:bg-white/5">
              <h2 className="text-lg font-black text-foreground sm:text-xl">{t.orderSummary}</h2>
              <div className="mt-6 rounded-2xl border border-brand/10 bg-brand/5 p-4">
                <div className="flex items-end justify-between gap-3">
                  <span className="font-medium text-foreground">{t.total}</span>
                  <div className="text-right">
                    <div className="text-2xl font-black text-foreground sm:text-3xl">{formatCurrency(subtotal, locale)}</div>
                  </div>
                </div>
              </div>
              <Link href={`/${locale}/checkout`} className="btn-primary mt-6 w-full">
                {t.continueToCheckout}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
