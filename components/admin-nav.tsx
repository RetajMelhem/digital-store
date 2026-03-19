import Link from "next/link";
import { ADMIN_ROUTE } from "@/lib/constants";

const links = [
  { href: ADMIN_ROUTE, label: "Dashboard" },
  { href: `${ADMIN_ROUTE}/orders`, label: "Orders" },
  { href: `${ADMIN_ROUTE}/products`, label: "Products" },
  { href: `${ADMIN_ROUTE}/reviews`, label: "Reviews" }
];

export function AdminNav() {
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-2xl border border-line bg-surface px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-surface-muted"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
