import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { createOrderSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(`order:${forwardedFor}`)) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const parsed = createOrderSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  if (parsed.data.honeypot) return NextResponse.json({ error: "Spam detected" }, { status: 400 });

  const productIds = [...new Set(parsed.data.items.map((item) => item.productId))];
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  if (products.length !== productIds.length) {
    return NextResponse.json({ error: "Some items are unavailable" }, { status: 400 });
  }

  const productMap = new Map(products.map((product) => [product.id, product]));
  const total = parsed.data.items.reduce((sum, item) => {
    const product = productMap.get(item.productId)!;
    return sum + Number(product.price) * item.quantity;
  }, 0);

  const order = await prisma.order.create({
    data: {
      customerName: parsed.data.customerName,
      phone: parsed.data.phone,
      totalPrice: total,
      items: {
        create: parsed.data.items.map((item) => {
          const product = productMap.get(item.productId)!;
          return { productId: item.productId, quantity: item.quantity, price: product.price };
        })
      },
      events: {
        create: {
          status: "PENDING",
          note: "Order created"
        }
      }
    }
  });

  return NextResponse.json({
    order: {
      id: order.id,
      customerName: order.customerName,
      phone: order.phone,
      totalPrice: Number(order.totalPrice),
      status: order.status
    }
  }, { status: 201 });
}
