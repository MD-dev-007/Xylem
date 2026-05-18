"use client";

import { FilterSidebar } from "@/components/furniture/FilterSidebar";
import { type FurnitureProduct, ProductCard } from "@/components/furniture/ProductCard";
import { motion } from "framer-motion";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

type ProductRecord = FurnitureProduct & {
  color: string;
  size: string;
  inStock: boolean;
  createdAt: string;
};

const gridMotion = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const pageSize = 6;

function FurniturePageContent() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const searchParams = useSearchParams();
  useEffect(() => {
    fetch("/api/public/products")
      .then((res) => res.json())
      .then((items: any[]) =>
        setProducts(
          items.map((item) => ({
            id: item.id,
            name: item.name,
            slug: item.slug,
            category: item.categorySlug,
            image: item.image,
            price: item.price,
            discount: item.discount,
            color: item.colors?.[0] ?? "#000000",
            size: item.sizes?.[0] ?? "M",
            inStock: item.inStock,
            createdAt: item.createdAt
          }))
        )
      )
      .catch(() => setProducts([]));
  }, []);

  const pathname = usePathname();
  const router = useRouter();
  const categoryFilters = searchParams.getAll("category");
  const colorFilters = searchParams.getAll("color");
  const sizeFilters = searchParams.getAll("size");
  const stockOnly = searchParams.get("stock") === "1";
  const minPrice = Number(searchParams.get("min") ?? 0);
  const maxPrice = Number(searchParams.get("max") ?? 200000);
  const sortBy = searchParams.get("sort") ?? "featured";
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set(key, value);
    if (key !== "page") next.set("page", "1");
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const filteredProducts = useMemo(
    () =>
      products
    .filter((item) => (categoryFilters.length ? categoryFilters.includes(item.category) : true))
    .filter((item) => (colorFilters.length ? colorFilters.includes(item.color) : true))
    .filter((item) => (sizeFilters.length ? sizeFilters.includes(item.size) : true))
    .filter((item) => (stockOnly ? item.inStock : true))
    .filter((item) => item.price >= minPrice && item.price <= maxPrice),
    [products, categoryFilters, colorFilters, sizeFilters, stockOnly, minPrice, maxPrice]
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return Number(b.discount > 0 || b.inStock) - Number(a.discount > 0 || a.inStock);
  });

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const categories = Array.from(new Set(products.map((item) => item.category)));
  const colors = Array.from(new Set(products.map((item) => item.color)));
  const sizes = Array.from(new Set(products.map((item) => item.size)));

  return (
    <main className="bg-surface pb-16">
      <section className="relative h-[280px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=2000"
          alt="Furniture world banner"
          fill
          className="object-cover blur-[2px]"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-light tracking-[0.08em] text-white md:text-5xl">Furniture World</h1>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-7xl px-4 md:px-6">
        <div className="mb-4 md:hidden">
          <FilterSidebar categories={categories} colors={colors} sizes={sizes} />
        </div>

        <div className="grid gap-8 md:grid-cols-[260px_minmax(0,1fr)_20px]">
          <FilterSidebar categories={categories} colors={colors} sizes={sizes} />

          <div className="space-y-6">
            <div className="flex flex-col gap-3 rounded-lg bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-primary/80">Showing {sortedProducts.length} products</p>
              <select
                value={sortBy}
                onChange={(event) => updateParam("sort", event.target.value)}
                className="h-10 rounded-md border border-primary/20 bg-white px-3 text-sm text-primary"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price Low-High</option>
                <option value="price-desc">Price High-Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            <motion.div
              variants={gridMotion}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => updateParam("page", String(Math.max(1, currentPage - 1)))}
                disabled={currentPage === 1}
                className="rounded-md border border-primary/20 px-3 py-2 text-sm text-primary disabled:opacity-40"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }).map((_, index) => {
                const number = index + 1;
                return (
                  <button
                    key={number}
                    type="button"
                    onClick={() => updateParam("page", String(number))}
                    className={`h-9 w-9 rounded-md text-sm ${
                      number === currentPage ? "bg-primary text-white" : "border border-primary/20 text-primary"
                    }`}
                  >
                    {number}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => updateParam("page", String(Math.min(totalPages, currentPage + 1)))}
                disabled={currentPage === totalPages}
                className="rounded-md border border-primary/20 px-3 py-2 text-sm text-primary disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>

          <div className="hidden md:block" />
        </div>
      </section>
    </main>
  );
}

export default function FurniturePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[50vh] bg-surface pb-16 pt-24 text-center text-sm text-primary/70">Loading…</main>
      }
    >
      <FurniturePageContent />
    </Suspense>
  );
}
