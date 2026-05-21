import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { RatingStars } from "@/components/rating-stars";
import { ReviewForm } from "@/components/review-form";
import { dictionary, isLocale } from "@/lib/i18n";
import { formatCategoryLabel, formatCurrency, pickLocalized } from "@/lib/utils";
import { getReviewSummary } from "@/lib/reviews";

export const dynamic = "force-dynamic";

export default async function ProductDetailsPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
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
  const categoryLabel = formatCategoryLabel(product.category, locale);
  const summary = getReviewSummary(allReviewRatings);

  return (
    <div className="min-h-screen pb-24 pt-8 md:pt-10">
      <div className="container-page space-y-10">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-[28px] shadow-sm md:h-80">
              <Image src={product.image} alt={name} fill className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] dark:bg-black/20" />
              <div className="relative z-10 h-24 w-24 overflow-hidden rounded-2xl border border-white/40 bg-white/60 shadow-card md:h-32 md:w-32 dark:border-white/15 dark:bg-white/10">
                <Image src={product.image} alt={name} fill className="object-cover" unoptimized />
              </div>
            </div>

            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="theme-chip">{categoryLabel}</span>
                <span className="theme-chip bg-brand/10 text-brand">{locale === "ar" ? "منتج رقمي" : "Digital product"}</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{name}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted">
                <RatingStars rating={summary.average} size="lg" rtl={locale === "ar"} />
                <span className="font-bold text-foreground">{summary.average.toFixed(1)}</span>
                <span>({new Intl.NumberFormat(locale).format(summary.totalCount)} {locale === "ar" ? "تقييم" : "reviews"})</span>
              </div>
              <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-muted">{description}</p>
            </div>

            <div className="card p-6 md:p-8">
              <h2 className="mb-6 text-xl font-bold text-foreground">{locale === "ar" ? "كيف يتم التفعيل" : "How activation works"}</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-muted font-bold text-foreground">1</div>
                  <div>
                    <h3 className="font-medium text-foreground">{locale === "ar" ? "أكمل الطلب" : "Complete the order"}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {locale === "ar" ? "أضف المنتج إلى السلة ثم أكمل الطلب بالاسم ورقم الهاتف فقط." : "Add the product to cart, then complete checkout with only your name and phone number."}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-muted font-bold text-foreground">2</div>
                  <div>
                    <h3 className="font-medium text-foreground">{locale === "ar" ? "ادفع عبر CliQ" : "Pay with CliQ"}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {locale === "ar" ? "بعد إنشاء الطلب، يظهر لك مبلغ الدفع ورقم التحويل المطلوب." : "After order creation, you will see the payment amount and the required transfer number."}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 font-bold text-brand">3</div>
                  <div>
                    <h3 className="font-medium text-foreground">{locale === "ar" ? "أرسل الإثبات على واتساب" : "Send proof on WhatsApp"}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {product.deliveryType === "PRIVATE_ACCOUNT"
                        ? locale === "ar"
                          ? "بعد الدفع نرسل لك الحساب الجديد أو تفاصيله عبر واتساب."
                          : "After payment, we send you the new account or its details on WhatsApp."
                        : locale === "ar"
                          ? "بعد الدفع يتم التفعيل على حسابك الشخصي الأساسي."
                          : "After payment, activation is completed on your main personal account."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <div className="card p-6 shadow-panel">
                <div className="mb-6">
                  <p className="text-sm text-muted">{dictionary[locale].amountToPay}</p>
                  <div className="mt-2 text-4xl font-bold tracking-tight text-foreground">{formatCurrency(Number(product.price), locale)}</div>
                </div>

                <div className="mb-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-brand">
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2]">
                        <path d="M4 12h16M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span>
                      {product.deliveryType === "PRIVATE_ACCOUNT"
                        ? locale === "ar"
                          ? "يتم تسليمك حسابًا جديدًا بعد الدفع"
                          : "You will receive a new account after payment"
                        : locale === "ar"
                          ? "يتم التفعيل على حسابك الشخصي الأساسي"
                          : "Activation is completed on your main personal account"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10 text-success">
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2]">
                        <path d="M12 3l7 3v5c0 4.2-2.7 8-7 10-4.3-2-7-5.8-7-10V6l7-3Zm-3 9 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span>{locale === "ar" ? "تحقق يدوي موثوق عبر واتساب" : "Trusted manual verification through WhatsApp"}</span>
                  </div>
                </div>

                <AddToCartButton locale={locale} product={{ ...product, price: Number(product.price) }} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{locale === "ar" ? "آراء العملاء" : "Customer reviews"}</h2>
              <p className="mt-1 text-sm text-muted">
                {locale === "ar"
                  ? "يتم احتساب المتوسط والعدد من التقييمات الفعلية لهذا المنتج فقط، ويتحدثان تلقائيًا مع كل تقييم جديد."
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
    </div>
  );
}
