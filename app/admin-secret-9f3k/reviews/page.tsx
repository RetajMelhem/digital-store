import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ADMIN_ROUTE } from "@/lib/constants";
import { reviewModerationSchema } from "@/lib/validators";
import { AdminNav } from "@/components/admin-nav";
import { AdminConfirmButton } from "@/components/admin-confirm-button";
import { AdminStatusBadge } from "@/components/admin-status-badge";

async function moderateReview(id: string, formData: FormData) {
  "use server";
  await requireAdmin();
  const parsed = reviewModerationSchema.parse({
    status: String(formData.get("status") || "APPROVED")
  });

  await prisma.review.update({
    where: { id },
    data: {
      status: parsed.status,
      moderatedAt: new Date()
    }
  });

  redirect(`${ADMIN_ROUTE}/reviews`);
}

async function deleteReview(id: string) {
  "use server";
  await requireAdmin();
  await prisma.review.delete({ where: { id } });
  redirect(`${ADMIN_ROUTE}/reviews`);
}

export default async function AdminReviewsPage({
  searchParams
}: {
  searchParams: Promise<{ status?: string; productId?: string }>;
}) {
  await requireAdmin();
  const query = await searchParams;
  const status = ["PENDING", "APPROVED", "HIDDEN"].includes(query.status || "") ? query.status : "";
  const productId = query.productId || "";

  const [products, reviews] = await Promise.all([
    prisma.product.findMany({ orderBy: { nameEn: "asc" } }),
    prisma.review.findMany({
      where: {
        ...(status ? { status: status as "PENDING" | "APPROVED" | "HIDDEN" } : {}),
        ...(productId ? { productId } : {})
      },
      include: { product: true },
      orderBy: { createdAt: "desc" }
    })
  ]);

  return (
    <div className="container-page space-y-6 py-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground">Reviews</h1>
          <p className="mt-2 text-muted">Approve, hide, or remove product reviews.</p>
        </div>
        <AdminNav />
      </div>

      <form className="card grid gap-3 p-5 md:grid-cols-[240px_1fr_auto]">
        <select name="status" className="input" defaultValue={status}>
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="HIDDEN">Hidden</option>
        </select>
        <select name="productId" className="input" defaultValue={productId}>
          <option value="">All products</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>{product.nameEn}</option>
          ))}
        </select>
        <button className="btn-primary">Apply</button>
      </form>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="card p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-1">
                <div className="font-bold text-foreground">{review.name}</div>
                <div className="text-sm text-muted">{review.product.nameEn}</div>
                <div className="text-sm text-muted">{review.rating}/5</div>
              </div>
              <AdminStatusBadge status={review.status === "PENDING" ? "PENDING" : review.status} />
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <form action={moderateReview.bind(null, review.id)}>
                <input type="hidden" name="status" value="APPROVED" />
                <button className="btn-secondary">Approve</button>
              </form>
              <form action={moderateReview.bind(null, review.id)}>
                <input type="hidden" name="status" value="HIDDEN" />
                <button className="btn-secondary">Hide</button>
              </form>
              <form action={moderateReview.bind(null, review.id)}>
                <input type="hidden" name="status" value="PENDING" />
                <button className="btn-secondary">Mark Pending</button>
              </form>
              <form>
                <AdminConfirmButton
                  className="btn-secondary"
                  formAction={deleteReview.bind(null, review.id)}
                  message="Delete this review permanently?"
                >
                  Delete
                </AdminConfirmButton>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
