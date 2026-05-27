import Link from "next/link";
import { Bot, Gamepad2, MessageSquareShare } from "lucide-react";
import { IconFrame } from "@/components/icon-frame";
import { Locale } from "@/lib/constants";

const categories = [
  {
    key: "ai",
    category: "ai",
    labelEn: "AI tools",
    labelAr: "أدوات الذكاء الاصطناعي",
    copyEn: "Chatbots, assistants, and pro subscriptions.",
    copyAr: "اشتراكات ومساعدات رقمية وأدوات ذكاء اصطناعي.",
    icon: Bot,
    tone: "brand" as const
  },
  {
    key: "gaming",
    category: "gaming",
    labelEn: "Gaming",
    labelAr: "الألعاب",
    copyEn: "Accounts, boosts, and gaming access.",
    copyAr: "حسابات وخدمات وصول للألعاب.",
    icon: Gamepad2,
    tone: "success" as const
  },
  {
    key: "social-media",
    category: "social-media",
    labelEn: "Social media",
    labelAr: "التواصل الاجتماعي",
    copyEn: "Tools and subscriptions for creators and teams.",
    copyAr: "خدمات واشتراكات للمبدعين والفرق.",
    icon: MessageSquareShare,
    tone: "warm" as const
  }
] as const;

export function HomeCategoryShortcuts({ locale }: { locale: Locale }) {
  return (
    <section className="section-space pb-14">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="section-heading">{locale === "ar" ? "تصفح حسب الفئة" : "Browse by category"}</h2>
          <p className="section-copy mx-auto">
            {locale === "ar" ? "ابدأ بالفئة المناسبة ثم انتقل مباشرة إلى أفضل المنتجات المتاحة." : "Start with the category that fits your need, then jump straight to the strongest offers."}
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.key} href={`/${locale}/products?filter=${cat.category}`} className="card card-hover group flex h-full flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <IconFrame tone={cat.tone} size="lg">
                    <Icon className="h-6 w-6" strokeWidth={1.9} />
                  </IconFrame>
                  <span className="theme-chip">{locale === "ar" ? "استكشف" : "Explore"}</span>
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-tight text-foreground">{locale === "ar" ? cat.labelAr : cat.labelEn}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{locale === "ar" ? cat.copyAr : cat.copyEn}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
