import { requireAdmin } from "@/lib/api-auth";
import { addFallbackCategory, getFallbackCategories } from "@/lib/fallback-store";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  world: z.enum(["FURNITURE", "INTERIOR"])
});

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(categories, { status: 200 });
  } catch {
    return NextResponse.json(getFallbackCategories(), { status: 200 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const parsed = categorySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const category = await prisma.category.create({ data: parsed.data });
    return NextResponse.json(category, { status: 201 });
  } catch {
    const fallbackCategory = addFallbackCategory(parsed.data);
    return NextResponse.json(fallbackCategory, { status: 201 });
  }
}
