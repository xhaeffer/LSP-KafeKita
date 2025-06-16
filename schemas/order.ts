import { z } from "zod";

export const OrderItemPayloadSchema = z.object({
  menuItemId: z.string().min(1),
  quantity: z.number().min(1),
  note: z.string().optional(),
});

export const OrderPayloadSchema = z.object({
  tableNumber: z.string().min(1),
  paymentMethod: z.enum(["cash", "card", "qris"]),
  status: z.enum(["pending", "confirmed"]).default("pending"),
  items: z.array(OrderItemPayloadSchema).min(1),
  cashierId: z.string().optional(),
});

export const OrderUpdatePayloadSchema = z.object({
  status: z.enum(["confirmed", "preparing", "ready", "finished", "cancelled"]),
  paymentMethod: z.enum(["cash", "card", "qris"]),
  cashierId: z.string(),
}).partial();

export const OrderStatusUpdateSchema = z.object({
  status: z.enum(["confirmed", "preparing", "ready", "finished", "cancelled"]),
});
