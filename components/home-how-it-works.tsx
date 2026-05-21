import { Locale } from "@/lib/constants";
import { dictionary } from "@/lib/i18n";

export function HomeHowItWorks({ locale }: { locale: Locale }) {
  const t = dictionary[locale];
  const steps = [
    { title: locale === "ar" ? "أضف المنتج" : "Add the product", copy: t.step1, tint: "bg-blue-500/10 text-blue-500" },
    { title: locale === "ar" ? "أدخل بياناتك" : "Enter your details", copy: t.step2, tint: "bg-violet-500/10 text-violet-500" },
    { title: locale === "ar" ? "ادفع وأرسل الإثبات" : "Pay and send proof", copy: t.step3, tint: "bg-green-500/10 text-green-500" }
  ];

  return (
    <section id="how-it-works" className="section-space">
      <div className="container-page">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="section-heading">{t.howItWorks}</h2>
          <p className="section-copy mx-auto">
            {locale === "ar"
              ? "خطوات واضحة وسريعة مخصصة لشراء الاشتراكات الرقمية في الأردن."
              : "A clear and fast flow designed around digital subscriptions in Jordan."}
          </p>
        </div>

        <div className="relative grid gap-8 md:grid-cols-3">
          <div className="absolute left-[16%] right-[16%] top-12 hidden h-px bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-green-500/20 md:block" />
          {steps.map((step, index) => (
            <div key={step.title} className="relative z-10 flex flex-col items-center text-center">
              <div className={`mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-line ${step.tint} shadow-sm`}>
                <span className="text-2xl font-bold">{`0${index + 1}`}</span>
              </div>
              <h3 className="mb-3 text-xl font-bold text-foreground">{step.title}</h3>
              <p className="max-w-xs text-sm leading-7 text-muted">{step.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
