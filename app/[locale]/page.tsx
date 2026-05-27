import Link from "next/link";
import { notFound } from "next/navigation";
import { HomeCategoryShortcuts } from "@/components/home-category-shortcuts";
import { HomeHowItWorks } from "@/components/home-how-it-works";
import { HomeSupportPanel } from "@/components/home-support-panel";
import { ProductCard } from "@/components/product-card";
import { prisma } from "@/lib/db";
import { dictionary, isLocale } from "@/lib/i18n";
import { getReviewSummary } from "@/lib/reviews";

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
      <section className="relative overflow-hidden pb-14 pt-20 md:pb-20 md:pt-28">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[96px] dark:bg-brand/20 dark:blur-[120px]" />
        <div className="pointer-events-none absolute right-[8%] top-16 h-44 w-44 rounded-full bg-[var(--color-accent-violet)]/10 blur-[96px]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line to-transparent" />

        <div className="container-page relative z-10">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              {locale === "ar" ? (
                <>
                  متجر <span className="text-gradient">المنتجات الرقمية</span> الموثوق في الأردن
                </>
              ) : (
                <>
                  A trusted <span className="text-gradient">digital product</span> store for Jordan
                </>
              )}
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-muted sm:text-lg md:text-xl">{t.heroText}</p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href={`/${locale}/products`} className="btn-primary w-full sm:w-auto">
                {t.browseProducts}
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto">
                <span className="btn-secondary w-full">{t.howItWorks}</span>
              </a>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/70 bg-white/75 px-4 py-4 shadow-premium dark:border-white/10 dark:bg-white/5">
                <p className="text-2xl font-black text-foreground">24/7</p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/75 px-4 py-4 shadow-premium dark:border-white/10 dark:bg-white/5">
                <p className="text-2xl font-black text-foreground">CliQ</p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/75 px-4 py-4 shadow-premium dark:border-white/10 dark:bg-white/5">
                <p className="text-2xl font-black text-foreground">4.9</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HomeCategoryShortcuts locale={locale} />

      <section id="featured-products" className="section-space bg-surface-muted/40 transition-colors duration-300">
        <div className="container-page">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="section-heading">{t.featuredProducts}</h2>
              <p className="section-copy">
                {locale === "ar" ? "أكثر المنتجات طلبًا في المتجر مع تجربة شراء سهلة وواضحة." : "The most popular subscriptions in the store, presented with a clearer, faster buying flow."}
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
      <HomeSupportPanel locale={locale} />
    </div>
  );
}
