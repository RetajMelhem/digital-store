import { Locale } from "@/lib/constants";

const items = [
  { key: "secure", titleEn: "Verified payment", titleAr: "دفع موثوق" },
  { key: "delivery", titleEn: "Fast delivery", titleAr: "تسليم سريع" },
  { key: "support", titleEn: "WhatsApp support", titleAr: "دعم واتساب" },
  { key: "local", titleEn: "Jordan focused", titleAr: "للأردن" }
] as const;

export function HomeTrustStrip({ locale }: { locale: Locale }) {
  return (
    <section className="border-y border-line bg-surface/70 backdrop-blur-sm transition-colors duration-300">
      <div className="container-page">
        <div className="grid grid-cols-2 gap-4 py-6 md:grid-cols-4">
          {items.map((item) => (
            <div key={item.key} className="flex flex-col items-center gap-3 text-center md:flex-row md:justify-center md:text-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-background text-brand shadow-sm">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.9]">
                  {item.key === "secure" ? (
                    <path d="M12 3l7 3v5c0 4.2-2.7 8-7 10-4.3-2-7-5.8-7-10V6l7-3Zm-3 9 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  ) : item.key === "delivery" ? (
                    <path d="M4 7h11v8H4V7Zm11 3h3l2 2v3h-5v-5Zm-7 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm9 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" strokeLinecap="round" strokeLinejoin="round" />
                  ) : item.key === "support" ? (
                    <path d="M8 19l-3 2v-4a8 8 0 1 1 3 2Z" strokeLinecap="round" strokeLinejoin="round" />
                  ) : (
                    <>
                      <circle cx="12" cy="12" r="8.5" />
                      <path d="M12 7.5v9M7.5 12h9" strokeLinecap="round" />
                    </>
                  )}
                </svg>
              </div>
              <span className="text-sm font-medium text-foreground">{locale === "ar" ? item.titleAr : item.titleEn}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
