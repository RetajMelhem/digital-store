"use client";

import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { RatingStars } from "@/components/rating-stars";
import { Locale } from "@/lib/constants";
import { pickLocalized, formatCurrency, formatCategoryLabel } from "@/lib/utils";

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
  const categoryLabel = formatCategoryLabel(product.category, locale);
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
    <div className="card group flex h-full flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-panel">
      <Link href={`/${locale}/products/${product.slug}`} className="relative block overflow-hidden">
        <div className="relative h-40 w-full overflow-hidden bg-surface-muted">
          <div className="absolute left-4 top-4 z-10">
            <span className="theme-chip bg-white/90 text-foreground shadow-sm dark:bg-surface/80">{categoryLabel}</span>
          </div>
          <Image src={product.image} alt={name} fill className="object-cover transition duration-500 group-hover:scale-105" unoptimized />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1 space-y-3">
          <Link href={`/${locale}/products/${product.slug}`} className="block text-xl font-bold text-foreground">
            {name}
          </Link>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
            <RatingStars rating={rating} rtl={locale === "ar"} />
            <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
            <span>({new Intl.NumberFormat(locale).format(ratingCount)})</span>
          </div>
          <p className="line-clamp-2 text-sm leading-6 text-muted">{description}</p>
          <p className="text-sm font-medium text-muted">{deliveryText}</p>
        </div>

        <div className="mt-5 border-t border-line pt-4">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <div className="text-xs text-muted">{locale === "ar" ? "السعر" : "Starting from"}</div>
              <div className="text-lg font-bold text-foreground">{formatCurrency(product.price, locale)}</div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
              <svg aria-hidden="true" viewBox="0 0 24 24" className={`h-5 w-5 fill-none stroke-current stroke-[2] ${locale === "ar" ? "rotate-180" : ""}`}>
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

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
  );
}
