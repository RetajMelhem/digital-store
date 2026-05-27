import Image from "next/image";
import { CheckCircle2, MessageCircle, ShieldCheck, Wallet, Zap } from "lucide-react";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { IconFrame } from "@/components/icon-frame";
import { RatingStars } from "@/components/rating-stars";
import { ReviewForm } from "@/components/review-form";
import { prisma } from "@/lib/db";
import { dictionary, isLocale } from "@/lib/i18n";
import { getReviewSummary } from "@/lib/reviews";
import { formatCategoryLabel, formatCurrency, pickLocalized } from "@/lib/utils";

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
  const isPrivateAccount = product.deliveryType === "PRIVATE_ACCOUNT";

  const steps = [
    {
      title: locale === "ar" ? "أكمل الطلب" : "Complete the order",
      copy:
        locale === "ar"
          ? "أضف المنتج إلى السلة ثم أكمل الطلب بالاسم ورقم الهاتف فقط."
          : "Add the product to cart, then complete checkout with only your name and phone number.",
      icon: CheckCircle2,
      tone: "brand" as const
    },
    {
      title: locale === "ar" ? "ادفع عبر CliQ" : "Pay with CliQ",
      copy:
        locale === "ar"
          ? "بعد إنشاء الطلب، يظهر لك مبلغ الدفع ورقم التحويل المطلوب."
          : "After order creation, you will see the payment amount and the required transfer number.",
      icon: Wallet,
      tone: "warm" as const
    },
    {
      title: locale === "ar" ? "أرسل الإثبات على واتساب" : "Send proof on WhatsApp",
      copy: isPrivateAccount
        ? locale === "ar"
          ? "بعد الدفع نرسل لك الحساب الجديد أو تفاصيله عبر واتساب."
          : "After payment, we send you the new account or its details on WhatsApp."
        : locale === "ar"
          ? "بعد الدفع يتم التفعيل على حسابك الشخصي الأساسي."
          : "After payment, activation is completed on your main personal account.",
      icon: MessageCircle,
      tone: "success" as const
    }
  ];

  return (
    <div className="min-h-screen pb-24 pt-8 md:pt-10">
      <div className="container-page space-y-10">
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/80 shadow-premium backdrop-blur dark:border-white/10 dark:bg-white/5">
              <div className="relative h-72 w-full overflow-hidden bg-surface-muted sm:h-80">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/5 to-transparent" />
                <Image src={product.image} alt={name} fill className="object-cover" unoptimized />
                <div className="absolute left-5 top-5 z-10 flex flex-wrap gap-2">
                  <span className="theme-chip bg-white/90 text-foreground shadow-sm dark:bg-surface/80">{categoryLabel}</span>
                  <span className="theme-chip bg-white/90 text-foreground shadow-sm dark:bg-surface/80">{locale === "ar" ? "منتج رقمي" : "Digital product"}</span>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
                  <RatingStars rating={summary.average} size="lg" rtl={locale === "ar"} />
                  <span className="font-bold text-foreground">{summary.average.toFixed(1)}</span>
                  <span>({new Intl.NumberFormat(locale).format(summary.totalCount)} {locale === "ar" ? "تقييم" : "reviews"})</span>
                </div>

                <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground md:text-4xl">{name}</h1>
                <p className="mt-4 whitespace-pre-line text-base leading-8 text-muted md:text-lg">{description}</p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="card p-5">
                    <div className="flex items-start justify-between gap-3">
                      <IconFrame tone={step.tone} size="md">
                        <Icon className="h-5 w-5" strokeWidth={1.9} />
                      </IconFrame>
                      <span className="text-3xl font-black tracking-tight text-brand/10 dark:text-brand/20">{`0${index + 1}`}</span>
                    </div>
                    <h2 className="mt-5 text-lg font-semibold text-foreground">{step.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-muted">{step.copy}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="sticky top-28 rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-premium backdrop-blur dark:border-white/10 dark:bg-white/5 sm:p-7">
              <div className="rounded-2xl border border-brand/10 bg-brand/5 p-4">
                <p className="text-sm text-muted">{dictionary[locale].amountToPay}</p>
                <div className="mt-2 text-4xl font-black tracking-tight text-foreground">{formatCurrency(Number(product.price), locale)}</div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-start gap-3 rounded-2xl border border-line/70 bg-surface px-4 py-3">
                  <IconFrame tone={isPrivateAccount ? "brand" : "success"} size="sm">
                    {isPrivateAccount ? <ShieldCheck className="h-4 w-4" strokeWidth={1.9} /> : <Zap className="h-4 w-4" strokeWidth={1.9} />}
                  </IconFrame>
                  <div className="text-sm leading-6 text-muted">
                    {isPrivateAccount
                      ? locale === "ar"
                        ? "يتم تسليمك حسابًا جديدًا بعد الدفع."
                        : "You will receive a new account after payment."
                      : locale === "ar"
                        ? "يتم التفعيل على حسابك الشخصي الأساسي."
                        : "Activation is completed on your main personal account."}
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-line/70 bg-surface px-4 py-3">
                  <IconFrame tone="success" size="sm">
                    <MessageCircle className="h-4 w-4" strokeWidth={1.9} />
                  </IconFrame>
                  <div className="text-sm leading-6 text-muted">
                    {locale === "ar" ? "التأكيد اليدوي يتم عبر واتساب بعد إرسال إثبات الدفع." : "Manual confirmation happens on WhatsApp after sending proof of payment."}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <AddToCartButton locale={locale} product={{ ...product, price: Number(product.price) }} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_0.92fr]">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-black text-foreground">{locale === "ar" ? "آراء العملاء" : "Customer reviews"}</h2>
              <p className="mt-1 text-sm leading-7 text-muted">
                {locale === "ar"
                  ? "يتم احتساب المتوسط والعدد من التقييمات الفعلية لهذا المنتج فقط، ويتحدثان تلقائيًا مع كل تقييم جديد."
                  : "The rating and review count are calculated from this product's real reviews only and update automatically with every new submission."}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {product.reviews.length ? (
                product.reviews.map((review) => (
                  <div key={review.id} className="card p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate font-bold text-foreground">{review.name}</div>
                        <div className="text-xs text-muted">
                          {new Intl.DateTimeFormat(locale === "ar" ? "ar-JO" : "en-US", { dateStyle: "medium" }).format(review.createdAt)}
                        </div>
                      </div>
                      <RatingStars rating={review.rating} rtl={locale === "ar"} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="card p-5 text-sm leading-7 text-muted">
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
