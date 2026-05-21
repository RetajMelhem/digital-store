"use client";

import { useState } from "react";
import { Locale } from "@/lib/constants";

type PaymentOptionCardProps = {
  bankName: string;
  locale: Locale;
  phone: string;
  optionIndex?: number;
  showOptionIndex?: boolean;
};

export function PaymentOptionCard({
  bankName,
  locale,
  phone,
  optionIndex,
  showOptionIndex = false
}: PaymentOptionCardProps) {
  const [copied, setCopied] = useState(false);
  const isArabic = locale === "ar";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-panel">
      <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <div className="text-xs font-semibold tracking-[0.14em] text-brand">
            {isArabic ? "الدفع عبر CliQ" : "Pay with CliQ"}
          </div>
          <h3 className="mt-2 text-lg font-bold text-foreground sm:text-xl">{bankName}</h3>
        </div>

        {showOptionIndex ? (
          <div className="flex h-9 min-w-9 items-center justify-center rounded-full border border-line bg-surface-muted px-3 text-sm font-bold text-foreground">
            {optionIndex}
          </div>
        ) : null}
      </div>

      <div className="grid gap-3 px-5 py-5 sm:px-6">
        <div className="rounded-2xl border border-line bg-surface-muted/80 p-4">
          <div className="text-sm font-semibold text-muted">{isArabic ? "البنك" : "Bank"}</div>
          <div className="mt-2 text-base font-bold leading-7 text-foreground sm:text-lg">{bankName}</div>
        </div>

        <div className="rounded-2xl border border-brand/15 bg-[color:color-mix(in_srgb,var(--color-primary-soft)_72%,var(--color-bg-elevated))] p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-muted">{isArabic ? "رقم التحويل" : "Transfer number"}</div>
              <div
                dir="ltr"
                className="mt-2 whitespace-nowrap font-mono text-[1.7rem] font-black leading-none tracking-[0.08em] text-foreground [font-variant-numeric:tabular-nums] sm:text-[1.75rem] sm:tracking-[0.12em]"
              >
                {phone}
              </div>
            </div>

            <button type="button" onClick={handleCopy} className="btn-secondary h-11 shrink-0 px-4 text-sm">
              {copied ? (isArabic ? "تم النسخ" : "Copied") : isArabic ? "نسخ الرقم" : "Copy number"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
