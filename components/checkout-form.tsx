"use client";

import Image from "next/image";
import { AlertCircle, CheckCircle2, CreditCard, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconFrame } from "@/components/icon-frame";
import { useCart } from "@/components/cart-provider";
import { Locale } from "@/lib/constants";
import { dictionary } from "@/lib/i18n";
import { formatCurrency } from "@/lib/utils";

function isValidJordanPhone(phone: string) {
  const normalized = phone.replace(/[\s-]/g, "");
  return /^(07\d{8}|\+9627\d{8})$/.test(normalized);
}

function getPhoneErrorMessage(locale: Locale) {
  return locale === "ar" ? "يرجى إدخال رقم هاتف أردني صحيح يبدأ بـ 07 أو +9627" : "Please enter a valid Jordan phone number starting with 07 or +9627";
}

function getApiErrorMessage(error: unknown, locale: Locale) {
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  if (error && typeof error === "object") {
    const fieldErrors = "fieldErrors" in error ? (error.fieldErrors as Record<string, string[] | undefined>) : undefined;
    const formErrors = "formErrors" in error ? (error.formErrors as string[] | undefined) : undefined;
    const firstFieldError = fieldErrors ? Object.values(fieldErrors).flat().find(Boolean) : undefined;
    const firstFormError = formErrors?.find(Boolean);

    if (firstFieldError) return firstFieldError;
    if (firstFormError) return firstFormError;
  }

  return locale === "ar" ? "حدث خطأ غير متوقع، حاول مرة أخرى." : "Something went wrong. Please try again.";
}

export function CheckoutForm({ locale }: { locale: Locale }) {
  const router = useRouter();
  const { items, subtotal, clearCart, getLocalizedName } = useCart();
  const t = dictionary[locale];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function onSubmit(formData: FormData) {
    if (!items.length) {
      setError(t.createAtLeastOne);
      return;
    }

    setLoading(true);
    setError("");

    const body = {
      customerName: String(formData.get("customerName") || ""),
      phone: String(formData.get("phone") || ""),
      honeypot: String(formData.get("website") || ""),
      items: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity
      }))
    };

    if (!isValidJordanPhone(body.phone)) {
      setError(getPhoneErrorMessage(locale));
      setLoading(false);
      return;
    }

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      setError(getApiErrorMessage(data.error, locale));
      setLoading(false);
      return;
    }

    clearCart();

    const params = new URLSearchParams({
      orderId: data.order.id,
      amount: String(data.order.totalPrice),
      customerName: data.order.customerName || "",
      phone: data.order.phone || ""
    });

    router.push(`/${locale}/order-success?${params.toString()}`);
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container-page max-w-6xl">
        <div className="mb-8 rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-premium backdrop-blur sm:rounded-[32px] sm:p-8 dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center justify-center gap-2 text-center min-[380px]:gap-3 sm:gap-4">
            <div className="flex min-w-0 items-center gap-2 text-brand font-medium">
              <IconFrame tone="brand" size="sm" className="rounded-full">
                <ShoppingBag className="h-4 w-4" strokeWidth={1.9} />
              </IconFrame>
              <span className="hidden sm:inline">{locale === "ar" ? "السلة" : "Cart"}</span>
            </div>
            <div className="h-px w-6 bg-line min-[380px]:w-8 sm:w-16" />
            <div className="flex min-w-0 items-center gap-2 font-medium text-foreground">
              <IconFrame tone="brand" size="sm" className="rounded-full bg-brand text-white">
                <CheckCircle2 className="h-4 w-4" strokeWidth={1.9} />
              </IconFrame>
              <span className="hidden sm:inline">{t.checkoutTitle}</span>
            </div>
            <div className="h-px w-6 bg-line min-[380px]:w-8 sm:w-16" />
            <div className="flex min-w-0 items-center gap-2 font-medium text-muted">
              <IconFrame tone="neutral" size="sm" className="rounded-full">
                <CreditCard className="h-4 w-4" strokeWidth={1.9} />
              </IconFrame>
              <span className="hidden sm:inline">{t.paymentTitle}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:gap-8">
          <form action={onSubmit} className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-premium backdrop-blur sm:rounded-[32px] sm:p-6 md:p-8 dark:border-white/10 dark:bg-white/5">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">{t.checkoutTitle}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-muted sm:text-base">{t.checkoutText}</p>
            </div>

            <div className="mt-8 space-y-5 border-t border-line/70 pt-6">
              <div>
                <label className="label">{t.fullName}</label>
                <input name="customerName" className="input" placeholder={t.fullName} required />
              </div>

              <div>
                <label className="label">{t.phoneNumber}</label>
                <input name="phone" type="tel" inputMode="tel" className="input" placeholder={t.phonePlaceholder} required />
              </div>
            </div>

            <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />

            {error ? (
              <div className="alert-error mt-6" role="alert">
                <div className="flex items-start gap-3">
                  <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={2} />
                  <div>
                    <div className="text-sm font-bold">{t.errorNoticeTitle}</div>
                    <p className="mt-1 text-sm leading-6">{error}</p>
                  </div>
                </div>
              </div>
            ) : null}

            <button className="btn-primary mt-6 h-14 w-full text-base" disabled={loading}>
              {loading ? t.submitting : t.placeOrder}
            </button>
          </form>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-premium backdrop-blur sm:rounded-[32px] sm:p-6 md:p-8 dark:border-white/10 dark:bg-white/5">
              <div className="mb-6 border-b border-line/70 pb-4">
                <h2 className="text-lg font-black text-foreground sm:text-xl">{t.orderSummary}</h2>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 rounded-2xl border border-line/70 bg-surface p-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-line bg-surface-muted">
                      <Image src={item.image} alt={getLocalizedName(item, locale)} fill className="object-cover" unoptimized />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="line-clamp-2 break-words font-semibold leading-6 text-foreground">{getLocalizedName(item, locale)}</div>
                      <div className="mt-1 text-xs text-muted">{locale === "ar" ? `الكمية: ${item.quantity}` : `Qty: ${item.quantity}`}</div>
                      <div className="mt-1 text-sm font-semibold text-foreground">{formatCurrency(item.price * item.quantity, locale)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-brand/10 bg-brand/5 p-4 text-base font-black text-foreground sm:text-lg">
                {t.total}: {formatCurrency(subtotal, locale)}
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
