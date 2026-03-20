import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { assertAdminRequest } from "@/lib/admin";
import { updateOrderStatusSchema } from "@/lib/validators";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!assertAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = updateOrderStatusSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { id } = await params;
  const order = await prisma.order.update({
    where: { id },
    data: {
      status: parsed.data.status,
      deliveredAt: parsed.data.status === "DELIVERED" ? new Date() : null,
      events: {
        create: {
          status: parsed.data.status,
          note: parsed.data.note || null
        }
      }
    }
  });
  return NextResponse.json(order);
}
