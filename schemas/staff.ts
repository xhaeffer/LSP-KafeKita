import { z } from "zod";

export const StaffPayloadSchema = z.object({
  displayName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "cashier", "kitchen"]),
  disabled: z.boolean().optional().default(false),
});

export const StaffPatchPayloadSchema = StaffPayloadSchema.partial()