import { NextRequest, NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { getOrder, updateOrder } from "@/lib/services/orders.service";

import { OrderUpdatePayloadSchema } from "@/schemas/order";

export const GET = async (_req: NextRequest, { params }: { params: { id: string } }) => {
  const order = await getOrder(params.id);
  if (!order) return NextResponse.json({ error: "Not Found" }, { status: 404 });
  
  return NextResponse.json(order);
};

export const PATCH = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const user = await requireRole(req, ["admin", "kitchen", "cashier"]);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const json = await req.json();
  const parsed = OrderUpdatePayloadSchema.safeParse(json);
  
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  await updateOrder(params.id, parsed.data);
  return NextResponse.json({ success: true });
};