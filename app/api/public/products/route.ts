import { getFallbackCategories, getFallbackProducts } from "@/lib/fallback-store";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type PublicProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  image: string;
  gallery: string[];
  price: number;
  discount: number;
  colors: string[];
  sizes: string[];
  inStock: boolean;
  featured: boolean;
  relatedIds: string[];
  createdAt: string;
};

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" }
    });

    const mapped: PublicProduct[] = products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: product.category.name,
      categorySlug: product.category.slug,
      image: product.photos[0] ?? "",
      gallery: product.photos,
      price: product.price,
      discount: product.discount,
      colors: product.colors,
      sizes: product.sizes,
      inStock: product.inStock,
      featured: product.featured,
      relatedIds: product.relatedIds,
      createdAt: product.createdAt.toISOString()
    }));

    return NextResponse.json(mapped, { status: 200 });
  } catch {
    const fallbackProducts = getFallbackProducts();
    const fallbackCategories = getFallbackCategories();

    const mapped: PublicProduct[] = fallbackProducts.map((product) => {
      const category = fallbackCategories.find((item) => item.id === product.categoryId);
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: category?.name ?? "Uncategorized",
        categorySlug: category?.slug ?? "uncategorized",
        image: product.photos[0] ?? "",
        gallery: product.photos,
        price: product.price,
        discount: product.discount,
        colors: product.colors,
        sizes: product.sizes,
        inStock: product.inStock,
        featured: product.featured,
        relatedIds: product.relatedIds,
        createdAt: product.createdAt
      };
    });

    return NextResponse.json(mapped, { status: 200 });
  }
}
