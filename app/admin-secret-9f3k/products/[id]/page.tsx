import { Prisma } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ADMIN_ROUTE } from "@/lib/constants";
import { productSchema } from "@/lib/validators";
import { AdminNav } from "@/components/admin-nav";
import { AdminConfirmButton } from "@/components/admin-confirm-button";
import { AdminProductForm } from "@/components/admin-product-form";

async function updateProduct(id: string, formData: FormData) {
  "use server";
  await requireAdmin();
  const parsed = productSchema.parse(Object.fromEntries(formData.entries()));
  await prisma.product.update({ where: { id }, data: parsed });
  redirect(`${ADMIN_ROUTE}/products/${id}`);
}

async function deleteProduct(id: string) {
  "use server";
  await requireAdmin();

  try {
    await prisma.product.delete({ where: { id } });
    redirect(`${ADMIN_ROUTE}/products`);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      throw new Error("Cannot delete a product that is already linked to existing orders.");
    }
    throw error;
  }
}

async function duplicateProduct(id: string) {
  "use server";
  await requireAdmin();
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return;

  const slug = `${product.slug}-copy-${Date.now().toString().slice(-6)}`;
  await prisma.product.create({
    data: {
      nameEn: `${product.nameEn} Copy`,
      nameAr: `${product.nameAr} نسخة`,
      slug,
      category: product.category,
      price: product.price,
      image: product.image,
      descriptionEn: product.descriptionEn,
      descriptionAr: product.descriptionAr,
      deliveryType: product.deliveryType,
      isActive: false
    }
  });

  redirect(`${ADMIN_ROUTE}/products`);
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <div className="container-page space-y-6 py-10">
      <AdminNav />
      <AdminProductForm
        action={updateProduct.bind(null, id)}
        heading="Edit Product"
        submitLabel="Update Product"
        initialValues={{
          nameEn: product.nameEn,
          nameAr: product.nameAr,
          slug: product.slug,
          category: product.category,
          price: Number(product.price),
          image: product.image,
          descriptionEn: product.descriptionEn,
          descriptionAr: product.descriptionAr,
          deliveryType: product.deliveryType,
          isActive: product.isActive
        }}
        extraActions={
          <>
            <AdminConfirmButton
              className="btn-secondary"
              formAction={duplicateProduct.bind(null, id)}
              message="Create a hidden duplicate copy of this product?"
            >
              Duplicate
            </AdminConfirmButton>
            <AdminConfirmButton
              className="btn-secondary"
              formAction={deleteProduct.bind(null, id)}
              message="Delete this product permanently?"
            >
              Delete Product
            </AdminConfirmButton>
          </>
        }
      />
    </div>
  );
}
