import { Prisma } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ADMIN_ROUTE } from "@/lib/constants";
import { getActionErrorMessage } from "@/lib/action-errors";
import { parseProductFormData } from "@/lib/product-form";
import { AdminNav } from "@/components/admin-nav";
import { AdminConfirmButton } from "@/components/admin-confirm-button";
import { AdminProductForm } from "@/components/admin-product-form";

async function updateProduct(id: string, formData: FormData) {
  "use server";
  await requireAdmin();

  try {
    const parsed = parseProductFormData(formData);
    await prisma.product.update({ where: { id }, data: parsed });
  } catch (error) {
    redirect(`${ADMIN_ROUTE}/products/${id}?error=${encodeURIComponent(getActionErrorMessage(error))}`);
  }

  redirect(`${ADMIN_ROUTE}/products/${id}`);
}

async function deleteProduct(id: string) {
  "use server";
  await requireAdmin();

  try {
    await prisma.product.delete({ where: { id } });
  } catch (error) {
    const message =
      error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003"
        ? "Cannot delete a product that is already linked to existing orders."
        : getActionErrorMessage(error);
    redirect(`${ADMIN_ROUTE}/products/${id}?error=${encodeURIComponent(message)}`);
  }

  redirect(`${ADMIN_ROUTE}/products`);
}

async function duplicateProduct(id: string) {
  "use server";
  await requireAdmin();

  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      redirect(`${ADMIN_ROUTE}/products/${id}?error=${encodeURIComponent("The selected item no longer exists.")}`);
    }

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
        isActive: false,
        isFeatured: false
      }
    });
  } catch (error) {
    redirect(`${ADMIN_ROUTE}/products/${id}?error=${encodeURIComponent(getActionErrorMessage(error))}`);
  }

  redirect(`${ADMIN_ROUTE}/products`);
}

export default async function EditProductPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <div className="container-page space-y-6 py-10">
      <AdminNav />
      {query.error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {query.error}
        </div>
      ) : null}
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
          isActive: product.isActive,
          isFeatured: product.isFeatured
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
