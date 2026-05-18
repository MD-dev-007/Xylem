import { requireAdmin } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  style: z.string().min(2).optional(),
  beforePhoto: z.string().url().optional(),
  afterPhoto: z.string().url().optional(),
  description: z.string().min(2).optional(),
  featured: z.boolean().optional()
});

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  try {
    const parsed = updateSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const project = await prisma.project.update({ where: { id: params.id }, data: parsed.data });
    return NextResponse.json(project, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  try {
    await prisma.project.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
