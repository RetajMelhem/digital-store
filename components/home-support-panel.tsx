import { Locale } from "@/lib/constants";

export function HomeSupportPanel({ locale }: { locale: Locale }) {
  const whatsappPhone = (process.env.WHATSAPP_PHONE || "962776323241").replace(/[^\d]/g, "");
  const href = `https://wa.me/${whatsappPhone}`;

  return (
    <section className="pb-14 sm:pb-16 lg:pb-20">
      <div className="container-page">
        <div className="card overflow-hidden bg-gradient-to-br from-surface to-secondary px-6 py-7 sm:px-8 sm:py-9">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                {locale === "ar" ? "الشراء السريع يحتاج دعمًا واضحًا" : "Fast checkout needs clear support"}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
                {locale === "ar"
                  ? "إذا كان لديك سؤال عن التفعيل، مدة الاشتراك، أو طريقة الدفع، تواصل معنا مباشرة عبر واتساب قبل أو بعد إنشاء الطلب."
                  : "If you have questions about activation, duration, or payment steps, contact us directly on WhatsApp before or after placing the order."}
              </p>
            </div>

            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="btn-primary w-full justify-center sm:w-auto"
            >
              {locale === "ar" ? "تواصل عبر واتساب" : "Chat on WhatsApp"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
