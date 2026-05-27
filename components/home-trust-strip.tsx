import { MapPin, MessageCircle, ShieldCheck, Zap } from "lucide-react";
import { IconFrame } from "@/components/icon-frame";
import { Locale } from "@/lib/constants";

const items = [
  {
    key: "secure",
    titleEn: "Verified payment",
    titleAr: "دفع موثوق",
    copyEn: "Clear checkout and proof confirmation.",
    copyAr: "خطوات دفع واضحة مع تأكيد الإثبات.",
    icon: ShieldCheck,
    tone: "brand" as const
  },
  {
    key: "delivery",
    titleEn: "Fast delivery",
    titleAr: "تسليم سريع",
    copyEn: "Activation and account handoff with clear timing.",
    copyAr: "تفعيل أو تسليم الحساب بوقت واضح.",
    icon: Zap,
    tone: "success" as const
  },
  {
    key: "support",
    titleEn: "WhatsApp support",
    titleAr: "دعم واتساب",
    copyEn: "Direct help before and after the order.",
    copyAr: "مساعدة مباشرة قبل الطلب وبعده.",
    icon: MessageCircle,
    tone: "whatsapp" as const
  },
  {
    key: "local",
    titleEn: "Jordan focused",
    titleAr: "مخصص للأردن",
    copyEn: "Local payment flow built around CliQ.",
    copyAr: "تجربة شراء محلية مبنية على CliQ.",
    icon: MapPin,
    tone: "warm" as const
  }
] as const;

export function HomeTrustStrip({ locale }: { locale: Locale }) {
  return (
    <section className="pb-6">
      <div className="container-page">
        <div className="grid gap-3 rounded-[28px] border border-white/70 bg-white/75 p-4 shadow-premium backdrop-blur md:grid-cols-2 md:p-5 xl:grid-cols-4 dark:border-white/10 dark:bg-white/5">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} className="rounded-2xl border border-line/70 bg-surface/70 p-4">
                <div className="flex items-start gap-3">
                  <IconFrame tone={item.tone} size="sm">
                    <Icon className="h-4 w-4" strokeWidth={1.9} />
                  </IconFrame>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{locale === "ar" ? item.titleAr : item.titleEn}</p>
                    <p className="mt-1 text-sm leading-6 text-muted">{locale === "ar" ? item.copyAr : item.copyEn}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
