import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/product-card";
import { Locale } from "@/lib/constants";
import { dictionary } from "@/lib/i18n";
import { getReviewSummary } from "@/lib/reviews";

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = dictionary[locale];
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 4,
    include: { reviews: { where: { status: "APPROVED" }, select: { rating: true } } }
  });

  return (
    <div className="container-page space-y-16 py-6 sm:space-y-20 sm:py-10">
      <section className="grid gap-6 overflow-hidden rounded-[2rem] bg-hero px-5 py-8 text-[var(--color-hero-text)] shadow-card md:grid-cols-[1.2fr_0.8fr] md:px-10 md:py-14">
        <div className="space-y-5">
          <span className="inline-flex rounded-full bg-hero-surface px-3 py-1 text-xs font-semibold">{t.heroBadge}</span>
          <h1 className="max-w-2xl text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">{t.heroTitle}</h1>
          <p className="max-w-xl text-sm leading-7 text-hero-muted sm:text-base">{t.heroText}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href={`/${locale}/products`} className="btn h-12 rounded-2xl bg-white px-5 text-base font-semibold text-[#315efb] hover:bg-white/90 hover:text-[#274de0]">
              {t.browseProducts}
            </Link>
            <Link href={`/${locale}/cart`} className="btn h-12 rounded-2xl border border-white/15 bg-hero-surface px-5 text-base text-white hover:bg-white/10">
              {t.openCart}
            </Link>
          </div>
          <div className="grid max-w-xl gap-3 pt-3 text-sm">
            {[locale === "ar" ? "ثقة أعلى وتقييمات ظاهرة" : "Stronger trust signals"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-hero-surface px-4 py-3 font-medium text-white/90">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 self-stretch rounded-[1.75rem] bg-surface p-5 text-foreground sm:p-6">
          <div>
            <div className="text-sm font-semibold text-muted">{t.howItWorks}</div>
            <div className="mt-2 text-2xl font-black">{locale === "ar" ? "تجربة شراء تشبه المتاجر الكبيرة" : "A polished big-store experience"}</div>
          </div>
          <ol className="space-y-3 text-sm leading-6 text-muted">
            <li className="rounded-2xl bg-surface-muted px-4 py-3">{t.step1}</li>
            <li className="rounded-2xl bg-surface-muted px-4 py-3">{t.step2}</li>
            <li className="rounded-2xl bg-surface-muted px-4 py-3">{t.step3}</li>
          </ol>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-line p-4">
              <div className="text-base font-black text-foreground">
                {locale === "ar" ? "تسليم المنتجات" : "Product delivery"}
              </div>
              <div className="mt-1 text-sm leading-6 text-muted">
                {locale === "ar" ? "بين الساعة 12 ظهراً إلى الساعة 12 مساءً" : "From 12 PM to 12 AM"}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">{t.featuredProducts}</h2>
          </div>
          <Link href={`/${locale}/products`} className="btn h-12 rounded-2xl bg-white px-5 text-base font-semibold text-[#315efb] hover:bg-white/90 hover:text-[#274de0]">
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
      </section>
    </div>
  );
}
