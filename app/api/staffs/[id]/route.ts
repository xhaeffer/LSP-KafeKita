import { NextRequest, NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { getStaff, updateStaff, deleteStaff } from "@/lib/services/staff.service";
import { StaffPatchPayloadSchema } from "@/schemas/staff";

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireRole(req, ["admin"]);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  const staff = await getStaff(id);

  return NextResponse.json(staff);
};

export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireRole(req, ["admin"]);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const json = await req.json();
  const parsed = StaffPatchPayloadSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const { id } = await params;
  await updateStaff(id, parsed.data);

  return NextResponse.json({ success: true });
};

export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireRole(req, ["admin"]);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  await deleteStaff(id);

  return NextResponse.json({ success: true });
};