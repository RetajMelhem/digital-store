import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { RatingStars } from "@/components/rating-stars";
import { ReviewForm } from "@/components/review-form";
import { Locale } from "@/lib/constants";
import { dictionary } from "@/lib/i18n";
import { formatCurrency, pickLocalized } from "@/lib/utils";
import { getReviewSummary } from "@/lib/reviews";

export default async function ProductDetailsPage({
  params
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = dictionary[locale];
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: { reviews: { where: { status: "APPROVED" }, orderBy: { createdAt: "desc" }, take: 6 } }
  });
  if (!product) notFound();

  const allReviewRatings = await prisma.review.findMany({
    where: { productId: product.id, status: "APPROVED" },
    select: { rating: true }
  });

  const name = pickLocalized(locale, product.nameAr, product.nameEn);
  const description = pickLocalized(locale, product.descriptionAr, product.descriptionEn);
  const summary = getReviewSummary(allReviewRatings);

  return (
    <div className="container-page space-y-8 py-6 sm:space-y-10 sm:py-10">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <div className="card overflow-hidden">
          <Image src={product.image} alt={name} width={1200} height={900} className="h-full min-h-[320px] w-full object-cover" unoptimized />
        </div>
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="theme-chip">{product.category}</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{name}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
              <RatingStars rating={summary.average} size="lg" rtl={locale === "ar"} />
              <span className="font-bold text-foreground">{summary.average.toFixed(1)}</span>
              <span>({new Intl.NumberFormat(locale).format(summary.totalCount)} {locale === "ar" ? "تقييم" : "reviews"})</span>
            </div>
            <p className="whitespace-pre-line text-base leading-7 text-muted">{description}</p>
          </div>

          <div className="card space-y-5 p-5 sm:p-6">
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-3xl font-black text-foreground">{formatCurrency(Number(product.price), locale)}</div>
                <div className="mt-1 text-sm text-muted">{t.amountToPay}</div>
              </div>
              <div className="rounded-2xl bg-surface-muted px-4 py-3 text-sm font-semibold text-foreground">
                {locale === "ar" ? "موثوق وسريع" : "Trusted & fast"}
              </div>
            </div>
            <AddToCartButton locale={locale} product={{ ...product, price: Number(product.price) }} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-black text-foreground">{locale === "ar" ? "آراء العملاء" : "Customer reviews"}</h2>
            <p className="mt-1 text-sm text-muted">
              {locale === "ar"
                ? "يتم احتساب المتوسط والعدد من التقييمات الفعلية لهذا المنتج فقط، ويتحدثان تلقائياً مع كل تقييم جديد."
                : "The rating and review count are calculated from this product's real reviews only and update automatically with every new submission."}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {product.reviews.length ? (
              product.reviews.map((review) => (
                <div key={review.id} className="card space-y-3 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-foreground">{review.name}</div>
                      <div className="text-xs text-muted">
                        {new Intl.DateTimeFormat(locale === "ar" ? "ar-JO" : "en-US", { dateStyle: "medium" }).format(review.createdAt)}
                      </div>
                    </div>
                    <RatingStars rating={review.rating} rtl={locale === "ar"} />
                  </div>
                </div>
              ))
            ) : (
              <div className="card p-5 text-sm text-muted">
                {locale === "ar" ? "لا توجد تقييمات حقيقية بعد، كن أول من يضيف رأيه." : "No real reviews yet, be the first to add one."}
              </div>
            )}
          </div>
        </div>

        <ReviewForm locale={locale} productId={product.id} />
      </div>
    </div>
  );
}
