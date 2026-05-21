import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/product-card";
import { dictionary, isLocale } from "@/lib/i18n";
import { getReviewSummary } from "@/lib/reviews";
import { HomeCategoryShortcuts } from "@/components/home-category-shortcuts";
import { HomeTrustStrip } from "@/components/home-trust-strip";
import { HomeHowItWorks } from "@/components/home-how-it-works";

export const dynamic = "force-dynamic";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = dictionary[locale];
  const products = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: { reviews: { where: { status: "APPROVED" }, select: { rating: true } } },
    orderBy: { updatedAt: "desc" },
    take: 4
  });

  return (
    <div>
      <section className="relative overflow-hidden pb-20 pt-24 md:pb-24 md:pt-32">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[96px] dark:bg-brand/20 dark:blur-[120px]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line to-transparent" />

        <div className="container-page relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white/60 px-3 py-1.5 text-sm font-medium text-brand shadow-sm backdrop-blur-sm dark:bg-white/5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
              </span>
              {t.heroBadge}
            </div>

            <h1 className="mt-8 text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">{t.heroTitle}</h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">{t.heroText}</p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href={`/${locale}/products`} className="btn-primary w-full sm:w-auto">
                {t.browseProducts}
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto">
                <span className="btn-secondary w-full">{t.howItWorks}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <HomeTrustStrip locale={locale} />
      <HomeCategoryShortcuts locale={locale} />

      <section id="featured-products" className="section-space bg-surface-muted/60 transition-colors duration-300">
        <div className="container-page">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <h2 className="section-heading">{t.featuredProducts}</h2>
              <p className="section-copy">
                {locale === "ar" ? "أكثر المنتجات طلبًا في المتجر." : "The most popular subscriptions in the store."}
              </p>
            </div>
            <Link href={`/${locale}/products`} className="hidden items-center gap-2 text-sm font-medium text-brand md:inline-flex">
              {t.viewAll}
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => {
              const summary = getReviewSummary(product.reviews);
              return (
                <ProductCard
                  key={product.id}
                  locale={locale}
                  product={{ ...product, price: Number(product.price), rating: summary.average, ratingCount: summary.totalCount }}
                />
              );
            })}
          </div>
        </div>
      </section>

      <HomeHowItWorks locale={locale} />
    </div>
  );
}
