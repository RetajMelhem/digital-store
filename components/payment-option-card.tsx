"use client";

import { Check, Copy, Landmark, Wallet } from "lucide-react";
import { useState } from "react";
import { IconFrame } from "@/components/icon-frame";
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
  const normalizedPhone = phone.replace(/\s+/g, "");

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
    <div className="overflow-hidden rounded-[28px] border border-transparent bg-white/85 shadow-premium backdrop-blur dark:border-transparent dark:bg-white/5">
      <div className="flex items-start justify-between gap-3 border-b border-transparent px-4 py-4 min-[360px]:px-5 sm:px-6">
        <div className="flex min-w-0 items-start gap-3">
          <IconFrame tone="brand" size="sm" className="min-[360px]:h-10 min-[360px]:w-10 min-[360px]:rounded-xl">
            <Wallet className="h-5 w-5" strokeWidth={1.9} />
          </IconFrame>
          <div className="min-w-0">
            <div className="text-[11px] font-semibold tracking-[0.1em] text-brand min-[360px]:text-xs min-[360px]:tracking-[0.14em]">
              {isArabic ? "الدفع عبر CliQ" : "Pay with CliQ"}
            </div>
            <h3 className="mt-2 break-words text-base font-black leading-7 text-foreground min-[360px]:text-lg sm:text-xl">
              {bankName}
            </h3>
          </div>
        </div>

        {showOptionIndex ? (
          <div className="flex h-9 min-w-9 items-center justify-center rounded-full border border-transparent bg-surface px-2.5 text-sm font-bold text-foreground min-[360px]:h-10 min-[360px]:min-w-10 min-[360px]:px-3">
            {optionIndex}
          </div>
        ) : null}
      </div>

      <div className="grid gap-3 px-4 py-4 min-[360px]:px-5 min-[360px]:py-5 sm:px-6">
        <div className="rounded-2xl border border-transparent bg-surface p-4">
          <div className="flex items-start gap-3">
            <IconFrame tone="warm" size="sm">
              <Landmark className="h-4 w-4" strokeWidth={1.9} />
            </IconFrame>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-muted">{isArabic ? "البنك" : "Bank"}</div>
              <div className="mt-2 break-words text-base font-bold leading-7 text-foreground sm:text-lg">{bankName}</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-transparent bg-[color:color-mix(in_srgb,var(--color-primary-soft)_72%,var(--color-bg-elevated))] p-4 sm:p-5">
          <div className="flex flex-col gap-4">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-muted">{isArabic ? "رقم التحويل" : "Transfer number"}</div>
              <div
                dir="ltr"
                className="mt-2 break-all font-mono text-[1.2rem] font-black leading-tight tracking-[0.02em] text-foreground [font-variant-numeric:tabular-nums] min-[360px]:text-[1.35rem] min-[360px]:tracking-[0.04em] sm:text-[1.75rem] sm:tracking-[0.12em]"
              >
                {normalizedPhone}
              </div>
            </div>

            <button type="button" onClick={handleCopy} className="btn-secondary h-11 w-full justify-center gap-2 px-4 text-sm sm:w-auto">
              {copied ? <Check className="h-4 w-4" strokeWidth={2} /> : <Copy className="h-4 w-4" strokeWidth={2} />}
              {copied ? (isArabic ? "تم النسخ" : "Copied") : isArabic ? "نسخ الرقم" : "Copy number"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
