export type MenuCategory = {
  id: string;
  name: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type MenuCategoryPreview = Omit<MenuCategory, 'createdAt' | 'updatedAt'>;

export type MenuCategoryPayload = Omit<MenuCategoryPreview, 'id'>;