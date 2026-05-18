import type { MetadataRoute } from "next";
import { mockProducts, mockProjects } from "@/lib/mock-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const staticRoutes = ["", "/furniture", "/interior", "/about", "/contact"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date()
  }));

  const productRoutes = mockProducts.map((product) => ({
    url: `${baseUrl}/furniture/product/${product.slug}`,
    lastModified: new Date()
  }));

  const projectRoutes = mockProjects.map((project) => ({
    url: `${baseUrl}/interior/projects/${project.slug}`,
    lastModified: new Date()
  }));

  return [...staticRoutes, ...productRoutes, ...projectRoutes];
}
