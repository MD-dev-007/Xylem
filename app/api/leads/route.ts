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

async function enrichLeadsWithProducts<T extends { productId: string | null }>(leads: T[]) {
  const productIds = [...new Set(leads.map((lead) => lead.productId).filter(Boolean))] as string[];

  if (productIds.length === 0) {
    return leads.map((lead) => ({ ...lead, product: null }));
  }

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, slug: true, price: true, photos: true }
  });

  const productById = new Map(products.map((product) => [product.id, product]));

  return leads.map((lead) => ({
    ...lead,
    product: lead.productId ? productById.get(lead.productId) ?? null : null
  }));
}

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
    const enriched = await enrichLeadsWithProducts(leads);
    return NextResponse.json(enriched, { status: 200 });
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

    let productName: string | null = null;
    if (lead.productId) {
      const product = await prisma.product.findUnique({
        where: { id: lead.productId },
        select: { name: true }
      });
      productName = product?.name ?? null;
    }

    if (resend) {
      await resend.emails.send({
        from: "XYLEM <onboarding@resend.dev>",
        to: ["admin@xylem.com"],
        subject: `New ${lead.type} lead from ${lead.name}`,
        html: `<p>Phone: ${lead.phone}</p><p>Email: ${lead.email ?? "-"}</p>${
          productName ? `<p>Product: ${productName}</p>` : ""
        }<p>Message: ${lead.message ?? "-"}</p>`
      });
    }

    const [enriched] = await enrichLeadsWithProducts([lead]);
    return NextResponse.json(enriched, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
