import type { Locale } from "@/lib/constants";

export function formatCurrency(value: number | string, locale: Locale = "en") {
  const amount = typeof value === "string" ? Number(value) : value;

  return new Intl.NumberFormat(locale === "ar" ? "ar-JO" : "en-JO", {
    style: "currency",
    currency: "JOD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function buildWhatsAppLink(
  orderId: string,
  amount?: string | number,
  customerName?: string,
  phoneNumber?: string,
  locale: Locale = "en",
  products: Array<{ name: string; quantity: number }> = []
) {
  const phone = process.env.WHATSAPP_PHONE || "962776323241";
  const productHeader = products.length > 0 ? (locale === "ar" ? "المنتجات:" : "Products:") : null;
  const productLines = products.map((product) =>
    locale === "ar"
      ? `${product.name} - الكمية: ${product.quantity}`
      : `${product.name} - Qty: ${product.quantity}`
  );

  const lines =
    locale === "ar"
      ? [
          "مرحباً، لقد قمت بتحويل قيمة الطلب.",
          `رقم الطلب: ${orderId}`,
          productHeader,
          ...productLines,
          amount ? `المبلغ: ${amount}` : null,
          customerName ? `الاسم: ${customerName}` : null,
          phoneNumber ? `رقم الهاتف: ${phoneNumber}` : null,
          "يرجى مراجعة التحويل وتأكيد الطلب."
        ]
      : [
          "Hello, I completed the payment for my order.",
          `Order ID: ${orderId}`,
          productHeader,
          ...productLines,
          amount ? `Amount: ${amount}` : null,
          customerName ? `Name: ${customerName}` : null,
          phoneNumber ? `Phone: ${phoneNumber}` : null,
          "Please review the transfer and confirm the order."
        ];

  const text = encodeURIComponent(lines.filter(Boolean).join("\n"));

  return `https://wa.me/${phone}?text=${text}`;
}

export function getDirection(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr";
}

export function formatCategoryLabel(category: string, locale: Locale) {
  if (locale !== "ar") return category;

  const normalized = category.trim().toLowerCase();

  if (normalized === "ai") return "الذكاء الاصطناعي";
  if (normalized === "gaming") return "الألعاب";
  if (normalized === "social media") return "التواصل الاجتماعي";

  return category;
}

export function pickLocalized(locale: Locale, ar: string, en: string) {
  return locale === "ar" ? ar : en;
}
