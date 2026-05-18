import type { LeadType, World } from "@prisma/client";

export type AppProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  world: World;
  image: string;
  gallery: string[];
  price: number;
  discount: number;
  colors: string[];
  sizes: string[];
  inStock: boolean;
  featured: boolean;
  relatedIds: string[];
  createdAt: string;
};

export type AppProject = {
  id: string;
  title: string;
  slug: string;
  style: string;
  beforePhoto: string;
  afterPhoto: string;
  description: string;
  featured: boolean;
};

export type AppCategory = {
  id: string;
  name: string;
  slug: string;
  world: World;
};

export const mockProducts: AppProduct[] = [
  {
    id: "p1",
    name: "Aster Lounge Sofa",
    slug: "aster-lounge-sofa",
    category: "Sofas",
    categorySlug: "sofas",
    world: "FURNITURE",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200"
    ],
    price: 92000,
    discount: 20,
    colors: ["#6a4e3a", "#c9a84c", "#ffffff"],
    sizes: ["M", "L"],
    inStock: true,
    featured: true,
    relatedIds: ["p2", "p3", "p6", "p9"],
    createdAt: "2026-03-28"
  },
  {
    id: "p2",
    name: "Nova Accent Chair",
    slug: "nova-accent-chair",
    category: "Chairs",
    categorySlug: "chairs",
    world: "FURNITURE",
    image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200",
      "https://images.unsplash.com/photo-1578898887932-dce23a595ad4?w=1200"
    ],
    price: 28000,
    discount: 0,
    colors: ["#d4af37", "#111827"],
    sizes: ["S", "M"],
    inStock: true,
    featured: true,
    relatedIds: ["p1", "p9", "p11", "p5"],
    createdAt: "2026-01-18"
  },
  {
    id: "p3",
    name: "Elmwood Dining Table",
    slug: "elmwood-dining-table",
    category: "Dining",
    categorySlug: "dining",
    world: "FURNITURE",
    image: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=1200",
      "https://images.unsplash.com/photo-1582582494700-07f3f2b22f26?w=1200"
    ],
    price: 68000,
    discount: 15,
    colors: ["#7d5a3a", "#f5f0e8"],
    sizes: ["L", "XL"],
    inStock: true,
    featured: true,
    relatedIds: ["p1", "p5", "p7", "p12"],
    createdAt: "2026-02-10"
  },
  {
    id: "p4",
    name: "Lumen Bed Frame",
    slug: "lumen-bed-frame",
    category: "Beds",
    categorySlug: "beds",
    world: "FURNITURE",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200",
    gallery: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200"],
    price: 78000,
    discount: 10,
    colors: ["#3f3f46"],
    sizes: ["XL"],
    inStock: false,
    featured: false,
    relatedIds: ["p8", "p10", "p12", "p3"],
    createdAt: "2025-12-22"
  },
  {
    id: "p5",
    name: "Cove Coffee Table",
    slug: "cove-coffee-table",
    category: "Tables",
    categorySlug: "tables",
    world: "FURNITURE",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200",
    gallery: ["https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200"],
    price: 22000,
    discount: 0,
    colors: ["#8b7355"],
    sizes: ["S", "M"],
    inStock: true,
    featured: false,
    relatedIds: ["p2", "p3", "p7", "p10"],
    createdAt: "2026-03-02"
  },
  {
    id: "p6",
    name: "Harbor TV Console",
    slug: "harbor-tv-console",
    category: "Storage",
    categorySlug: "storage",
    world: "FURNITURE",
    image: "https://images.unsplash.com/photo-1616594039964-3f7d8a229f28?w=1200",
    gallery: ["https://images.unsplash.com/photo-1616594039964-3f7d8a229f28?w=1200"],
    price: 41000,
    discount: 18,
    colors: ["#4b5563", "#ffffff"],
    sizes: ["L"],
    inStock: true,
    featured: true,
    relatedIds: ["p1", "p8", "p12", "p10"],
    createdAt: "2026-01-07"
  },
  {
    id: "p7",
    name: "Mira Console Table",
    slug: "mira-console-table",
    category: "Tables",
    categorySlug: "tables",
    world: "FURNITURE",
    image: "https://images.unsplash.com/photo-1519710884006-5f2c1e6f6ad0?w=1200",
    gallery: ["https://images.unsplash.com/photo-1519710884006-5f2c1e6f6ad0?w=1200"],
    price: 26000,
    discount: 0,
    colors: ["#b08968"],
    sizes: ["M"],
    inStock: true,
    featured: false,
    relatedIds: ["p5", "p10", "p3", "p11"],
    createdAt: "2026-04-04"
  },
  {
    id: "p8",
    name: "Orion Sideboard",
    slug: "orion-sideboard",
    category: "Storage",
    categorySlug: "storage",
    world: "FURNITURE",
    image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=1200",
    gallery: ["https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=1200"],
    price: 54000,
    discount: 12,
    colors: ["#2f3e46"],
    sizes: ["L"],
    inStock: false,
    featured: false,
    relatedIds: ["p6", "p12", "p4", "p10"],
    createdAt: "2026-02-21"
  },
  {
    id: "p9",
    name: "Vento Armchair",
    slug: "vento-armchair",
    category: "Chairs",
    categorySlug: "chairs",
    world: "FURNITURE",
    image: "https://images.unsplash.com/photo-1579656592043-a20e25a4aa4b?w=1200",
    gallery: ["https://images.unsplash.com/photo-1579656592043-a20e25a4aa4b?w=1200"],
    price: 32000,
    discount: 8,
    colors: ["#6b7280"],
    sizes: ["M"],
    inStock: true,
    featured: true,
    relatedIds: ["p2", "p11", "p1", "p5"],
    createdAt: "2026-03-12"
  },
  {
    id: "p10",
    name: "Sable Work Desk",
    slug: "sable-work-desk",
    category: "Office",
    categorySlug: "office",
    world: "FURNITURE",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200",
    gallery: ["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200"],
    price: 36000,
    discount: 0,
    colors: ["#92400e"],
    sizes: ["L"],
    inStock: true,
    featured: false,
    relatedIds: ["p7", "p8", "p5", "p6"],
    createdAt: "2025-11-14"
  },
  {
    id: "p11",
    name: "Aurelia Bar Stool",
    slug: "aurelia-bar-stool",
    category: "Chairs",
    categorySlug: "chairs",
    world: "FURNITURE",
    image: "https://images.unsplash.com/photo-1578898887932-dce23a595ad4?w=1200",
    gallery: ["https://images.unsplash.com/photo-1578898887932-dce23a595ad4?w=1200"],
    price: 14500,
    discount: 5,
    colors: ["#d4af37"],
    sizes: ["S"],
    inStock: true,
    featured: false,
    relatedIds: ["p2", "p9", "p5", "p1"],
    createdAt: "2026-03-30"
  },
  {
    id: "p12",
    name: "Drift Modular Shelf",
    slug: "drift-modular-shelf",
    category: "Storage",
    categorySlug: "storage",
    world: "FURNITURE",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200",
    gallery: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200"],
    price: 47000,
    discount: 22,
    colors: ["#1f2937"],
    sizes: ["XL"],
    inStock: true,
    featured: true,
    relatedIds: ["p6", "p8", "p3", "p4"],
    createdAt: "2026-04-08"
  }
];

