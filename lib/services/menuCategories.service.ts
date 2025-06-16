import { Timestamp } from "firebase-admin/firestore";

import { db } from "../firebase-admin";

import {
  MenuCategory,
  MenuCategoryPayload,
  MenuCategoryPreview
} from "@/types/menuCategories";

const COLLECTION = 'menu_categories';

export const createMenuCategory = async (data: MenuCategoryPayload) => {
  const doc = await db
    .collection(COLLECTION)
    .add({
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

  return { id: doc.id };
}

export const getMenuCategories = async () => {
  const doc = await db
    .collection(COLLECTION)
    .select('name', 'imageUrl')
    .get();

  if (doc.empty) return [];

  return doc.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as MenuCategoryPreview[];
}

export const getMenuCategory = async (id: string) => {
  const doc = await db
    .collection(COLLECTION)
    .doc(id)
    .get();

  if (!doc.exists) return null;

  return {
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data()?.createdAt?.toDate(),
    updatedAt: doc.data()?.updatedAt?.toDate(),
  } as MenuCategory;
}

export const updateMenuCategory = async (id: string, data: Partial<MenuCategoryPayload>) => {
  await db
    .collection(COLLECTION)
    .doc(id)
    .set({
      ...data,
      updatedAt: Timestamp.now(),
    }, {
      merge: true
    });
}

export const deleteMenuCategory = async (id: string) => {
  await db
    .collection(COLLECTION)
    .doc(id)
    .delete();
}