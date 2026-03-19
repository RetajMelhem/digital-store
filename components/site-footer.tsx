import { Locale } from "@/lib/constants";
import { dictionary } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = dictionary[locale];

  return (
    <footer className="border-t border-line bg-surface/80">
      <div className="container-page py-8 text-sm text-muted">
        <div>
          <div className="text-base font-bold text-foreground">{t.brand}</div>
          <div className="mt-2 max-w-2xl">{t.footer}</div>
        </div>
      </div>
    </footer>
  );
}
