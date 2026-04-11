import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const targetSlug = "chatgpt-plus-account-1m-on-your-personal-account";

const reviews = [
  { name: "أحمد الخوالدة", rating: 5 },
  { name: "سارة محمود", rating: 5 },
  { name: "محمد العلي", rating: 4 },
  { name: "لينا يوسف", rating: 5 },
  { name: "رامي النسور", rating: 4 },
  { name: "هدى الصالح", rating: 5 }
] as const;

async function main() {
  const product = await prisma.product.findUnique({
    where: { slug: targetSlug },
    select: { id: true, nameAr: true, nameEn: true }
  });

  if (!product) {
    throw new Error(`Product not found for slug: ${targetSlug}`);
  }

  for (const review of reviews) {
    const existing = await prisma.review.findFirst({
      where: {
        productId: product.id,
        name: review.name
      },
      select: { id: true }
    });

    if (existing) continue;

    await prisma.review.create({
      data: {
        productId: product.id,
        name: review.name,
        rating: review.rating,
        comment: null,
        status: "APPROVED"
      }
    });
  }

  const summary = await prisma.review.aggregate({
    where: { productId: product.id, status: "APPROVED" },
    _avg: { rating: true },
    _count: { rating: true }
  });

  console.log(
    JSON.stringify(
      {
        product: product.nameAr || product.nameEn,
        totalApprovedReviews: summary._count.rating,
        averageRating: summary._avg.rating
      },
      null,
      2
    )
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
