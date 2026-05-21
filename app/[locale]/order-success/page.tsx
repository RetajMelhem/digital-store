import Link from "next/link";
import { notFound } from "next/navigation";
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
      <div className="container-page max-w-3xl">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-success-soft">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-12 w-12 fill-none stroke-success stroke-[2]">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t.paymentTitle}</h1>
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2 shadow-sm">
            <span className="text-muted">{t.orderId}:</span>
            <span className="font-mono font-bold text-foreground" dir="ltr">
              {orderId}
            </span>
          </div>
        </div>

        <div className="card p-6 md:p-8">
          <span className="inline-flex rounded-full bg-success-soft px-3 py-1 text-sm font-semibold text-success">
            {locale === "ar" ? "تم إنشاء الطلب" : "Order created"}
          </span>

          <p className="mt-4 text-sm leading-7 text-muted sm:text-base">{t.paymentText}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="min-w-0 rounded-2xl bg-surface-muted p-4 sm:p-5">
              <div className="text-sm text-muted">{t.orderId}</div>
              <div className="mt-2 break-all text-lg font-bold text-foreground sm:text-xl" dir="ltr">
                {orderId}
              </div>
            </div>

            <div className="rounded-2xl bg-surface-muted p-4 sm:p-5">
              <div className="text-sm text-muted">{t.amountToPay}</div>
              <div className="mt-2 text-lg font-bold text-foreground sm:text-xl">{formatCurrency(amount, locale)}</div>
            </div>
          </div>

          <div className="relative mt-8 space-y-8">
            <div className="absolute bottom-10 top-10 right-6 w-px bg-line sm:left-6 sm:right-auto" />

            <div className="relative flex gap-6">
              <div className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-brand bg-surface font-bold text-brand shadow-sm">
                1
              </div>
              <div className="w-full pt-2">
                <h2 className="text-lg font-bold text-foreground">
                  {locale === "ar" ? "حوّل المبلغ عبر CliQ" : "Transfer the amount with CliQ"}
                </h2>
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

            <div className="relative flex gap-6">
              <div className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-surface font-bold text-accent shadow-sm">
                2
              </div>
              <div className="w-full pt-2">
                <h2 className="text-lg font-bold text-foreground">
                  {locale === "ar" ? "أرسل إثبات الدفع على واتساب" : "Send proof on WhatsApp"}
                </h2>
                <p className="mt-2 text-sm leading-7 text-muted">{t.whatsappHelp}</p>
                <Link
                  href={buildWhatsAppLink(orderId, formatCurrency(amount, locale), customerName, phone, locale, productLines)}
                  className="btn-primary mt-4 w-full sm:w-auto"
                  target="_blank"
                >
                  {t.sendPayment}
                </Link>
              </div>
            </div>

            <div className="relative flex gap-6">
              <div className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-line bg-surface font-bold text-muted shadow-sm">
                3
              </div>
              <div className="pt-2">
                <h2 className="text-lg font-bold text-foreground">
                  {locale === "ar" ? "انتظر تأكيد التفعيل" : "Wait for activation confirmation"}
                </h2>
                <p className="mt-2 text-sm leading-7 text-muted">
                  {locale === "ar"
                    ? "بعد مراجعة الإثبات، يتم تأكيد الطلب ومتابعة التفعيل عبر واتساب."
                    : "After the proof is reviewed, the order is confirmed and activation continues on WhatsApp."}
                </p>
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
