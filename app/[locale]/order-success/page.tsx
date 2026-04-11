import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { dictionary, isLocale } from "@/lib/i18n";
import { buildWhatsAppLink, formatCurrency, pickLocalized } from "@/lib/utils";

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
  const paymentInfoDirection = locale === "ar" ? "rtl" : "ltr";
  const paymentOptions: PaymentOption[] = [
    {
      phone: process.env.CLIQ_PHONE || "0776323241",
      bankName: process.env.BANK_NAME || "Arab Banking Corporation (المؤسسة المصرفية العربية)"
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
    <div className="container-page py-10">
      <div className="mx-auto max-w-3xl card p-8">
        <span className="inline-flex rounded-full bg-success-soft px-3 py-1 text-sm font-semibold text-success">
          {locale === "ar" ? "تم إنشاء الطلب" : "Order created"}
        </span>

        <h1 className="mt-4 text-3xl font-black tracking-tight">{t.paymentTitle}</h1>
        <p className="mt-3 text-muted">{t.paymentText}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-surface-muted p-5">
            <div className="text-sm text-muted">{t.orderId}</div>
            <div className="mt-2 text-xl font-bold text-foreground">{orderId}</div>
          </div>

          <div className="rounded-3xl bg-surface-muted p-5">
            <div className="text-sm text-muted">{t.amountToPay}</div>
            <div className="mt-2 text-xl font-bold text-foreground">{formatCurrency(amount, locale)}</div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-success/30 bg-success-soft p-5 shadow-soft">
          <div className="text-sm font-semibold text-muted">
            {locale === "ar" ? "معلومات الدفع المهمة" : "Important payment details"}
          </div>
          <p className="mt-3 text-sm text-muted">
            {paymentOptions.length > 1
              ? locale === "ar"
                ? "يمكنك التحويل إلى أي واحد من خياري الدفع التاليين."
                : "You can transfer the payment to either of the following payment options."
              : locale === "ar"
                ? "حوّل المبلغ إلى خيار الدفع التالي."
                : "Transfer the payment to the following payment option."}
          </p>

          <div className="mt-4 grid gap-4">
            {paymentOptions.map((option, index) => (
              <div key={`${option.phone}-${index}`} className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-success/35 bg-background px-4 py-4">
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-success">
                    {paymentOptions.length > 1 ? `${t.cliqNumber} ${index + 1}` : t.cliqNumber}
                  </div>
                  <div className="mt-2 text-3xl font-black tracking-wide text-success">{option.phone}</div>
                </div>

                <div className="rounded-2xl border border-success/35 bg-background px-4 py-4" dir={paymentInfoDirection}>
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-success">
                    {paymentOptions.length > 1
                      ? `${locale === "ar" ? "البنك" : "Bank"} ${index + 1}`
                      : locale === "ar"
                        ? "البنك"
                        : "Bank"}
                  </div>
                  <div className="mt-2 text-lg font-black leading-7 text-success">{option.bankName}</div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm text-muted">{t.whatsappHelp}</p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={buildWhatsAppLink(orderId, formatCurrency(amount, locale), customerName, phone, locale, productLines)}
            className="btn-primary"
            target="_blank"
          >
            {t.sendPayment}
          </Link>

          <Link href={`/${locale}/products`} className="btn-secondary">
            {t.continueShopping}
          </Link>
        </div>
      </div>
    </div>
  );
}
