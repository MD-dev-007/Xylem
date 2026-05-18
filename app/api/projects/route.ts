import { requireAdmin } from "@/lib/api-auth";
import { mockProjects } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  style: z.string().min(2),
  beforePhoto: z.string().url(),
  afterPhoto: z.string().url(),
  description: z.string().min(2),
  featured: z.boolean().default(false)
});

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const projects = await prisma.project.findMany({ orderBy: { featured: "desc" } });
    return NextResponse.json(projects, { status: 200 });
  } catch {
    return NextResponse.json(mockProjects, { status: 200 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const parsed = projectSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const project = await prisma.project.create({ data: parsed.data });
    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
