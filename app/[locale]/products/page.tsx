import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { IconFrame } from "@/components/icon-frame";
import { prisma } from "@/lib/db";
import { Locale } from "@/lib/constants";
import { dictionary, isLocale } from "@/lib/i18n";
import { getReviewSummary } from "@/lib/reviews";

export const dynamic = "force-dynamic";

type SortOption = "newest" | "price-asc" | "price-desc" | "rating";
type FilterOption = "all" | "ai" | "gaming" | "social-media";

function getProductsUrl(locale: Locale, filter: FilterOption, sort: SortOption) {
  const params = new URLSearchParams();

  if (filter !== "all") params.set("filter", filter);
  if (sort !== "newest") params.set("sort", sort);

  const query = params.toString();
  return `/${locale}/products${query ? `?${query}` : ""}`;
}

export default async function ProductsPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ filter?: string; sort?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const query = await searchParams;
  const t = dictionary[locale];
  const filterValues: FilterOption[] = ["all", "ai", "gaming", "social-media"];
  const filter: FilterOption = filterValues.includes(query.filter as FilterOption) ? (query.filter as FilterOption) : "all";
  const sortValues: SortOption[] = ["newest", "price-asc", "price-desc", "rating"];
  const sort: SortOption = sortValues.includes(query.sort as SortOption) ? (query.sort as SortOption) : "newest";

  const products = await prisma.product.findMany({
    where:
      filter === "ai"
        ? { isActive: true, category: "AI" }
        : filter === "gaming"
          ? { isActive: true, category: "Gaming" }
          : filter === "social-media"
            ? { isActive: true, category: "Social Media" }
            : { isActive: true },
    orderBy: sort === "price-asc" ? { price: "asc" } : sort === "price-desc" ? { price: "desc" } : { createdAt: "desc" },
    include: { reviews: { where: { status: "APPROVED" }, select: { rating: true } } }
  });

  const summarizedProducts = products.map((product) => {
    const summary = getReviewSummary(product.reviews);

    return {
      ...product,
      price: Number(product.price),
      rating: summary.average,
      ratingCount: summary.totalCount
    };
  });

  const visibleProducts = sort === "rating" ? [...summarizedProducts].sort((left, right) => right.rating - left.rating) : summarizedProducts;

  return (
    <div className="min-h-screen py-8 sm:py-10">
      <div className="container-page space-y-8">
        <section className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-premium backdrop-blur sm:p-8 dark:border-white/10 dark:bg-white/5">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              {filter === "all" ? t.allProductsTitle : filter === "ai" ? t.aiFilter : filter === "gaming" ? t.gamingFilter : t.socialMediaFilter}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted">{t.allProductsText}</p>
          </div>

          <div className="mt-8 grid gap-4 xl:grid-cols-[1fr_auto] xl:items-end">
            <div className="flex flex-wrap gap-3">
              {[
                { label: t.allProductsFilter, value: "all" as FilterOption },
                { label: t.aiFilter, value: "ai" as FilterOption },
                { label: t.gamingFilter, value: "gaming" as FilterOption },
                { label: t.socialMediaFilter, value: "social-media" as FilterOption }
              ].map((option) => {
                const active = filter === option.value;

                return (
                  <Link
                    key={option.value}
                    href={getProductsUrl(locale, option.value, sort)}
                    className={`rounded-full border px-5 py-2.5 text-sm font-medium transition ${
                      active ? "border-brand bg-brand text-[var(--color-text-inverse)] shadow-soft" : "border-line bg-surface text-muted hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {option.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2 text-sm">
              <span className="px-1 py-2 font-semibold text-muted">{t.sortLabel}</span>
              {[
                { label: locale === "ar" ? "الأحدث" : "Newest", value: "newest" as SortOption },
                { label: locale === "ar" ? "الأقل سعرًا" : "Price: Low to high", value: "price-asc" as SortOption },
                { label: locale === "ar" ? "الأعلى سعرًا" : "Price: High to low", value: "price-desc" as SortOption },
                { label: locale === "ar" ? "الأعلى تقييمًا" : "Top rated", value: "rating" as SortOption }
              ].map((option) => {
                const active = sort === option.value;

                return (
                  <Link
                    key={option.value}
                    href={getProductsUrl(locale, filter, option.value)}
                    className={`rounded-full border px-4 py-2 font-medium transition ${
                      active ? "border-brand bg-brand text-[var(--color-text-inverse)] shadow-soft" : "border-line bg-surface text-muted hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {option.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleProducts.length ? (
            visibleProducts.map((product) => <ProductCard key={product.id} locale={locale} product={product} />)
          ) : (
            <div className="rounded-[32px] border border-white/70 bg-white/80 py-20 text-center shadow-premium backdrop-blur md:col-span-2 xl:col-span-3 dark:border-white/10 dark:bg-white/5">
              <IconFrame tone="neutral" size="xl" className="mx-auto">
                <PackageSearch className="h-8 w-8 text-muted" strokeWidth={1.8} />
              </IconFrame>
              <h2 className="mt-6 text-xl font-semibold text-foreground">{t.emptyProductsTitle}</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-muted">{t.emptyProductsText}</p>
              <Link href={getProductsUrl(locale, "all", "newest")} className="btn-secondary mt-6">
                {t.showAllProducts}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
