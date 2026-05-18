import { mockCategories, mockProducts } from "@/lib/mock-data";

export type FallbackProduct = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  photos: string[];
  price: number;
  discount: number;
  colors: string[];
  sizes: string[];
  inStock: boolean;
  featured: boolean;
  relatedIds: string[];
  createdAt: string;
};

export type FallbackCategory = {
  id: string;
  name: string;
  slug: string;
  world: "FURNITURE" | "INTERIOR";
};

const toFallbackProduct = (item: (typeof mockProducts)[number]): FallbackProduct => ({
  id: item.id,
  name: item.name,
  slug: item.slug,
  categoryId: `cat-${item.categorySlug}`,
  description: `${item.name} from our ${item.category} collection.`,
  photos: item.gallery?.length ? item.gallery : [item.image],
  price: item.price,
  discount: item.discount,
  colors: item.colors,
  sizes: item.sizes,
  inStock: item.inStock,
  featured: item.featured,
  relatedIds: item.relatedIds,
  createdAt: item.createdAt
});

let fallbackProducts: FallbackProduct[] = mockProducts.map(toFallbackProduct);
let fallbackCategories: FallbackCategory[] = [...mockCategories];

export const getFallbackProducts = () => fallbackProducts;

export const addFallbackProduct = (product: Omit<FallbackProduct, "id" | "createdAt">) => {
  const created = {
    id: `p-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...product
  };
  fallbackProducts = [created, ...fallbackProducts];
  return created;
};

export const updateFallbackProduct = (id: string, updates: Partial<FallbackProduct>) => {
  let updated: FallbackProduct | null = null;
  fallbackProducts = fallbackProducts.map((product) => {
    if (product.id !== id) return product;
    updated = { ...product, ...updates };
    return updated;
  });
  return updated;
};

export const deleteFallbackProduct = (id: string) => {
  const before = fallbackProducts.length;
  fallbackProducts = fallbackProducts.filter((product) => product.id !== id);
  return fallbackProducts.length < before;
};

export const getFallbackCategories = () => fallbackCategories;

export const addFallbackCategory = (category: Omit<FallbackCategory, "id">) => {
  const created = {
    id: `cat-${category.slug}`,
    ...category
  };
  fallbackCategories = [created, ...fallbackCategories.filter((item) => item.id !== created.id)];
  return created;
};

export const updateFallbackCategory = (id: string, updates: Partial<FallbackCategory>) => {
  let updated: FallbackCategory | null = null;
  fallbackCategories = fallbackCategories.map((category) => {
    if (category.id !== id) return category;
    updated = { ...category, ...updates };
    return updated;
  });
  return updated;
};

export const deleteFallbackCategory = (id: string) => {
  const before = fallbackCategories.length;
  fallbackCategories = fallbackCategories.filter((category) => category.id !== id);
  return fallbackCategories.length < before;
};
