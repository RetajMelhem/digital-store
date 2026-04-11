import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ADMIN_ROUTE } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { AdminNav } from "@/components/admin-nav";

export default async function AdminProductsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string; visibility?: string; featured?: string }>;
}) {
  await requireAdmin();
  const query = await searchParams;
  const q = query.q?.trim() || "";
  const category = query.category || "";
  const visibility = query.visibility || "";
  const featured = query.featured || "";
  const sort = query.sort || "updated";

  const products = await prisma.product.findMany({
    where: {
      ...(q
        ? {
            OR: [
              { nameEn: { contains: q, mode: "insensitive" } },
              { nameAr: { contains: q, mode: "insensitive" } },
              { slug: { contains: q, mode: "insensitive" } }
            ]
          }
        : {}),
      ...(category ? { category } : {}),
      ...(visibility === "visible" ? { isActive: true } : visibility === "hidden" ? { isActive: false } : {}),
      ...(featured === "featured" ? { isFeatured: true } : featured === "regular" ? { isFeatured: false } : {})
    },
    include: {
      _count: {
        select: {
          reviews: true,
          orderItems: true
        }
      }
    },
    orderBy:
      sort === "price-asc"
        ? { price: "asc" }
        : sort === "price-desc"
          ? { price: "desc" }
          : { updatedAt: "desc" }
  });

  return (
    <div className="container-page space-y-6 py-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground">Products</h1>
          <p className="mt-2 text-muted">Search, filter, sort, and manage product visibility.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <AdminNav />
          <Link href={`${ADMIN_ROUTE}/products/new`} className="btn-primary">Add Product</Link>
        </div>
      </div>

      <form className="card grid gap-3 p-5 md:grid-cols-5 xl:grid-cols-[1fr_180px_180px_180px_180px_auto]">
        <input name="q" className="input" placeholder="Search by name or slug" defaultValue={q} />
        <select name="category" className="input" defaultValue={category}>
          <option value="">All categories</option>
          <option value="AI">AI</option>
          <option value="Gaming">Gaming</option>
          <option value="Social Media">Social Media</option>
        </select>
        <select name="visibility" className="input" defaultValue={visibility}>
          <option value="">All visibility</option>
          <option value="visible">Visible</option>
          <option value="hidden">Hidden</option>
        </select>
        <select name="featured" className="input" defaultValue={featured}>
          <option value="">All placement</option>
          <option value="featured">Featured on homepage</option>
          <option value="regular">Not featured</option>
        </select>
        <select name="sort" className="input" defaultValue={sort}>
          <option value="updated">Recently updated</option>
          <option value="price-asc">Price low to high</option>
          <option value="price-desc">Price high to low</option>
        </select>
        <button className="btn-primary">Apply</button>
      </form>

      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-surface-muted text-left text-muted">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Delivery</th>
              <th className="px-4 py-3">Visibility</th>
              <th className="px-4 py-3">Homepage</th>
              <th className="px-4 py-3">Stats</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-line">
                <td className="px-4 py-3">
                  <div className="font-semibold text-foreground">{product.nameEn}</div>
                  <div className="text-xs text-muted">{product.slug}</div>
                </td>
                <td className="px-4 py-3 text-foreground">{product.category}</td>
                <td className="px-4 py-3 text-foreground">{formatCurrency(Number(product.price), "en")}</td>
                <td className="px-4 py-3 text-muted">{product.deliveryType === "PRIVATE_ACCOUNT" ? "Private account" : "Customer account"}</td>
                <td className="px-4 py-3 text-muted">{product.isActive ? "Visible" : "Hidden"}</td>
                <td className="px-4 py-3 text-muted">{product.isFeatured ? "Featured" : "Standard"}</td>
                <td className="px-4 py-3 text-muted">{product._count.orderItems} orders / {product._count.reviews} reviews</td>
                <td className="px-4 py-3">
                  <Link href={`${ADMIN_ROUTE}/products/${product.id}`} className="font-semibold text-brand underline-offset-4 hover:underline">
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
