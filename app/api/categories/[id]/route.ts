import { requireAdmin } from "@/lib/api-auth";
import { deleteFallbackCategory, updateFallbackCategory } from "@/lib/fallback-store";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  world: z.enum(["FURNITURE", "INTERIOR"]).optional()
});

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const category = await prisma.category.update({ where: { id: params.id }, data: parsed.data });
    return NextResponse.json(category, { status: 200 });
  } catch {
    const category = updateFallbackCategory(params.id, parsed.data);
    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });
    return NextResponse.json(category, { status: 200 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  try {
    await prisma.category.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    const deleted = deleteFallbackCategory(params.id);
    if (!deleted) return NextResponse.json({ error: "Category not found" }, { status: 404 });
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}
