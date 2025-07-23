import { MenuCategoryPreview } from "./menuCategories";

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export type MenuItemWithCategory = MenuItem & {
  category: Omit<MenuCategoryPreview, 'imageUrl'>;
}

export type MenuItemPreview = Omit<MenuItem, 'createdAt' | 'updatedAt'>;

export type MenuItemPreviewWithCategory = Omit<MenuItemPreview, 'categoryId'> & {
  category: Omit<MenuCategoryPreview, 'imageUrl'>;
}

export type MenuItemPayload = Omit<MenuItemPreview, 'id'>;

export type MenuItemQueryParams = {
  categoryId?: string;
}