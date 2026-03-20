import { notFound } from "next/navigation";
import { CheckoutForm } from "@/components/checkout-form";
import { isLocale } from "@/lib/i18n";

export default async function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <CheckoutForm locale={locale} />;
}
