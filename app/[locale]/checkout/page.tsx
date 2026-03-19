import { CheckoutForm } from "@/components/checkout-form";
import { Locale } from "@/lib/constants";

export default async function CheckoutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return <CheckoutForm locale={locale} />;
}
