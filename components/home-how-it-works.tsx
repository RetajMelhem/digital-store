import { ArrowLeft, ArrowRight, CreditCard, Send, ShoppingBag } from "lucide-react";
import { IconFrame } from "@/components/icon-frame";
import { Locale } from "@/lib/constants";
import { dictionary } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function HomeHowItWorks({ locale }: { locale: Locale }) {
  const t = dictionary[locale];
  const steps = [
    {
      title: locale === "ar" ? "اختر المنتج المناسب" : "Choose the right product",
      copy: t.step1,
      icon: ShoppingBag,
      tone: "brand" as const
    },
    {
      title: locale === "ar" ? "أدخل البيانات المطلوبة" : "Enter the required details",
      copy: t.step2,
      icon: CreditCard,
      tone: "warm" as const
    },
    {
      title: locale === "ar" ? "ادفع وأرسل الإثبات" : "Pay and send proof",
      copy: t.step3,
      icon: Send,
      tone: "success" as const
    }
  ];

  return (
    <section id="how-it-works" className="section-space">
      <div className="container-page">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="section-heading">{t.howItWorks}</h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const DirectionIcon = locale === "ar" ? ArrowLeft : ArrowRight;
            return (
              <div key={step.title} className="card card-hover relative p-6 sm:p-7">
                <span className={cn("absolute top-5 text-brand/20 dark:text-brand/25", locale === "ar" ? "left-5" : "right-5")}>
                  <DirectionIcon className="h-10 w-10" strokeWidth={2.2} />
                </span>
                <IconFrame tone={step.tone} size="lg">
                  <Icon className="h-6 w-6" strokeWidth={1.9} />
                </IconFrame>
                <h3 className="mt-6 text-xl font-semibold tracking-tight text-foreground">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{step.copy}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
