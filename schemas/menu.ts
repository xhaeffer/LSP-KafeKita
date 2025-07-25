import { z } from "zod";

export const MenuItemPayloadSchema = z.object({
  name: z.string().min(1),
  price: z.number().nonnegative(),
  stock: z.number().nonnegative(),
  categoryId: z.string().min(1),
  imageUrl: z.string().url().optional(),
});

export const MenuItemPatchPayloadSchema = MenuItemPayloadSchema.partial();