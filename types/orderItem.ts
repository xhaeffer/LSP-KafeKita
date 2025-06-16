export type OrderItem = {
  id: string;
  orderId: string;
  menuItemId: string;
  nameSnapshot: string;
  priceSnapshot: number;
  quantity: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export type OrderItemPreview = Omit<OrderItemPayload, 'orderId'  | 'nameSnapshot' | 'priceSnapshot'>;

export type OrderItemPayload = Omit<OrderItem, 'id' | 'createdAt' | 'updatedAt'>;