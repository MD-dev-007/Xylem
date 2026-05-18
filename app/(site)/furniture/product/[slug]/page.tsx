"use client";

import { ProductGallery } from "@/components/furniture/ProductGallery";
import { ProductCard } from "@/components/furniture/ProductCard";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { Heart, Star } from "lucide-react";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

type DetailProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
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

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const { push } = useToast();
  const [product, setProduct] = useState<DetailProduct | null>(null);
  const [allProducts, setAllProducts] = useState<DetailProduct[]>([]);
  const [loadingProduct, setLoadingProduct] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoadingProduct(false);
      setProduct(null);
      return;
    }

    setLoadingProduct(true);
    fetch(`/api/public/products/${slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setProduct(data))
      .catch(() => setProduct(null))
      .finally(() => setLoadingProduct(false));

    fetch("/api/public/products")
      .then((res) => res.json())
      .then(setAllProducts)
      .catch(() => setAllProducts([]));
  }, [slug]);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (loadingProduct) {
    return <main className="px-6 py-16 text-primary">Loading product...</main>;
  }

  if (!product) {
    return <main className="px-6 py-16 text-primary">Product not found.</main>;
  }

  const discounted = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price;
  const related = allProducts.filter((item) => product.relatedIds.includes(item.id)).slice(0, 4);

  const handleWishlist = () => {
    const key = "xylem:wishlist";
    const current = JSON.parse(localStorage.getItem(key) ?? "[]") as string[];
    let next: string[];
    if (current.includes(product.id)) {
      next = current.filter((item) => item !== product.id);
      setWishlisted(false);
    } else {
      next = [...current, product.id];
      setWishlisted(true);
    }
    localStorage.setItem(key, JSON.stringify(next));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedColor || !selectedSize) {
      push({ title: "Select color and size", description: "Both fields are required before enquiry." });
      return;
    }

    const formData = new FormData(event.currentTarget);
    setSubmitting(true);
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        message: formData.get("message"),
        type: "PRODUCT_ENQUIRY",
        productId: product.id
      })
    });
    setSubmitting(false);

    if (!response.ok) {
      push({ title: "Failed to submit", description: "Please try again in a moment." });
      return;
    }

    push({ title: "Enquiry sent", description: "Our team will contact you shortly." });
    setIsDialogOpen(false);
    event.currentTarget.reset();
  };

  return (
    <main className="bg-surface pb-14 pt-8">
      <section className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 md:px-6">
        <ProductGallery images={product.gallery} productName={product.name} />

        <div className="space-y-5">
          <p className="text-sm text-primary/60">Home / Furniture / {product.category}</p>
          <h1 className="text-3xl font-light text-primary md:text-4xl">{product.name}</h1>
          <div className="flex items-center gap-1 text-accent">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} size={16} className={index < 4 ? "fill-accent" : "fill-accent/30"} />
            ))}
            <span className="ml-2 text-sm text-primary/70">4.5</span>
          </div>
          <div className="flex items-center gap-3">
            {product.discount > 0 ? (
              <>
                <span className="text-lg text-primary/40 line-through">Rs {product.price}</span>
                <span className="text-2xl font-semibold text-accent">Rs {Math.round(discounted)}</span>
              </>
            ) : (
              <span className="text-2xl font-semibold text-accent">Rs {product.price}</span>
            )}
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-primary">Color</p>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`h-8 w-8 rounded-full border-2 ${
                    selectedColor === color ? "border-primary" : "border-black/20"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-primary">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-full border px-4 py-1.5 text-sm ${
                    selectedSize === size
                      ? "border-primary bg-primary text-white"
                      : "border-primary/25 text-primary"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-3">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-primary disabled:opacity-50"
                  disabled={!product.inStock}
                >
                  Send Enquiry
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle className="mb-4 text-xl font-semibold text-primary">Send Enquiry</DialogTitle>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input name="productId" defaultValue={product.id} type="hidden" />
                  <input name="name" required placeholder="Name*" className="h-11 w-full rounded-md border px-3" />
                  <input name="phone" required placeholder="Phone*" className="h-11 w-full rounded-md border px-3" />
                  <input name="email" placeholder="Email" className="h-11 w-full rounded-md border px-3" />
                  <textarea name="message" placeholder="Message" rows={4} className="w-full rounded-md border p-3" />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-md bg-primary py-3 text-sm font-semibold text-white"
                  >
                    {submitting ? "Submitting..." : "Submit Enquiry"}
                  </button>
                </form>
              </DialogContent>
            </Dialog>
            <button
              type="button"
              onClick={handleWishlist}
              className="inline-flex items-center gap-2 rounded-lg border border-primary/20 px-5 py-3 text-sm text-primary"
            >
              <Heart className={wishlisted ? "fill-red-500 text-red-500" : ""} size={17} />
              Add to Wishlist
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-7xl px-4 md:px-6">
        <h2 className="mb-5 text-2xl font-light text-primary">Related Products</h2>
        <div className="flex gap-5 overflow-x-auto pb-2">
          {related.map((item) => (
            <div key={item.id} className="min-w-[280px] max-w-[280px]">
              <ProductCard
                product={{
                  id: item.id,
                  name: item.name,
                  slug: item.slug,
                  category: item.categorySlug,
                  image: item.image,
                  price: item.price,
                  discount: item.discount
                }}
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
