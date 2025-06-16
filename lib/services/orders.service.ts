import { Timestamp, Query } from "firebase-admin/firestore";

import { db } from "../firebase-admin";
import { createOrderItems, getOrderItems, getOrderItemsBulk } from "./orderItems.service";

import {
  OrderPayload,
  OrderPreview,
  OrderQueryParams,
  OrderWithItems
} from "@/types/order";
import { getMenuItemsBulk } from "./menuItems.service";

const COLLECTION = 'orders';

const generateOrderQuery = (params?: OrderQueryParams) => {
  let queryRef = db
    .collection(COLLECTION)
    .select('status', 'tableNumber', 'createdAt') as Query;

  if (params?.cashierId) {
    queryRef = queryRef.where('cashierId', '==', params.cashierId);
  }

  if (params?.status && params.status.length > 0) {
    queryRef = queryRef.where('status', 'in', params.status);
  }

  if (params?.startDate) {
    queryRef = queryRef.where('createdAt', '>=', Timestamp.fromDate(params.startDate));
  }

  if (params?.endDate) {
    queryRef = queryRef.where('createdAt', '<=', Timestamp.fromDate(params.endDate));
  }

  queryRef = queryRef.orderBy('createdAt', 'asc');

  return queryRef;
}

export const createOrder = async (data: OrderPayload) => {
  const { items, ...dataWithoutItems } = data;

  const menuItemIds = items.map(i => i.menuItemId);
  const menuItems = await getMenuItemsBulk(menuItemIds);

  const menuMap = new Map(
    menuItems.map(item => [item.id, item])
  );

  const orderItems = items.map(item => {
    const menu = menuMap.get(item.menuItemId);
    return {
      ...item,
      orderId: '',
      nameSnapshot: menu?.name ?? '',
      priceSnapshot: menu?.price ?? 0,
    };
  });

  const totalPrice = orderItems.reduce((sum, item) => {
    return sum + (item.priceSnapshot * item.quantity);
  }, 0);

  const orderDoc = await db
    .collection(COLLECTION)
    .add({
      ...dataWithoutItems,
      totalPrice,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

  const orderId = orderDoc.id;

  await createOrderItems(
    orderItems.map(item => ({
      ...item,
      orderId,
    })),
  );

  return { id: orderId };
};

export const getOrders = async (params: OrderQueryParams = {}) => {
  const queryRef = generateOrderQuery(params);

  const snap = await queryRef.get();
  if (snap.empty) return [];

  const orders = snap.docs.map((item) => ({
    id: item.id,
    ...item.data(),
    createdAt: item.data().createdAt.toDate().toISOString(),
  })) as OrderPreview[];

  const orderIds = orders.map(i => i.id);
  const orderItems = await getOrderItemsBulk(orderIds);

  const ordersWithItems = orders.map((order) => ({
    ...order,
    items: orderItems[order.id] || [],
  }));

  return ordersWithItems;
};

export const getOrder = async (id: string) => {
  const doc = await db
    .collection(COLLECTION)
    .doc(id)
    .get();

  if (!doc.exists) return null;

  return {
    id: doc.id,
    ...doc.data(),
    items: await getOrderItems(id),
    createdAt: doc.data()?.createdAt.toDate().toISOString(),
    updatedAt: doc.data()?.updatedAt.toDate().toISOString(),
  } as OrderWithItems;
}

export const updateOrder = async (id: string, data: Partial<OrderPayload>) => {
  await db
    .collection(COLLECTION)
    .doc(id)
    .update({
      ...data,
      updatedAt: Timestamp.now(),
    });
}