import Link from "next/link";
import { BarChart3, Boxes, ClipboardList, MessageSquareQuote } from "lucide-react";
import { ADMIN_ROUTE } from "@/lib/constants";
import { IconFrame } from "@/components/icon-frame";

const links = [
  { href: ADMIN_ROUTE, label: "Dashboard", icon: BarChart3 },
  { href: `${ADMIN_ROUTE}/orders`, label: "Orders", icon: ClipboardList },
  { href: `${ADMIN_ROUTE}/products`, label: "Products", icon: Boxes },
  { href: `${ADMIN_ROUTE}/reviews`, label: "Reviews", icon: MessageSquareQuote }
];

export function AdminNav() {
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/70 bg-white/80 px-4 py-2 text-sm font-semibold text-foreground shadow-premium transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/5"
          >
            <IconFrame tone="brand" size="sm" className="h-7 w-7 rounded-xl">
              <Icon className="h-4 w-4" strokeWidth={1.9} />
            </IconFrame>
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
