import { NextRequest, NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { deleteMenuCategory, updateMenuCategory } from "@/lib/services/menuCategories.service";

import { MenuCategorPatchPayloadSchema } from "@/schemas/menuCategories";

export const PATCH = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const user = await requireRole(req, ["admin"]);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const json = await req.json();
  const parsed = MenuCategorPatchPayloadSchema.safeParse(json);
  
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  await updateMenuCategory(params.id, parsed.data);
  return NextResponse.json({ success: true });
};

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const user = await requireRole(req, ["admin"]);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  await deleteMenuCategory(params.id);
  return NextResponse.json({ success: true });
};