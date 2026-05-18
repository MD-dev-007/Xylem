"use client";

import { CldUploadWidget } from "@/lib/cloudinary";
import { FormEvent, useState } from "react";

type ProductFormProps = {
  product?: {
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
  categories: { id: string; name: string; world: "FURNITURE" | "INTERIOR" }[];
  onSaved?: () => void;
};

export function ProductForm({ product, categories, onSaved }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [photoUrl, setPhotoUrl] = useState(product?.photos?.[0] ?? "");
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    if (!photoUrl) {
      setFormError("Add an image URL or upload a product image before saving.");
      return;
    }
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name")),
      slug: String(formData.get("slug")),
      categoryId: String(formData.get("categoryId")),
      description: String(formData.get("description")),
      photos: photoUrl ? [photoUrl] : [],
      price: Number(formData.get("price")),
      discount: Number(formData.get("discount") ?? 0),
      colors: ["#C9A84C"],
      sizes: ["M"],
      inStock: formData.get("inStock") === "on",
      featured: formData.get("featured") === "on",
      relatedIds: []
    };

    await fetch(`/api/products${product ? `/${product.id}` : ""}`, {
      method: product ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setLoading(false);
    onSaved?.();
  };

  const handleLocalImageUpload = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setPhotoUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border border-primary/10 bg-white p-3">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-primary/60">Basic details</p>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-primary/70">Product Name</label>
            <input
              name="name"
              placeholder="e.g. Aster Lounge Sofa"
              defaultValue={product?.name}
              className="h-11 w-full rounded-lg border border-primary/20 bg-white px-3 text-primary outline-none ring-accent/40 transition focus:ring-2"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-primary/70">Slug</label>
            <input
              name="slug"
              placeholder="aster-lounge-sofa"
              defaultValue={product?.slug}
              className="h-11 w-full rounded-lg border border-primary/20 bg-white px-3 text-primary outline-none ring-accent/40 transition focus:ring-2"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-primary/70">Category</label>
            <select
              name="categoryId"
              defaultValue={product?.categoryId}
              className="h-11 w-full rounded-lg border border-primary/20 bg-white px-3 text-primary outline-none ring-accent/40 transition focus:ring-2"
              required
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.world})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {!categories.length ? (
        <p className="text-xs text-red-600">No categories found. Create categories first, then add products.</p>
      ) : null}

      <div className="rounded-lg border border-primary/10 bg-white p-3">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-primary/60">Description & image</p>
        <textarea
          name="description"
          placeholder="Describe the product in 1-3 lines"
          rows={4}
          defaultValue={product?.description}
          className="w-full rounded-lg border border-primary/20 bg-white p-3 text-primary outline-none ring-accent/40 transition focus:ring-2"
          required
        />
        <div className="mt-3 space-y-2">
          <input
            name="photoDisplay"
            placeholder="Paste image URL or use Cloudinary upload"
            value={photoUrl}
            onChange={(event) => setPhotoUrl(event.target.value)}
            className="h-11 w-full rounded-lg border border-primary/20 bg-white px-3 text-primary outline-none ring-accent/40 transition focus:ring-2"
          />
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-primary/70">Upload from system</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => handleLocalImageUpload(event.target.files?.[0] ?? null)}
              className="block w-full cursor-pointer rounded-md border border-primary/20 bg-white p-2 text-xs text-primary file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:text-white"
            />
          </label>
        </div>
        {photoUrl ? (
          <div className="mt-2 overflow-hidden rounded-lg border border-primary/15">
            <img src={photoUrl} alt="Product preview" className="h-36 w-full object-cover" />
          </div>
        ) : null}
        {cloudName ? (
          <CldUploadWidget
            uploadPreset="xylem_unsigned"
            options={{ folder: "xylem-products" }}
            onSuccess={(result) => {
              const secure = (result?.info as { secure_url?: string })?.secure_url;
              if (secure) setPhotoUrl(secure);
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-xs font-medium text-primary transition hover:bg-accent/20"
              >
                Upload Image with Cloudinary
              </button>
            )}
          </CldUploadWidget>
        ) : (
          <p className="text-xs text-primary/60">
            Upload widget is disabled. Add `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` in `.env` to enable direct uploads.
          </p>
        )}
      </div>
      <div className="rounded-lg border border-primary/10 bg-white p-3">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-primary/60">Pricing & status</p>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            name="price"
            type="number"
            placeholder="Price"
            defaultValue={product?.price}
            className="h-11 w-full rounded-lg border border-primary/20 bg-white px-3 text-primary outline-none ring-accent/40 transition focus:ring-2"
            required
          />
          <input
            name="discount"
            type="number"
            defaultValue={product?.discount}
            placeholder="Discount %"
            className="h-11 w-full rounded-lg border border-primary/20 bg-white px-3 text-primary outline-none ring-accent/40 transition focus:ring-2"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input name="inStock" type="checkbox" defaultChecked={product?.inStock ?? true} />
            In stock
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input name="featured" type="checkbox" defaultChecked={product?.featured ?? false} />
            Featured product
          </label>
        </div>
      </div>
      {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
      <button
        type="submit"
        disabled={loading || categories.length === 0}
        className="rounded-md bg-primary px-4 py-2 text-sm text-white disabled:opacity-40"
      >
        {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
}
