import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ADMIN_ROUTE } from "@/lib/constants";
import { buildWhatsAppLink, formatCurrency } from "@/lib/utils";
import { orderNotesSchema, updateOrderStatusSchema } from "@/lib/validators";
import { AdminNav } from "@/components/admin-nav";
import { AdminStatusBadge } from "@/components/admin-status-badge";

async function updateStatus(orderId: string, formData: FormData) {
  "use server";
  await requireAdmin();
  const parsed = updateOrderStatusSchema.parse({
    status: String(formData.get("status") || "PENDING"),
    note: String(formData.get("note") || "")
  });

  await prisma.order.update({
    where: { id: orderId },
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

  redirect(`${ADMIN_ROUTE}/orders/${orderId}`);
}

async function saveNotes(orderId: string, formData: FormData) {
  "use server";
  await requireAdmin();
  const parsed = orderNotesSchema.parse({
    notes: String(formData.get("notes") || "")
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { notes: parsed.notes || null }
  });

  redirect(`${ADMIN_ROUTE}/orders/${orderId}`);
}

async function deleteOrder(orderId: string, formData: FormData) {
  "use server";
  await requireAdmin();

  const password = String(formData.get("password") || "");
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    throw new Error("Invalid admin password.");
  }

  await prisma.order.delete({
    where: { id: orderId }
  });

  redirect(`${ADMIN_ROUTE}/orders`);
}

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
      events: { orderBy: { createdAt: "desc" } }
    }
  });

  if (!order) notFound();

  return (
    <div className="container-page space-y-6 py-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground">Order Details</h1>
          <p className="mt-2 text-muted">{order.id}</p>
        </div>
        <AdminNav />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="card space-y-5 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <AdminStatusBadge status={order.status} />
            <span className="text-sm text-muted">{formatCurrency(Number(order.totalPrice), "en")}</span>
            {order.deliveredAt ? <span className="text-sm text-muted">Delivered at {order.deliveredAt.toLocaleString()}</span> : null}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-surface-muted p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted">Customer</div>
              <div className="mt-2 font-bold text-foreground">{order.customerName}</div>
              <div className="text-sm text-muted">{order.phone}</div>
            </div>
            <div className="rounded-2xl bg-surface-muted p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted">Quick Action</div>
              <Link
                href={buildWhatsAppLink(
                  order.id,
                  formatCurrency(Number(order.totalPrice), "en"),
                  order.customerName,
                  order.phone,
                  "en",
                  order.items.map((item) => ({
                    name: item.product.nameEn,
                    quantity: item.quantity
                  }))
                )}
                target="_blank"
                className="mt-2 inline-flex text-sm font-semibold text-brand underline-offset-4 hover:underline"
              >
                Open WhatsApp message
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black text-foreground">Items</h2>
            <div className="mt-4 space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="rounded-2xl border border-line p-4">
                  <div className="font-semibold text-foreground">{item.product.nameEn}</div>
                  <div className="text-sm text-muted">{item.product.nameAr}</div>
                  <div className="mt-2 text-sm text-muted">
                    Qty {item.quantity} - {formatCurrency(Number(item.price) * item.quantity, "en")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="text-xl font-black text-foreground">Update Status</h2>
            <form action={updateStatus.bind(null, order.id)} className="mt-4 space-y-3">
              <select name="status" defaultValue={order.status} className="input">
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="DELIVERED">Delivered</option>
              </select>
              <textarea name="note" className="input min-h-24" placeholder="Optional note for this change" />
              <button className="btn-primary w-full">Save status</button>
            </form>
          </section>

          <section className="card p-6">
            <h2 className="text-xl font-black text-foreground">Internal Notes</h2>
            <form action={saveNotes.bind(null, order.id)} className="mt-4 space-y-3">
              <textarea name="notes" className="input min-h-32" defaultValue={order.notes || ""} placeholder="Internal notes only" />
              <button className="btn-primary w-full">Save notes</button>
            </form>
          </section>

          <section className="card p-6">
            <h2 className="text-xl font-black text-foreground">Status History</h2>
            <div className="mt-4 space-y-3">
              {order.events.length ? order.events.map((event) => (
                <div key={event.id} className="rounded-2xl border border-line p-4">
                  <div className="flex items-center justify-between gap-3">
                    <AdminStatusBadge status={event.status} />
                    <span className="text-xs text-muted">{event.createdAt.toLocaleString()}</span>
                  </div>
                  {event.note ? <p className="mt-2 text-sm text-muted">{event.note}</p> : null}
                </div>
              )) : (
                <p className="text-sm text-muted">No history yet.</p>
              )}
            </div>
          </section>

          <section className="card p-6">
            <h2 className="text-xl font-black text-foreground">Delete Order</h2>
            <p className="mt-2 text-sm text-muted">
              Type the admin password, then delete this order permanently.
            </p>
            <form action={deleteOrder.bind(null, order.id)} className="mt-4 space-y-3">
              <input
                name="password"
                type="password"
                className="input"
                placeholder="Admin password"
                required
              />
              <button className="btn-secondary w-full">Delete order</button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
