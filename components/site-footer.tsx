import { Locale } from "@/lib/constants";
import { dictionary } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = dictionary[locale];
  const whatsappPhone = process.env.WHATSAPP_PHONE || "962776323241";
  const whatsappLabel = locale === "ar" ? "للتواصل" : "Contact";
  const whatsappHref = `https://wa.me/${whatsappPhone.replace(/[^\d]/g, "")}`;

  return (
    <footer className="border-t border-line bg-surface/80">
      <div className="container-page py-8 text-sm text-muted">
        <div>
          <div className="text-base font-bold text-foreground">{t.brand}</div>
          <div className="mt-2 max-w-2xl">{t.footer}</div>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold text-foreground">{whatsappLabel}:</span>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-brand underline-offset-4 hover:underline"
            >
              {whatsappPhone}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
