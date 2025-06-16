import { FieldPath, Query, Timestamp } from "firebase-admin/firestore";

import { db } from "../firebase-admin";
import { getMenuCategories } from "./menuCategories.service";

import {
  MenuItem,
  MenuItemPayload,
  MenuItemPreview,
  MenuItemQueryParams,
  MenuItemPreviewWithCategory
} from "@/types/menuItem";

const COLLECTION = 'menu_items';

const generateMenuQuery = (params: MenuItemQueryParams) => {
  let queryRef = db
    .collection(COLLECTION)
    .select('name', 'price', 'isAvailable', 'imageUrl', 'categoryId') as Query;

  if (params.categoryId) {
    queryRef = queryRef.where('categoryId', '==', params.categoryId);
  }

  if (params.isAvailable !== undefined) {
    queryRef = queryRef.where('isAvailable', '==', params.isAvailable);
  }

  return queryRef;
}

export const createMenuItem = async (data: MenuItemPayload) => {
  const doc = await db
    .collection(COLLECTION)
    .add({
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

  return { id: doc.id };
}

export const getMenuItems = async (params: MenuItemQueryParams = {}) => {
  const queryRef = generateMenuQuery(params);

  const snap = await queryRef.get();
  if (snap.empty) return [];

  const categories = await getMenuCategories();
  const categoryMap = Object.fromEntries(
    categories.map(cat => [cat.id, { id: cat.id, name: cat.name }])
  );

  const menuItems = snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as MenuItemPreview[];

  const menuItemsWithCategory: MenuItemPreviewWithCategory[] = menuItems.map(item => ({
    ...item,
    category: categoryMap[item.categoryId] ?? { id: item.categoryId, name: null }
  }));

  return menuItemsWithCategory;
}

export const getMenuItemsBulk = async (ids: string[]) => {
  if (ids.length === 0) return [];

  const MAX_BATCH = 30;
  const batches = [];

  for (let i = 0; i < ids.length; i += MAX_BATCH) {
    const batchIds = ids.slice(i, i + MAX_BATCH);
    const snapshot = await db
      .collection(COLLECTION)
      .where(FieldPath.documentId(), 'in', batchIds)
      .get();
    batches.push(...snapshot.docs);
  }

  const menuItems = batches.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate().toISOString(),
    updatedAt: doc.data().updatedAt.toDate().toISOString(),
  })) as MenuItem[];

  const categories = await getMenuCategories();
  const categoryMap = new Map(
    categories.map(cat => [cat.id, cat])
  );

  const result: MenuItemPreviewWithCategory[] = menuItems.map(item => ({
    ...item,
    category: categoryMap.get(item.categoryId) ?? {
      id: item.categoryId,
      name: "Unknown",
    },
  }));

  return result;
}

export const updateMenuItem = async (id: string, data: Partial<MenuItemPayload>) => {
  await db
    .collection(COLLECTION)
    .doc(id)
    .set({
      ...data,
      updatedAt: Timestamp.now(),
    }, {
      merge: true
    });
};

export const deleteMenuItem = async (id: string) => {
  await db
    .collection(COLLECTION)
    .doc(id)
    .delete();
}