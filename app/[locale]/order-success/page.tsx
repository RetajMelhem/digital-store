import Link from "next/link";
import { Locale } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { dictionary } from "@/lib/i18n";
import { buildWhatsAppLink, formatCurrency } from "@/lib/utils";
import { pickLocalized } from "@/lib/utils";

export default async function OrderSuccessPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{
    orderId?: string;
    amount?: string;
    customerName?: string;
    phone?: string;
  }>;
}) {
  const { locale } = await params;
  const t = dictionary[locale];
  const query = await searchParams;

  const orderId = query.orderId || "";
  const amount = Number(query.amount || 0);
  const customerName = query.customerName || "";
  const phone = query.phone || "";
  const cliqPhone = process.env.CLIQ_PHONE || "0776323241";
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
    ? order.items.map((item) => ({
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

        <div className="mt-6 rounded-3xl border border-line p-5">
          <div className="text-sm text-muted">{t.cliqNumber}</div>
          <div className="mt-2 text-2xl font-black text-foreground">{cliqPhone}</div>
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
