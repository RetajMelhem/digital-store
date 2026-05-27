import Link from "next/link";
import { CheckCircle2, MessageCircle, Wallet } from "lucide-react";
import { notFound } from "next/navigation";
import { IconFrame } from "@/components/icon-frame";
import { PaymentOptionCard } from "@/components/payment-option-card";
import { prisma } from "@/lib/db";
import { dictionary, isLocale } from "@/lib/i18n";
import { buildWhatsAppLink, formatCurrency, pickLocalized } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PaymentOption = {
  phone: string;
  bankName: string;
};

export default async function OrderSuccessPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    orderId?: string;
    amount?: string;
    customerName?: string;
    phone?: string;
  }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = dictionary[locale];
  const query = await searchParams;

  const orderId = query.orderId || "";
  const amount = Number(query.amount || 0);
  const customerName = query.customerName || "";
  const phone = query.phone || "";
  const paymentOptions: PaymentOption[] = [
    {
      phone: process.env.CLIQ_PHONE || "0776323241",
      bankName: process.env.BANK_NAME || "Arab Banking Corporation"
    },
    {
      phone: process.env.SECONDARY_CLIQ_PHONE || "",
      bankName: process.env.SECONDARY_BANK_NAME || ""
    }
  ].filter((option) => option.phone && option.bankName);

  const order = orderId
    ? await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      })
    : null;

  const productLines = order
    ? order.items.map((item: { quantity: number; product: { nameAr: string; nameEn: string } }) => ({
        name: pickLocalized(locale, item.product.nameAr, item.product.nameEn),
        quantity: item.quantity
      }))
    : [];

  return (
    <div className="min-h-screen py-8">
      <div className="container-page max-w-4xl">
        <div className="mb-8 rounded-[28px] border border-transparent bg-white/80 p-5 text-center shadow-premium backdrop-blur sm:rounded-[32px] sm:p-8 dark:border-transparent dark:bg-white/5">
          <IconFrame tone="success" size="xl" className="mx-auto rounded-full">
            <CheckCircle2 className="h-8 w-8" strokeWidth={2} />
          </IconFrame>
          <h1 className="mt-6 text-2xl font-black tracking-tight text-foreground sm:text-4xl">{t.paymentTitle}</h1>
          <div className="mt-4 inline-flex max-w-full items-center gap-2 rounded-full border border-transparent bg-surface px-3 py-2 shadow-sm sm:px-4">
            <span className="shrink-0 text-muted">{t.orderId}:</span>
            <span className="max-w-[180px] truncate font-mono font-bold text-foreground sm:max-w-none" dir="ltr">
              {orderId}
            </span>
          </div>
        </div>

        <div className="rounded-[28px] border border-transparent bg-white/85 p-5 shadow-premium backdrop-blur sm:rounded-[32px] sm:p-6 md:p-8 dark:border-transparent dark:bg-white/5">
          <span className="inline-flex rounded-full bg-success-soft px-3 py-1 text-sm font-semibold text-success">
            {locale === "ar" ? "تم إنشاء الطلب" : "Order created"}
          </span>

          <p className="mt-4 text-sm leading-7 text-muted sm:text-base">{t.paymentText}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="min-w-0 rounded-2xl border border-transparent bg-surface p-4 sm:p-5">
              <div className="text-sm text-muted">{t.orderId}</div>
              <div className="mt-2 break-all text-base font-bold text-foreground sm:text-xl" dir="ltr">
                {orderId}
              </div>
            </div>

            <div className="rounded-2xl border border-brand/10 bg-brand/5 p-4 sm:p-5">
              <div className="text-sm text-muted">{t.amountToPay}</div>
              <div className="mt-2 text-base font-black text-foreground sm:text-xl">{formatCurrency(amount, locale)}</div>
            </div>
          </div>

          <div className="mt-8 space-y-5 sm:space-y-6">
            <div className="rounded-[24px] border border-transparent bg-surface p-4 sm:rounded-[28px] sm:p-5">
              <div className="flex items-start gap-3 sm:gap-4">
                <IconFrame tone="brand" size="md">
                  <Wallet className="h-5 w-5" strokeWidth={1.9} />
                </IconFrame>
                <div className="w-full min-w-0">
                  <h2 className="text-base font-black text-foreground sm:text-lg">{locale === "ar" ? "حوّل المبلغ عبر CliQ" : "Transfer the amount with CliQ"}</h2>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    {paymentOptions.length > 1
                      ? locale === "ar"
                        ? "يمكنك التحويل إلى أي واحد من خيارات الدفع التالية."
                        : "You can transfer the payment to either of the following payment options."
                      : locale === "ar"
                        ? "حوّل المبلغ إلى خيار الدفع التالي."
                        : "Transfer the payment to the following payment option."}
                  </p>

                  <div className="mt-4 grid gap-4">
                    {paymentOptions.map((option, index) => (
                      <PaymentOptionCard
                        key={`${option.phone}-${index}`}
                        bankName={option.bankName}
                        locale={locale}
                        optionIndex={index + 1}
                        phone={option.phone}
                        showOptionIndex={paymentOptions.length > 1}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-emerald-500/15 bg-emerald-500/5 p-4 sm:rounded-[28px] sm:p-5">
              <div className="flex items-start gap-3 sm:gap-4">
                <IconFrame tone="whatsapp" size="md">
                  <MessageCircle className="h-5 w-5" strokeWidth={1.9} />
                </IconFrame>
                <div className="min-w-0">
                  <h2 className="text-base font-black text-foreground sm:text-lg">{locale === "ar" ? "أرسل إثبات الدفع على واتساب" : "Send proof on WhatsApp"}</h2>
                  <p className="mt-2 text-sm leading-7 text-muted">{t.whatsappHelp}</p>
                  <Link
                    href={buildWhatsAppLink(orderId, formatCurrency(amount, locale), customerName, phone, locale, productLines)}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-400/30 bg-[#25D366] px-4 py-3 text-sm font-semibold !text-white shadow-[0_18px_40px_rgba(37,211,102,0.28)] transition hover:-translate-y-0.5 hover:bg-[#1DA851] hover:!text-white sm:w-auto sm:px-5"
                    target="_blank"
                  >
                    <MessageCircle className="h-4 w-4 shrink-0" strokeWidth={2} />
                    <span className="truncate">{t.sendPayment}</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-transparent bg-surface p-4 sm:rounded-[28px] sm:p-5">
              <div className="flex items-start gap-3 sm:gap-4">
                <IconFrame tone="success" size="md">
                  <CheckCircle2 className="h-5 w-5" strokeWidth={1.9} />
                </IconFrame>
                <div className="min-w-0">
                  <h2 className="text-base font-black text-foreground sm:text-lg">{locale === "ar" ? "انتظر تأكيد التفعيل" : "Wait for activation confirmation"}</h2>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    {locale === "ar"
                      ? "بعد مراجعة الإثبات، يتم تأكيد الطلب ومتابعة التفعيل عبر واتساب."
                      : "After the proof is reviewed, the order is confirmed and activation continues on WhatsApp."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href={`/${locale}/products`} className="btn-secondary w-full sm:w-auto">
              {t.continueShopping}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
