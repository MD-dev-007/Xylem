import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "CLOSED"])
});

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const parsed = updateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const lead = await prisma.lead.update({
      where: { id: params.id },
      data: { status: parsed.data.status }
    });
    return NextResponse.json(lead, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Lead update failed" }, { status: 500 });
  }
}