export const mockProjects: AppProject[] = [
  {
    id: "i1",
    title: "Serene Urban Loft",
    slug: "serene-urban-loft",
    style: "Modern",
    beforePhoto: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1200",
    afterPhoto: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200",
    description: "A constrained city loft transformed with layered lighting and oak textures.",
    featured: true
  },
  {
    id: "i2",
    title: "Heritage Family Living",
    slug: "heritage-family-living",
    style: "Classic",
    beforePhoto: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200",
    afterPhoto: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=1200",
    description: "Traditional detailing and modern ergonomics for multigenerational comfort.",
    featured: true
  },
  {
    id: "i3",
    title: "Zen Minimal Studio",
    slug: "zen-minimal-studio",
    style: "Minimalist",
    beforePhoto: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200",
    afterPhoto: "https://images.unsplash.com/photo-1616594039964-3f7d8a229f28?w=1200",
    description: "A minimalist scheme with hidden storage and tactile natural finishes.",
    featured: false
  },
  {
    id: "i4",
    title: "Contemporary Villa Retreat",
    slug: "contemporary-villa-retreat",
    style: "Contemporary",
    beforePhoto: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200",
    afterPhoto: "https://images.unsplash.com/photo-1617104551722-3b2d513664f7?w=1200",
    description: "Open-plan contemporary villa with dramatic focal lighting and stone textures.",
    featured: true
  },
  {
    id: "i5",
    title: "Modern Executive Suite",
    slug: "modern-executive-suite",
    style: "Modern",
    beforePhoto: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200",
    afterPhoto: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=1200",
    description: "A compact executive suite reimagined with clean geometry and warmth.",
    featured: false
  }
];

export const mockLeadTypes: LeadType[] = ["PRODUCT_ENQUIRY", "CONSULTATION"];

export const mockCategories: AppCategory[] = [
  { id: "cat-sofas", name: "Sofas", slug: "sofas", world: "FURNITURE" },
  { id: "cat-chairs", name: "Chairs", slug: "chairs", world: "FURNITURE" },
  { id: "cat-dining", name: "Dining", slug: "dining", world: "FURNITURE" },
  { id: "cat-storage", name: "Storage", slug: "storage", world: "FURNITURE" },
  { id: "cat-tables", name: "Tables", slug: "tables", world: "FURNITURE" },
  { id: "cat-office", name: "Office", slug: "office", world: "FURNITURE" }
];
