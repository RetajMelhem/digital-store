import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/product-card";
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
    orderBy:
      sort === "price-asc"
        ? { price: "asc" }
        : sort === "price-desc"
          ? { price: "desc" }
          : { createdAt: "desc" },
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

  const visibleProducts =
    sort === "rating"
      ? [...summarizedProducts].sort((left, right) => right.rating - left.rating)
      : summarizedProducts;

  return (
    <div className="min-h-screen py-8 sm:py-10">
      <div className="container-page space-y-10">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {filter === "all"
              ? t.allProductsTitle
              : filter === "ai"
                ? t.aiFilter
                : filter === "gaming"
                  ? t.gamingFilter
                  : t.socialMediaFilter}
          </h1>
          <p className="text-base text-muted">{t.allProductsText}</p>
        </div>

        <div className="flex flex-col gap-5">
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
                    active
                      ? "border-brand bg-brand text-[var(--color-text-inverse)] shadow-soft"
                      : "border-line bg-surface text-muted shadow-sm hover:bg-secondary hover:text-foreground"
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
                    active
                      ? "border-brand bg-brand text-[var(--color-text-inverse)] shadow-soft"
                      : "border-line bg-surface text-muted shadow-sm hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleProducts.length ? (
            visibleProducts.map((product) => <ProductCard key={product.id} locale={locale} product={product} />)
          ) : (
            <div className="py-20 text-center md:col-span-2 xl:col-span-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted text-muted">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8 fill-none stroke-current stroke-[1.8]">
                  <path d="M4 7h16M7 4h10l1 3H6l1-3Zm0 0L5 20h14L17 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="mt-4 text-xl font-medium text-foreground">{t.emptyProductsTitle}</h2>
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
