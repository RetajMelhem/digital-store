import { notFound } from "next/navigation";
import { CartPageClient } from "@/components/cart-page-client";
import { isLocale } from "@/lib/i18n";

export default async function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <CartPageClient locale={locale} />;
}
