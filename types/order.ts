import { OrderItem, OrderItemPayload } from "./orderItem";

export type OrderPaymentMethod = 'cash' | 'card' | 'qris';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'finished' |'cancelled';

export type Order = {
  id: string;
  status: OrderStatus;
  paymentMethod: OrderPaymentMethod;
  tableNumber: string;
  totalPrice: number;
  cashierId?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderWithItems = Order & {
  items: OrderItem[];
};

export type OrderPreview = Omit<Order, 'paymentMethod' | 'totalPrice' | 'cashierId' | 'updatedAt'>;

export type OrderPreviewWithItems = OrderPreview & {
  items: Omit<OrderItemPayload, 'orderId'>[];
};

export type OrderPayload = Omit<Order, 'id' | 'totalPrice' | 'createdAt' | 'updatedAt'> & {
  items: Omit<OrderItemPayload, 'orderId' | 'nameSnapshot' | 'priceSnapshot'>[];
};

export type OrderQueryParams = {
  cashierId?: string;
  status?: OrderStatus[];
  startDate?: Date;
  endDate?: Date;
};