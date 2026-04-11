import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ADMIN_ROUTE } from "@/lib/constants";
import { getActionErrorMessage } from "@/lib/action-errors";
import { parseProductFormData } from "@/lib/product-form";
import { AdminNav } from "@/components/admin-nav";
import { AdminProductForm } from "@/components/admin-product-form";

async function createProduct(formData: FormData) {
  "use server";
  await requireAdmin();

  try {
    const parsed = parseProductFormData(formData);
    await prisma.product.create({ data: parsed });
  } catch (error) {
    redirect(`${ADMIN_ROUTE}/products/new?error=${encodeURIComponent(getActionErrorMessage(error))}`);
  }

  redirect(`${ADMIN_ROUTE}/products`);
}

export default async function NewProductPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const query = await searchParams;

  return (
    <div className="container-page space-y-6 py-10">
      <AdminNav />
      {query.error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {query.error}
        </div>
      ) : null}
      <AdminProductForm
        action={createProduct}
        heading="Add Product"
        submitLabel="Save Product"
        initialValues={{
          nameEn: "",
          nameAr: "",
          slug: "",
          category: "AI",
          price: 0,
          image: "",
          descriptionEn: "",
          descriptionAr: "",
          deliveryType: "PRIVATE_ACCOUNT",
          isActive: true,
          isFeatured: false
        }}
      />
    </div>
  );
}
