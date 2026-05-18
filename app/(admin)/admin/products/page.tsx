"use client";

import { ProductForm } from "@/components/admin/ProductForm";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useEffect, useState } from "react";

type ProductRow = {
  id: string;
  name: string;
  categoryId: string;
  description?: string;
  price: number;
  discount?: number;
  inStock: boolean;
  featured?: boolean;
  slug: string;
  photos?: string[];
};

type Category = {
  id: string;
  name: string;
  slug: string;
  world: "FURNITURE" | "INTERIOR";
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [openSheet, setOpenSheet] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [categoryWorld, setCategoryWorld] = useState<"FURNITURE" | "INTERIOR">("FURNITURE");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  const toSlug = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const load = () => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => undefined);
  };

  const loadCategories = () => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => undefined);
  };

  useEffect(() => {
    load();
    loadCategories();
  }, []);

  const bulkDelete = async () => {
    if (!selected.length) return;
    const ok = window.confirm(`Delete ${selected.length} selected product(s)?`);
    if (!ok) return;
    await Promise.all(selected.map((id) => fetch(`/api/products/${id}`, { method: "DELETE" })));
    setSelected([]);
    load();
  };

  const resetCategoryForm = () => {
    setCategoryName("");
    setCategorySlug("");
    setCategoryWorld("FURNITURE");
    setEditingCategoryId(null);
  };

  const submitCategory = async () => {
    const finalSlug = toSlug(categorySlug || categoryName);
    if (!categoryName.trim() || !finalSlug) return;

    setCategoryLoading(true);
    await fetch(`/api/categories${editingCategoryId ? `/${editingCategoryId}` : ""}`, {
      method: editingCategoryId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: categoryName.trim(),
        slug: finalSlug,
        world: categoryWorld
      })
    });
    setCategoryLoading(false);
    resetCategoryForm();
    loadCategories();
  };

  const editCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setCategoryName(category.name);
    setCategorySlug(category.slug);
    setCategoryWorld(category.world);
  };

  const removeCategory = async (id: string) => {
    const ok = window.confirm("Delete this category? Products using this category may need reassignment.");
    if (!ok) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (editingCategoryId === id) resetCategoryForm();
    loadCategories();
  };

  return (
    <main className="min-h-screen bg-surface pb-8">
      <AdminHeader />
      <div className="px-4 md:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-light text-primary">Products</h1>
            <p className="text-sm text-primary/60">Manage products, categories, and inventory status.</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={bulkDelete}
              disabled={!selected.length}
              className="rounded-md border border-red-300 px-4 py-2 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-40"
            >
              Delete Selected ({selected.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setOpenSheet(true);
              }}
              className="rounded-md bg-primary px-4 py-2 text-sm text-white transition hover:bg-primary/90"
            >
              Add Product
            </button>
          </div>
        </div>

        <section className="mb-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-primary/10 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.12em] text-primary/60">Total Products</p>
            <p className="mt-1 text-2xl font-semibold text-primary">{products.length}</p>
          </div>
          <div className="rounded-xl border border-primary/10 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.12em] text-primary/60">Categories</p>
            <p className="mt-1 text-2xl font-semibold text-primary">{categories.length}</p>
          </div>
          <div className="rounded-xl border border-primary/10 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.12em] text-primary/60">Selected</p>
            <p className="mt-1 text-2xl font-semibold text-primary">{selected.length}</p>
          </div>
        </section>

        <section className="mb-6 rounded-xl border border-primary/10 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-medium text-primary">Category Management</h2>
              <p className="text-xs text-primary/60">Create and maintain product categories from one place.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowCategoryManager((prev) => !prev)}
              className="rounded-md border border-primary/20 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/5"
            >
              {showCategoryManager ? "Hide" : "Manage Categories"}
            </button>
          </div>

          {showCategoryManager ? (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-lg border border-primary/10 bg-surface p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-primary/60">
                  {editingCategoryId ? "Edit category" : "Add category"}
                </p>
                <div className="grid gap-2 md:grid-cols-2">
                  <input
                    value={categoryName}
                    onChange={(event) => {
                      const value = event.target.value;
                      setCategoryName(value);
                      if (!editingCategoryId) setCategorySlug(toSlug(value));
                    }}
                    placeholder="Category name"
                    className="h-10 rounded-md border border-primary/20 px-3 text-sm text-primary outline-none ring-accent/40 focus:ring-2"
                  />
                  <input
                    value={categorySlug}
                    onChange={(event) => setCategorySlug(toSlug(event.target.value))}
                    placeholder="category-slug"
                    className="h-10 rounded-md border border-primary/20 px-3 text-sm text-primary outline-none ring-accent/40 focus:ring-2"
                  />
                  <select
                    value={categoryWorld}
                    onChange={(event) => setCategoryWorld(event.target.value as "FURNITURE" | "INTERIOR")}
                    className="h-10 rounded-md border border-primary/20 px-3 text-sm text-primary outline-none ring-accent/40 focus:ring-2"
                  >
                    <option value="FURNITURE">FURNITURE</option>
                    <option value="INTERIOR">INTERIOR</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={submitCategory}
                      disabled={categoryLoading}
                      className="h-10 rounded-md bg-primary px-4 text-sm text-white transition hover:bg-primary/90 disabled:opacity-50"
                    >
                      {editingCategoryId ? "Update" : "Add"}
                    </button>
                    {editingCategoryId ? (
                      <button
                        type="button"
                        onClick={resetCategoryForm}
                        className="h-10 rounded-md border border-primary/20 px-4 text-sm text-primary transition hover:bg-primary/5"
                      >
                        Cancel
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-primary/10 bg-surface p-3">
                {categories.length ? (
                  categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between rounded-md border border-primary/10 bg-white p-3">
                      <div>
                        <p className="text-sm font-medium text-primary">{category.name}</p>
                        <p className="text-xs text-primary/60">
                          {category.slug} · {category.world}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => editCategory(category)}
                          className="rounded-md border border-primary/20 px-3 py-1 text-xs text-primary transition hover:bg-primary hover:text-white"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => removeCategory(category.id)}
                          className="rounded-md border border-red-300 px-3 py-1 text-xs text-red-600 transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-primary/60">No categories yet. Add your first category.</p>
                )}
              </div>
            </div>
          ) : null}
        </section>

        <div className="overflow-x-auto rounded-xl border border-primary/10 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-primary/5 text-primary">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={products.length > 0 && selected.length === products.length}
                    onChange={(event) =>
                      setSelected(event.target.checked ? products.map((item) => item.id) : [])
                    }
                  />
                </th>
                <th className="px-4 py-3">Photo</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-primary/10 transition hover:bg-primary/[0.03]">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(product.id)}
                      onChange={(event) =>
                        setSelected((prev) =>
                          event.target.checked ? [...prev, product.id] : prev.filter((id) => id !== product.id)
                        )
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    {product.photos?.[0] ? (
                      <img src={product.photos[0]} alt={product.name} className="h-10 w-10 rounded object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded bg-primary/10" />
                    )}
                  </td>
                  <td className="px-4 py-3">{product.name}</td>
                  <td className="px-4 py-3">{categories.find((item) => item.id === product.categoryId)?.name ?? "—"}</td>
                  <td className="px-4 py-3">Rs {product.price}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        product.inStock ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="rounded-md border border-primary/20 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary hover:text-white"
                      onClick={() => {
                        setEditing(product);
                        setOpenSheet(true);
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!products.length ? (
            <div className="border-t border-primary/10 p-6 text-center text-sm text-primary/60">
              No products yet. Click <span className="font-medium text-primary">Add Product</span> to create one.
            </div>
          ) : null}
        </div>

        {openSheet ? (
          <div className="fixed inset-0 z-[70] bg-black/35 backdrop-blur-[1px]">
            <div className="absolute inset-y-0 right-0 w-full max-w-md overflow-y-auto border-l border-primary/10 bg-surface p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-primary">{editing ? "Edit Product" : "New Product"}</h2>
                <button
                  type="button"
                  onClick={() => setOpenSheet(false)}
                  className="rounded-md border border-primary/15 bg-white px-3 py-1.5 text-sm text-primary/70 transition hover:text-primary"
                >
                  Close
                </button>
              </div>
              <ProductForm
                product={editing ?? undefined}
                categories={categories}
                onSaved={() => {
                  setOpenSheet(false);
                  load();
                  loadCategories();
                }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
