import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ADMIN_ROUTE } from "@/lib/constants";
import { productSchema } from "@/lib/validators";
import { AdminNav } from "@/components/admin-nav";
import { AdminProductForm } from "@/components/admin-product-form";

async function createProduct(formData: FormData) {
  "use server";
  await requireAdmin();
  const parsed = productSchema.parse(Object.fromEntries(formData.entries()));
  await prisma.product.create({ data: parsed });
  redirect(`${ADMIN_ROUTE}/products`);
}

export default async function NewProductPage() {
  await requireAdmin();

  return (
    <div className="container-page space-y-6 py-10">
      <AdminNav />
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
          isActive: true
        }}
      />
    </div>
  );
}
