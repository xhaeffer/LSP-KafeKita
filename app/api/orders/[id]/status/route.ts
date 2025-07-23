import { NextRequest, NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { updateOrder } from "@/lib/services/orders.service";

import { OrderStatusUpdateSchema } from "@/schemas/order";

export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireRole(req, ["admin", "kitchen", "cashier"]);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const json = await req.json();
  const parsed = OrderStatusUpdateSchema.safeParse(json);
  
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const { id } = await params;
  await updateOrder(id, { status: parsed.data.status });
  
  return NextResponse.json({ success: true });
};