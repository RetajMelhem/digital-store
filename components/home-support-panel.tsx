import { MessageCircle, ShieldCheck } from "lucide-react";
import { IconFrame } from "@/components/icon-frame";
import { Locale } from "@/lib/constants";

export function HomeSupportPanel({ locale }: { locale: Locale }) {
  const whatsappPhone = (process.env.WHATSAPP_PHONE || "962776323241").replace(/[^\d]/g, "");
  const href = `https://wa.me/${whatsappPhone}`;

  return (
    <section className="pb-14 sm:pb-16 lg:pb-20">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/85 px-6 py-7 shadow-premium backdrop-blur sm:px-8 sm:py-9 dark:border-white/10 dark:bg-white/5">
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-brand/10 via-transparent to-transparent" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                {locale === "ar" ? "كل ما تحتاجه قبل الدفع أو بعده موجود على واتساب" : "Anything you need before or after payment is handled on WhatsApp"}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
                {locale === "ar"
                  ? "إذا كان لديك سؤال عن التفعيل أو مدة الاشتراك أو طريقة الدفع، يمكنك التواصل مباشرة للحصول على رد سريع وواضح."
                  : "If you have questions about activation, subscription duration, or payment steps, contact us directly for a fast, clear response."}
              </p>
            </div>

            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-400/30 bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(37,211,102,0.28)] transition hover:-translate-y-0.5 sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={2} />
              {locale === "ar" ? "تواصل عبر واتساب" : "Chat on WhatsApp"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
