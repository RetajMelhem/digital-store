"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Grid2x2, Home, MessageCircle, ShoppingCart } from "lucide-react";
import { Locale } from "@/lib/constants";
import { dictionary } from "@/lib/i18n";
import { useCart } from "@/components/cart-provider";
import { cn } from "@/lib/utils";

export function MobileBottomNav({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const t = dictionary[locale];
  const { count } = useCart();
  const whatsappPhone = (process.env.WHATSAPP_PHONE || "962776323241").replace(/[^\d]/g, "");

  const items = [
    { href: `/${locale}`, label: t.home, icon: Home },
    { href: `/${locale}/products`, label: t.products, icon: Grid2x2 },
    { href: `/${locale}/cart`, label: t.cart, icon: ShoppingCart, badge: count }
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-[color:color-mix(in_srgb,var(--color-bg-elevated)_90%,transparent)] backdrop-blur-lg md:hidden">
      <div className="container-page flex items-center justify-around px-2 py-3">
        {items.map((item) => {
          const active =
            item.href === `/${locale}`
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex w-16 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1.5 transition",
                active ? "bg-brand/10 shadow-[inset_0_0_0_1px_rgba(37,99,235,0.18)]" : "hover:bg-surface/70"
              )}
            >
              <span className="relative">
                <Icon className={cn("h-5 w-5", active ? "text-brand" : "text-muted")} strokeWidth={1.9} />
                {item.badge ? (
                  <span className="absolute -right-2 -top-1 inline-flex min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold leading-4 text-white">
                    {item.badge}
                  </span>
                ) : null}
              </span>
              <span className={cn("text-[10px] font-medium", active ? "text-brand" : "text-muted")}>{item.label}</span>
            </Link>
          );
        })}

        <a
          href={`https://wa.me/${whatsappPhone}`}
          target="_blank"
          rel="noreferrer"
          className="flex w-16 flex-col items-center justify-center gap-1"
        >
          <MessageCircle className="h-5 w-5 text-success" strokeWidth={1.9} />
          <span className="text-[10px] font-medium text-muted">{locale === "ar" ? "واتساب" : "Support"}</span>
        </a>
      </div>
    </div>
  );
}
