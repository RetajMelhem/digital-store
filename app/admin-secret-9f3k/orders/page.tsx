import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ADMIN_ROUTE } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { updateOrderStatusSchema } from "@/lib/validators";
import { AdminNav } from "@/components/admin-nav";
import { AdminStatusBadge } from "@/components/admin-status-badge";

async function updateOrderStatus(id: string, formData: FormData) {
  "use server";
  await requireAdmin();
  const parsed = updateOrderStatusSchema.parse({
    status: String(formData.get("status") || "PENDING"),
    note: String(formData.get("note") || "")
  });

  await prisma.order.update({
    where: { id },
    data: {
      status: parsed.status,
      deliveredAt: parsed.status === "DELIVERED" ? new Date() : null,
      events: {
        create: {
          status: parsed.status,
          note: parsed.note || null
        }
      }
    }
  });

  redirect(`${ADMIN_ROUTE}/orders`);
}

export default async function OrdersPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  await requireAdmin();
  const query = await searchParams;
  const q = query.q?.trim() || "";
  const status = ["PENDING", "PAID", "DELIVERED"].includes(query.status || "") ? query.status : "";

  const orders = await prisma.order.findMany({
    where: {
      ...(status ? { status: status as "PENDING" | "PAID" | "DELIVERED" } : {}),
      ...(q
        ? {
            OR: [
              { id: { contains: q, mode: "insensitive" } },
              { customerName: { contains: q, mode: "insensitive" } },
              { phone: { contains: q, mode: "insensitive" } }
            ]
          }
        : {})
    },
    include: {
      items: { include: { product: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="container-page space-y-6 py-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground">Orders</h1>
          <p className="mt-2 text-muted">Search, filter, update, and inspect every order.</p>
        </div>
        <AdminNav />
      </div>

      <form className="card grid gap-3 p-5 md:grid-cols-[1fr_220px_auto]">
        <input name="q" className="input" placeholder="Search by ID, name, or phone" defaultValue={q} />
        <select name="status" className="input" defaultValue={status}>
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="DELIVERED">Delivered</option>
        </select>
        <button className="btn-primary">Apply</button>
      </form>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="card p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-1">
                <div className="font-bold text-foreground">{order.customerName}</div>
                <div className="text-sm text-muted">Order ID: {order.id}</div>
                <div className="text-sm text-muted">Phone: {order.phone}</div>
                <div className="text-sm text-muted">Total: {formatCurrency(Number(order.totalPrice), "en")}</div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <AdminStatusBadge status={order.status} />
                <Link href={`${ADMIN_ROUTE}/orders/${order.id}`} className="btn-secondary">
                  Details
                </Link>
              </div>
            </div>

            <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm text-muted">
              {order.items.map((item) => (
                <div key={item.id}>
                  {item.product.nameEn} / {item.product.nameAr} x {item.quantity} - {formatCurrency(Number(item.price) * item.quantity, "en")}
                </div>
              ))}
            </div>

            <form action={updateOrderStatus.bind(null, order.id)} className="mt-4 grid gap-3 md:grid-cols-[220px_1fr_auto]">
              <select name="status" defaultValue={order.status} className="input">
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="DELIVERED">Delivered</option>
              </select>
              <input name="note" className="input" placeholder="Internal note for this status change" />
              <button className="btn-primary">Save</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
