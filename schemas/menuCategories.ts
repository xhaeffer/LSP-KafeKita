import { z } from "zod";

export const MenuCategoryPayloadSchema = z.object({
  name: z.string().min(1),
  imageUrl: z.string().url().optional(),
});

export const MenuCategorPatchPayloadSchema = 
  MenuCategoryPayloadSchema.partial()