import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { IconFrame } from "@/components/icon-frame";
import { Locale } from "@/lib/constants";
import { dictionary } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = dictionary[locale];
  const whatsappPhone = process.env.WHATSAPP_PHONE || "962776323241";
  const whatsappHref = `https://wa.me/${whatsappPhone.replace(/[^\d]/g, "")}`;

  return (
    <footer className="border-t border-line/70 bg-transparent pb-28 pt-16 transition-colors duration-300 md:pb-10">
      <div className="container-page">
        <div className="grid gap-6 rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-premium backdrop-blur md:grid-cols-[1.1fr_0.9fr] md:p-8 dark:border-white/10 dark:bg-white/5">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-transparent">
                <Image src="/images/our logo/our logo.png" alt={`${t.brand} logo`} width={44} height={44} className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="text-lg font-semibold tracking-tight text-foreground">{t.brand}</p>
                <p className="text-sm text-muted">{locale === "ar" ? "منتجات رقمية بسرعة وثقة" : "Fast, trusted digital access"}</p>
              </div>
            </div>
          </div>

          <div className="md:flex md:items-center md:justify-start md:gap-4 lg:gap-5">
            <h3 className="shrink-0 text-sm font-semibold uppercase tracking-[0.18em] text-muted">
              {locale === "ar" ? "الدعم" : "Support"}
            </h3>
            <div className="mt-5 md:mt-0 md:min-w-[320px]">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-line/70 bg-surface px-4 py-3 transition hover:border-emerald-400/40 hover:bg-emerald-500/5"
              >
                <IconFrame tone="whatsapp" size="sm">
                  <MessageCircle className="h-4 w-4" strokeWidth={1.9} />
                </IconFrame>
                <div>
                  <p className="text-sm font-semibold text-foreground">WhatsApp</p>
                  <p dir="ltr" className="text-sm text-muted">
                    {whatsappPhone}
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
