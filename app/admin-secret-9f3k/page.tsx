import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { clearAdminSessionCookie, isAdminAuthenticated, setAdminSessionCookie } from "@/lib/auth";
import { ADMIN_ROUTE } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { AdminNav } from "@/components/admin-nav";
import { AdminStatusBadge } from "@/components/admin-status-badge";

async function login(formData: FormData) {
  "use server";
  const password = String(formData.get("password") || "");
  if (password !== process.env.ADMIN_PASSWORD) return;
  await setAdminSessionCookie();
  redirect(ADMIN_ROUTE);
}

async function logout() {
  "use server";
  await clearAdminSessionCookie();
  redirect(ADMIN_ROUTE);
}

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return (
      <div className="container-page py-10">
        <form action={login} className="mx-auto max-w-md card space-y-4 p-6">
          <h1 className="text-2xl font-black text-foreground">Admin Login</h1>
          <input name="password" type="password" className="input" placeholder="Admin password" required />
          <button className="btn-primary w-full">Unlock Dashboard</button>
        </form>
      </div>
    );
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [products, orders, pendingReviews] = await Promise.all([
    prisma.product.findMany({
      include: { orderItems: { select: { quantity: true } } },
      orderBy: { updatedAt: "desc" }
    }),
    prisma.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
      take: 5
    }),
    prisma.review.count({ where: { status: "PENDING" } })
  ]);

  const [orderCount, pendingCount, paidCount, deliveredCount, todayCount] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "PAID" } }),
    prisma.order.count({ where: { status: "DELIVERED" } }),
    prisma.order.count({ where: { createdAt: { gte: startOfDay } } })
  ]);

  const topProducts = products
    .map((product) => ({
      ...product,
      totalOrdered: product.orderItems.reduce((sum, item) => sum + item.quantity, 0)
    }))
    .sort((left, right) => right.totalOrdered - left.totalOrdered)
    .slice(0, 5);

  const visibleCount = products.filter((product) => product.isActive).length;

  return (
    <div className="container-page space-y-8 py-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-foreground">Admin Dashboard</h1>
          <p className="text-muted">Overview, actions, and shortcuts for AccuUp operations.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <AdminNav />
          <form action={logout}><button className="btn-secondary">Logout</button></form>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Products", value: products.length },
          { label: "Visible products", value: visibleCount },
          { label: "Orders", value: orderCount },
          { label: "New today", value: todayCount },
          { label: "Pending", value: pendingCount },
          { label: "Paid", value: paidCount },
          { label: "Delivered", value: deliveredCount },
          { label: "Pending reviews", value: pendingReviews }
        ].map((item) => (
          <div key={item.label} className="card p-5">
            <div className="text-sm text-muted">{item.label}</div>
            <div className="mt-2 text-3xl font-black text-foreground">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href={`${ADMIN_ROUTE}/products/new`} className="btn-primary">Add Product</Link>
        <Link href={`${ADMIN_ROUTE}/orders`} className="btn-secondary">Manage Orders</Link>
        <Link href={`${ADMIN_ROUTE}/products`} className="btn-secondary">Manage Products</Link>
        <Link href={`${ADMIN_ROUTE}/reviews`} className="btn-secondary">Moderate Reviews</Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="card overflow-hidden">
          <div className="border-b border-line px-6 py-4">
            <h2 className="text-xl font-black text-foreground">Latest Orders</h2>
          </div>
          <div className="divide-y divide-line">
            {orders.map((order) => (
              <div key={order.id} className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-bold text-foreground">{order.customerName}</div>
                  <div className="text-sm text-muted">{order.phone}</div>
                  <div className="mt-1 text-sm text-muted">{formatCurrency(Number(order.totalPrice), "en")}</div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <AdminStatusBadge status={order.status} />
                  <Link href={`${ADMIN_ROUTE}/orders/${order.id}`} className="text-sm font-semibold text-brand underline-offset-4 hover:underline">
                    Open
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card overflow-hidden">
          <div className="border-b border-line px-6 py-4">
            <h2 className="text-xl font-black text-foreground">Top Products</h2>
          </div>
          <div className="divide-y divide-line">
            {topProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between gap-4 px-6 py-4">
                <div>
                  <div className="font-semibold text-foreground">{product.nameEn}</div>
                  <div className="text-sm text-muted">{product.category}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-foreground">{product.totalOrdered} sold</div>
                  <div className="text-xs text-muted">{product.isActive ? "Visible" : "Hidden"}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
