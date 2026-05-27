"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { RatingStars } from "@/components/rating-stars";
import { Locale } from "@/lib/constants";
import { cn, formatCategoryLabel, formatCurrency, pickLocalized } from "@/lib/utils";

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
  const isPrivateAccount = product.deliveryType === "PRIVATE_ACCOUNT";
  const deliveryText = isPrivateAccount ? (locale === "ar" ? "يتم تسليمك حسابًا جديدًا" : "New account provided") : locale === "ar" ? "تفعيل على حسابك الشخصي" : "Activation on your personal account";

  return (
    <div className="card card-hover group flex h-full flex-col">
      <Link href={`/${locale}/products/${product.slug}`} className="relative block overflow-hidden">
        <div className="relative h-48 w-full overflow-hidden bg-surface-muted">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-slate-950/5 to-transparent" />
          <Image src={product.image} alt={name} fill className="object-cover transition duration-500 group-hover:scale-105" unoptimized />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
            <RatingStars rating={rating} rtl={locale === "ar"} />
            <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
            <span>({new Intl.NumberFormat(locale).format(ratingCount)})</span>
          </div>

          <Link href={`/${locale}/products/${product.slug}`} className="mt-3 block text-xl font-semibold tracking-tight text-foreground">
            {name}
          </Link>

          <p className="mt-3 line-clamp-2 text-sm leading-7 text-muted">{description}</p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-line/70 bg-surface px-3 py-2 text-sm text-muted">
            {isPrivateAccount ? <ShieldCheck className="h-4 w-4 text-brand" strokeWidth={1.9} /> : <Zap className="h-4 w-4 text-emerald-500" strokeWidth={1.9} />}
            <span>{deliveryText}</span>
          </div>
        </div>

        <div className="mt-6 border-t border-line/70 pt-5">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.18em] text-muted">{locale === "ar" ? "السعر" : "Starting from"}</div>
              <div className="mt-1 text-xl font-bold text-foreground">{formatCurrency(product.price, locale)}</div>
            </div>
            <Link
              href={`/${locale}/products/${product.slug}`}
              aria-label={locale === "ar" ? `عرض ${name}` : `View ${name}`}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-brand/15 bg-brand/10 text-brand transition group-hover:bg-brand group-hover:text-white"
            >
              <ArrowRight className={cn("h-5 w-5", locale === "ar" ? "rotate-180" : "")} strokeWidth={2} />
            </Link>
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
