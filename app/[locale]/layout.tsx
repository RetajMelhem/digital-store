import { notFound } from "next/navigation";
import { Locale } from "@/lib/constants";
import { getDirection } from "@/lib/utils";
import { isLocale } from "@/lib/i18n";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <div lang={locale} dir={getDirection(locale as Locale)}>
      <SiteHeader locale={locale as Locale} />
      <main className="min-h-[calc(100vh-132px)]">{children}</main>
      <SiteFooter locale={locale as Locale} />
    </div>
  );
}
