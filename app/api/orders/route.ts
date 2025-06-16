import { NextRequest, NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { createOrder, getOrders } from "@/lib/services/orders.service";

import { OrderQueryParams, OrderStatus } from "@/types/order";

import { OrderPayloadSchema } from "@/schemas/order";

export const GET = async (req: NextRequest) => {
  const user = await requireRole(req, ["admin", "cashier", "kitchen"]);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const params: OrderQueryParams = {
    cashierId: searchParams.get("cashierId") || undefined,
    status: searchParams.getAll("status") as OrderStatus[] | undefined,
    startDate: searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined,
    endDate: searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined,
  };

  const orders = await getOrders(params);
  return NextResponse.json(orders);
};

export const POST = async (req: NextRequest) => {
  const json = await req.json();
  const parsed = OrderPayloadSchema.safeParse(json);
  
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const result = await createOrder(parsed.data);
  return NextResponse.json(result, { status: 201 });
};