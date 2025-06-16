import { NextRequest, NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { createStaff, getStaffs } from "@/lib/services/staff.service";
import { StaffPayloadSchema } from "@/schemas/staff";

export const GET = async (req: NextRequest) => {
  const user = await requireRole(req, ["admin"]);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const staffs = await getStaffs();
  return NextResponse.json(staffs);
};

export const POST = async (req: NextRequest) => {
  const user = await requireRole(req, ["admin"]);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const json = await req.json();
  const parsed = StaffPayloadSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const newStaff = await createStaff(parsed.data);
  return NextResponse.json(newStaff, { status: 201 });
};