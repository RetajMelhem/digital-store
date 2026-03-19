import { CartPageClient } from "@/components/cart-page-client";
import { Locale } from "@/lib/constants";

export default async function CartPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return <CartPageClient locale={locale} />;
}
