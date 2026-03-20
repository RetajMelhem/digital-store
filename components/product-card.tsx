"use client";

import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { RatingStars } from "@/components/rating-stars";
import { Locale } from "@/lib/constants";
import { pickLocalized, formatCurrency } from "@/lib/utils";

export function ProductCard({
  locale,
  product
}: {
  locale: Locale;
  product: {
    id: string;
    slug: string;
    nameEn: string;
    nameAr: string;
    descriptionEn: string;
    descriptionAr: string;
    category: string;
    image: string;
    price: number;
    deliveryType: "CUSTOMER_ACCOUNT" | "PRIVATE_ACCOUNT";
    rating?: number;
    ratingCount?: number;
  };
}) {
  const name = pickLocalized(locale, product.nameAr, product.nameEn);
  const description = pickLocalized(locale, product.descriptionAr, product.descriptionEn);
  const rating = product.rating ?? 4.5;
  const ratingCount = product.ratingCount ?? 20;
  const deliveryText =
    product.deliveryType === "PRIVATE_ACCOUNT"
      ? locale === "ar"
        ? "يتم تسليمك حسابًا جديدًا"
        : "New account provided"
      : locale === "ar"
        ? "تفعيل على حسابك الشخصي"
        : "Activation on your personal account";

  return (
    <div className="card group overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-card">
      <Link href={`/${locale}/products/${product.slug}`} className="block overflow-hidden bg-surface-muted">
        <Image src={product.image} alt={name} width={900} height={600} className="h-60 w-full object-cover transition duration-500 group-hover:scale-105" unoptimized />
      </Link>
      <div className="space-y-4 p-5 sm:p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="theme-chip">{product.category}</span>
            <span className="inline-flex rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-success">
              {locale === "ar" ? "تسليم سريع" : "Fast delivery"}
            </span>
          </div>
          <Link href={`/${locale}/products/${product.slug}`} className="block text-xl font-black leading-7 text-foreground">
            {name}
          </Link>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
            <RatingStars rating={rating} rtl={locale === "ar"} />
            <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
            <span>({new Intl.NumberFormat(locale).format(ratingCount)} {locale === "ar" ? "تقييم" : "reviews"})</span>
          </div>
          <p className="line-clamp-2 text-sm leading-6 text-muted">{description}</p>
          <p className="text-xs font-semibold text-brand">{deliveryText}</p>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-2xl font-black text-foreground">{formatCurrency(product.price, locale)}</div>
            <div className="text-xs text-muted">{locale === "ar" ? "الدفع الآمن والسريع" : "Secure and quick payment"}</div>
          </div>
          <div className="w-40 max-w-full">
            <AddToCartButton
              locale={locale}
              compact
              product={{
                id: product.id,
                slug: product.slug,
                nameEn: product.nameEn,
                nameAr: product.nameAr,
                image: product.image,
                category: product.category,
                price: product.price
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
