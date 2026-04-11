"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import { Locale } from "@/lib/constants";
import { dictionary } from "@/lib/i18n";
import { formatCurrency } from "@/lib/utils";

function isValidJordanPhone(phone: string) {
  const normalized = phone.replace(/[\s-]/g, "");
  return /^(07\d{8}|\+9627\d{8})$/.test(normalized);
}

function getPhoneErrorMessage(locale: Locale) {
  return locale === "ar"
    ? "يرجى إدخال رقم هاتف أردني صحيح يبدأ بـ 07 أو +9627"
    : "Please enter a valid Jordan phone number starting with 07 or +9627";
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
    <div className="container-page grid gap-6 py-10 lg:grid-cols-[1fr_360px]">
      <form action={onSubmit} className="card space-y-5 p-6">
        <div>
          <h1 className="text-3xl font-black">{t.checkoutTitle}</h1>
          <p className="mt-2 text-muted">{t.checkoutText}</p>
        </div>

        <div>
          <label className="label">{t.fullName}</label>
          <input name="customerName" className="input" placeholder={t.fullName} required />
        </div>

        <div>
          <label className="label">{t.phoneNumber}</label>
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            className="input"
            placeholder={t.phonePlaceholder}
            required
          />
        </div>

        <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />

        {error ? (
          <div className="alert-error" role="alert">
            <div className="flex items-start gap-3">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 fill-none stroke-current stroke-[2]">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v5" strokeLinecap="round" />
                <circle cx="12" cy="16.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              <div>
                <div className="text-sm font-bold">{t.errorNoticeTitle}</div>
                <p className="mt-1 text-sm leading-6">{error}</p>
              </div>
            </div>
          </div>
        ) : null}

        <button className="btn-primary w-full" disabled={loading}>
          {loading ? t.submitting : t.placeOrder}
        </button>
      </form>

      <aside className="card h-fit p-6">
        <h2 className="text-xl font-bold text-foreground">{t.orderSummary}</h2>

        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-line bg-surface-muted p-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-line bg-surface">
                <Image src={item.image} alt={getLocalizedName(item, locale)} fill className="object-cover" unoptimized />
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold text-foreground">{getLocalizedName(item, locale)}</div>
                <div className="mt-1 text-xs text-muted">
                  {locale === "ar" ? `الكمية: ${item.quantity}` : `Qty: ${item.quantity}`}
                </div>
                <div className="mt-1 text-sm font-semibold text-foreground">
                  {formatCurrency(item.price * item.quantity, locale)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-line pt-4 text-lg font-black text-foreground">
          {t.total}: {formatCurrency(subtotal, locale)}
        </div>
      </aside>
    </div>
  );
}
