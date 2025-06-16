import { NextRequest, NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { createMenuCategory, getMenuCategories } from "@/lib/services/menuCategories.service";

import { MenuCategoryPayloadSchema } from "@/schemas/menuCategories";

export const GET = async () => {
  const categories = await getMenuCategories();
  return NextResponse.json(categories);
};

export const POST = async (req: NextRequest) => {
  const user = await requireRole(req, ["admin"]);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const json = await req.json();
  const parsed = MenuCategoryPayloadSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const result = await createMenuCategory(parsed.data);
  return NextResponse.json(result, { status: 201 });
};