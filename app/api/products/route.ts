import { requireAdmin } from "@/lib/api-auth";
import { addFallbackProduct, getFallbackProducts } from "@/lib/fallback-store";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  categoryId: z.string().min(2),
  description: z.string().min(2),
  photos: z.array(z.string()).min(1),
  price: z.number().positive(),
  discount: z.number().min(0).default(0),
  colors: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false),
  relatedIds: z.array(z.string()).default([])
});

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(products, { status: 200 });
  } catch {
    return NextResponse.json(getFallbackProducts(), { status: 200 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const parsed = productSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const product = await prisma.product.create({ data: parsed.data });
    return NextResponse.json(product, { status: 201 });
  } catch {
    const fallbackProduct = addFallbackProduct(parsed.data);
    return NextResponse.json(fallbackProduct, { status: 201 });
  }
}
