import { requireAdmin } from "@/lib/api-auth";
import { deleteFallbackProduct, updateFallbackProduct } from "@/lib/fallback-store";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  categoryId: z.string().min(2).optional(),
  description: z.string().min(2).optional(),
  photos: z.array(z.string()).optional(),
  price: z.number().positive().optional(),
  discount: z.number().min(0).optional(),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  inStock: z.boolean().optional(),
  featured: z.boolean().optional(),
  relatedIds: z.array(z.string()).optional()
});

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const product = await prisma.product.update({ where: { id: params.id }, data: parsed.data });
    return NextResponse.json(product, { status: 200 });
  } catch {
    const product = updateFallbackProduct(params.id, parsed.data);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json(product, { status: 200 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    const deleted = deleteFallbackProduct(params.id);
    if (!deleted) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}
