import Image from "next/image";
import Link from "next/link";
import { Locale } from "@/lib/constants";
import { dictionary } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = dictionary[locale];
  const whatsappPhone = process.env.WHATSAPP_PHONE || "962776323241";
  const whatsappHref = `https://wa.me/${whatsappPhone.replace(/[^\d]/g, "")}`;
  const links = [
    { href: `/${locale}`, label: t.home },
    { href: `/${locale}/products`, label: t.products },
    { href: `/${locale}/cart`, label: t.cart }
  ];

  return (
    <footer className="border-t border-line bg-background/80 pt-16 pb-10 transition-colors duration-300">
      <div className="container-page grid gap-10 md:grid-cols-2 lg:grid-cols-[1.1fr_0.7fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl">
              <Image src="/images/our logo/our logo.png" alt={`${t.brand} logo`} width={40} height={40} className="h-full w-full object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">{t.brand}</span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-7 text-muted">{t.footer}</p>
          <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-foreground">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-background text-base">🇯🇴</span>
            <span>{locale === "ar" ? "متجر رقمي مخصص للأردن" : "Built for customers in Jordan"}</span>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-base font-semibold text-foreground">{locale === "ar" ? "روابط سريعة" : "Quick links"}</h3>
          <ul className="space-y-3">
            {links.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-muted hover:text-brand">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-base font-semibold text-foreground">{locale === "ar" ? "الدعم والدفع" : "Support and payment"}</h3>
          <div className="card p-5">
            <a href={whatsappHref} target="_blank" rel="noreferrer" dir="ltr" className="inline-flex text-lg font-bold text-brand hover:underline">
              {whatsappPhone}
            </a>
            <p className="mt-4 text-sm leading-7 text-muted">
              {locale === "ar"
                ? "الدفع عبر Jordan CliQ، ثم تأكيد الطلب وإثبات الدفع على واتساب."
                : "Pay with Jordan CliQ, then confirm the order and send proof of payment on WhatsApp."}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
