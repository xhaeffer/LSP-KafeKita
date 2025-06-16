import { NextRequest, NextResponse } from "next/server"

import { requireRole } from "@/lib/auth"
import { createMenuItem, getMenuItems } from "@/lib/services/menuItems.service"

import { MenuItemQueryParams } from "@/types/menuItem";

import { MenuItemPayloadSchema } from "@/schemas/menu";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const params: MenuItemQueryParams = {
    categoryId: searchParams.get("categoryId") || undefined,
    isAvailable: searchParams.get("isAvailable") === "true" ? true : undefined,
  }

  const menu = await getMenuItems(params);
  return NextResponse.json(menu);
};

export const POST = async (req: NextRequest) => {
  const user = await requireRole(req, ["admin"]);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const json = await req.json();
  const parsed = MenuItemPayloadSchema.safeParse(json);
  
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const result = await createMenuItem({
    ...parsed.data,
    isAvailable: true
  });
  
  return NextResponse.json(result, { status: 201 });
};
