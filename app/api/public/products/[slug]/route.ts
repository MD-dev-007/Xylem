import { getFallbackCategories, getFallbackProducts } from "@/lib/fallback-store";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: { category: true }
    });

    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(
      {
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
      },
      { status: 200 }
    );
  } catch {
    const fallbackProduct = getFallbackProducts().find((item) => item.slug === params.slug);
    if (!fallbackProduct) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const fallbackCategory = getFallbackCategories().find((item) => item.id === fallbackProduct.categoryId);
    return NextResponse.json(
      {
        id: fallbackProduct.id,
        name: fallbackProduct.name,
        slug: fallbackProduct.slug,
        category: fallbackCategory?.name ?? "Uncategorized",
        categorySlug: fallbackCategory?.slug ?? "uncategorized",
        image: fallbackProduct.photos[0] ?? "",
        gallery: fallbackProduct.photos,
        price: fallbackProduct.price,
        discount: fallbackProduct.discount,
        colors: fallbackProduct.colors,
        sizes: fallbackProduct.sizes,
        inStock: fallbackProduct.inStock,
        featured: fallbackProduct.featured,
        relatedIds: fallbackProduct.relatedIds,
        createdAt: fallbackProduct.createdAt
      },
      { status: 200 }
    );
  }
}
