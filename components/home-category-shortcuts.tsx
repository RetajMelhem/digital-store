import Link from "next/link";
import { Locale } from "@/lib/constants";

const categories = [
  { key: "ai", category: "ai", labelEn: "AI", labelAr: "الذكاء الاصطناعي", color: "from-blue-500/15 to-purple-500/10" },
  { key: "gaming", category: "gaming", labelEn: "Gaming", labelAr: "الألعاب", color: "from-emerald-500/15 to-teal-500/10" },
  { key: "social-media", category: "social-media", labelEn: "Social Media", labelAr: "التواصل الاجتماعي", color: "from-amber-500/15 to-orange-500/10" }
] as const;

export function HomeCategoryShortcuts({ locale }: { locale: Locale }) {
  return (
    <section className="section-space pb-16">
      <div className="container-page">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {locale === "ar" ? "تصفح حسب الفئة" : "Browse by category"}
        </h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {categories.map((cat) => (
            <Link key={cat.key} href={`/${locale}/products?filter=${cat.category}`}>
              <div className="card group h-full p-6 text-center hover:-translate-y-1 hover:shadow-panel">
                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.color}`}>
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8 fill-none stroke-foreground stroke-[1.9]">
                    {cat.key === "ai" ? (
                      <>
                        <path d="M12 4v4M7 7l2.5 2.5M17 7l-2.5 2.5M4 12h4M16 12h4M7 17l2.5-2.5M17 17l-2.5-2.5M12 16v4" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="12" r="3.5" />
                      </>
                    ) : cat.key === "gaming" ? (
                      <path d="M8 10h8a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-1l-2-2H11l-2 2H8a3 3 0 0 1-3-3v-1a3 3 0 0 1 3-3Zm1 3h2m5 0h.01M17.5 14.5h.01" strokeLinecap="round" strokeLinejoin="round" />
                    ) : (
                      <path d="M8 5h8a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-3l-3 2v-2H8a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Z" strokeLinecap="round" strokeLinejoin="round" />
                    )}
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground">{locale === "ar" ? cat.labelAr : cat.labelEn}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
