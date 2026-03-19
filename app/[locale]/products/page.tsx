import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/product-card";
import { Locale } from "@/lib/constants";
import { dictionary } from "@/lib/i18n";
import { getReviewSummary } from "@/lib/reviews";

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
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ filter?: string; sort?: string }>;
}) {
  const { locale } = await params;
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
    <div className="container-page space-y-8 py-6 sm:py-10">
      <div className="overflow-hidden rounded-[2rem] border border-line bg-surface p-6 shadow-card sm:p-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{t.allProductsTitle}</h1>
          <p className="max-w-2xl text-muted">{t.allProductsText}</p>
        </div>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { label: locale === "ar" ? "كل المنتجات" : "All products", value: "all" as FilterOption },
              { label: "AI", value: "ai" as FilterOption },
              { label: "Gaming", value: "gaming" as FilterOption },
              { label: "Social Media", value: "social-media" as FilterOption }
            ].map((option) => {
              const active = filter === option.value;

              return (
                <Link
                  key={option.value}
                  href={getProductsUrl(locale, option.value, sort)}
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                    active ? "bg-brand text-[var(--color-text-inverse)] shadow-soft" : "bg-surface-muted text-muted hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            <span className="px-1 py-2 font-semibold text-muted">{locale === "ar" ? "ترتيب:" : "Sort:"}</span>
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
                  className={`rounded-2xl px-4 py-2 font-semibold transition ${
                    active ? "bg-brand text-[var(--color-text-inverse)] shadow-soft" : "bg-surface-muted text-muted hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} locale={locale} product={product} />
        ))}
      </div>
    </div>
  );
}
