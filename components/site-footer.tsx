import { Locale } from "@/lib/constants";
import { dictionary } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = dictionary[locale];
  const whatsappPhone = process.env.WHATSAPP_PHONE || "962776323241";
  const whatsappLabel = locale === "ar" ? "للتواصل عبر واتساب" : "Contact via WhatsApp";
  const whatsappHref = `https://wa.me/${whatsappPhone.replace(/[^\d]/g, "")}`;

  return (
    <footer className="border-t border-line bg-surface/80">
      <div className="container-page grid gap-6 py-8 text-sm text-muted md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div className="space-y-3">
          <div className="text-base font-black text-foreground">{t.brand}</div>
          <p className="max-w-2xl leading-7">{t.footer}</p>
        </div>

        <div className="rounded-3xl border border-line bg-background/75 px-5 py-4 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-muted">{whatsappLabel}</div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            dir="ltr"
            className="mt-2 inline-flex text-lg font-black text-brand underline-offset-4 hover:underline"
          >
            {whatsappPhone}
          </a>
        </div>
      </div>
    </footer>
  );
}
