"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type FilterSidebarProps = {
  categories: string[];
  colors: string[];
  sizes: string[];
};

function toTitle(value: string) {
  return value.replaceAll("-", " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

export function FilterSidebar({ categories, colors, sizes }: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const selectedCategories = useMemo(
    () => searchParams.getAll("category"),
    [searchParams]
  );
  const selectedColors = useMemo(() => searchParams.getAll("color"), [searchParams]);
  const selectedSizes = useMemo(() => searchParams.getAll("size"), [searchParams]);
  const stockOnly = searchParams.get("stock") === "1";
  const minPrice = Number(searchParams.get("min") ?? 0);
  const maxPrice = Number(searchParams.get("max") ?? 200000);

  const updateParams = (apply: (params: URLSearchParams) => void) => {
    const next = new URLSearchParams(searchParams.toString());
    apply(next);
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const toggleMultiValue = (key: string, value: string) => {
    updateParams((params) => {
      const current = params.getAll(key);
      params.delete(key);
      if (current.includes(value)) {
        current.filter((item) => item !== value).forEach((item) => params.append(key, item));
      } else {
        [...current, value].forEach((item) => params.append(key, item));
      }
    });
  };

  const clearFilters = () => {
    router.replace(pathname, { scroll: false });
  };

  const panelContent = (
    <div className="h-full overflow-y-auto bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Filters</h2>
        <button
          type="button"
          onClick={clearFilters}
          className="text-xs text-primary/70 underline underline-offset-2 hover:text-primary"
        >
          Clear all filters
        </button>
      </div>

      <div className="space-y-3">
        <details open className="rounded-lg border border-black/10 px-4 py-3">
          <summary className="cursor-pointer list-none text-sm font-medium text-primary">Category</summary>
          <div className="mt-3 space-y-2">
            {categories.map((category) => {
              const checked = selectedCategories.includes(category);
              return (
                <label key={category} className="flex items-center gap-2 text-sm text-primary/80">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleMultiValue("category", category)}
                    className="h-4 w-4 rounded border-black/30 text-primary focus:ring-primary"
                  />
                  {toTitle(category)}
                </label>
              );
            })}
          </div>
        </details>

        <details open className="rounded-lg border border-black/10 px-4 py-3">
          <summary className="cursor-pointer list-none text-sm font-medium text-primary">Color</summary>
          <div className="mt-3 flex flex-wrap gap-2">
            {colors.map((color) => {
              const checked = selectedColors.includes(color);
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => toggleMultiValue("color", color)}
                  title={toTitle(color)}
                  className={`h-5 w-5 rounded-full border ${
                    checked ? "ring-2 ring-primary ring-offset-2" : "border-black/20"
                  }`}
                  style={{ backgroundColor: color }}
                />
              );
            })}
          </div>
        </details>

        <details open className="rounded-lg border border-black/10 px-4 py-3">
          <summary className="cursor-pointer list-none text-sm font-medium text-primary">Size</summary>
          <div className="mt-3 flex flex-wrap gap-2">
            {sizes.map((size) => {
              const checked = selectedSizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleMultiValue("size", size)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    checked
                      ? "border-primary bg-primary text-white"
                      : "border-primary/25 bg-white text-primary"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </details>

        <details open className="rounded-lg border border-black/10 px-4 py-3">
          <summary className="cursor-pointer list-none text-sm font-medium text-primary">Price</summary>
          <div className="mt-3 space-y-4">
            <div className="relative">
              <input
                type="range"
                min={0}
                max={200000}
                value={minPrice}
                onChange={(event) => {
                  const nextMin = Math.min(Number(event.target.value), maxPrice - 5000);
                  updateParams((params) => {
                    params.set("min", String(nextMin));
                  });
                }}
                className="w-full accent-primary"
              />
              <input
                type="range"
                min={0}
                max={200000}
                value={maxPrice}
                onChange={(event) => {
                  const nextMax = Math.max(Number(event.target.value), minPrice + 5000);
                  updateParams((params) => {
                    params.set("max", String(nextMax));
                  });
                }}
                className="w-full accent-primary"
              />
            </div>
            <p className="text-xs text-primary/70">Rs {minPrice} - Rs {maxPrice}</p>
          </div>
        </details>

        <details open className="rounded-lg border border-black/10 px-4 py-3">
          <summary className="cursor-pointer list-none text-sm font-medium text-primary">Availability</summary>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-primary/80">In Stock only</span>
            <button
              type="button"
              onClick={() =>
                updateParams((params) => {
                  if (stockOnly) params.delete("stock");
                  else params.set("stock", "1");
                })
              }
              className={`relative h-6 w-11 rounded-full transition-colors ${
                stockOnly ? "bg-primary" : "bg-black/20"
              }`}
              aria-label="Toggle in stock only"
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  stockOnly ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </details>
      </div>
    </div>
  );

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-primary/30 px-3 py-2 text-sm text-primary md:hidden"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </SheetTrigger>
        <SheetContent>
          <div className="flex items-center justify-end p-3">
            <SheetClose asChild>
              <button type="button" aria-label="Close filters">
                <X size={18} />
              </button>
            </SheetClose>
          </div>
          {panelContent}
        </SheetContent>
      </Sheet>

      <aside className="sticky top-24 hidden h-[calc(100vh-7rem)] w-[260px] shrink-0 md:block">
        {panelContent}
      </aside>

    </>
  );
}
