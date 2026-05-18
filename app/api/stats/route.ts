import { mockProducts, mockProjects } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const [products, leadsToday, projects, pending] = await Promise.all([
      prisma.product.count(),
      prisma.lead.count({
        where: {
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        }
      }),
      prisma.project.count(),
      prisma.lead.count({ where: { status: "NEW" } })
    ]);

    return NextResponse.json(
      {
        totalProducts: products,
        leadsToday,
        portfolioProjects: projects,
        pendingLeads: pending
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        totalProducts: mockProducts.length,
        leadsToday: 0,
        portfolioProjects: mockProjects.length,
        pendingLeads: 0
      },
      { status: 200 }
    );
  }
}
