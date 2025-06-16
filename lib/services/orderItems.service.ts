import { Timestamp } from "firebase-admin/firestore";

import { db } from "../firebase-admin";

import { OrderItem, OrderItemPayload } from "@/types/orderItem";

const COLLECTION = 'order_items';

export const createOrderItems = async (data: OrderItemPayload[]) => {
  if (data.length === 0) return [];

  const batch = db.batch();
  const colRef = db.collection(COLLECTION);

  const ids: string[] = [];

  data.forEach(item => {
    const docRef = colRef.doc();
    ids.push(docRef.id);
    batch.set(docRef, {
      ...item,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  });

  await batch.commit();

  return ids.map(id => ({ id }));
};

export const getOrderItemsBulk = async (orderIds: string[]) => {
  if (orderIds.length === 0) return {};

  const MAX_BATCH = 10;
  const batches = [];

  for (let i = 0; i < orderIds.length; i += MAX_BATCH) {
    batches.push(orderIds.slice(i, i + MAX_BATCH));
  }

  const itemGroups: Record<string, OrderItem[]> = {};

  for (const chunk of batches) {
    const snap = await db
      .collection(COLLECTION)
      .where('orderId', 'in', chunk)
      .get();

    snap.docs.forEach((doc) => {
      const data = doc.data();
      const orderId = data.orderId;

      if (!itemGroups[orderId]) 
        itemGroups[orderId] = [];

      itemGroups[orderId].push({ 
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate().toISOString(),
        updatedAt: data.updatedAt.toDate().toISOString(),
      } as OrderItem);
    });
  }

  return itemGroups;
};

export const getOrderItems = async (orderId: string) => {
  const doc = await db
    .collection(COLLECTION)
    .where('orderId', '==', orderId)
    .get();

  if (doc.empty) return [];

  return doc.docs.map((item) => ({
    id: item.id,
    ...item.data(),
    createdAt: item.data().createdAt.toDate().toISOString(),
    updatedAt: item.data().updatedAt.toDate().toISOString(),
  })) as OrderItem[];
}
