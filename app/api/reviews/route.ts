import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const reviewSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(2).max(80),
  rating: z.number().int().min(1).max(5)
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = reviewSchema.parse(body);

    await prisma.review.create({
      data: {
        productId: data.productId,
        name: data.name,
        rating: data.rating,
        status: "PENDING"
      }
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Invalid review payload" }, { status: 400 });
  }
}
