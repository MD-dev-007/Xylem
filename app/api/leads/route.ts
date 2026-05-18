import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const leadSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().optional(),
  type: z.enum(["PRODUCT_ENQUIRY", "CONSULTATION"]),
  productId: z.string().optional()
});

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(leads, { status: 200 });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email || null,
        message: parsed.data.message || null,
        type: parsed.data.type,
        productId: parsed.data.productId || null
      }
    });

    if (resend) {
      await resend.emails.send({
        from: "XYLEM <onboarding@resend.dev>",
        to: ["admin@xylem.com"],
        subject: `New ${lead.type} lead from ${lead.name}`,
        html: `<p>Phone: ${lead.phone}</p><p>Email: ${lead.email ?? "-"}</p><p>Message: ${lead.message ?? "-"}</p>`
      });
    }

    return NextResponse.json(lead, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
