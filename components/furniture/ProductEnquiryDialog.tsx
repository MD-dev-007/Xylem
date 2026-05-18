"use client";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { FormEvent, ReactNode, useState } from "react";

type EnquiryProduct = {
  id: string;
  name: string;
  slug: string;
  colors?: string[];
  sizes?: string[];
  inStock?: boolean;
};

type ProductEnquiryDialogProps = {
  product: EnquiryProduct;
  trigger: ReactNode;
  requireColorSize?: boolean;
  /** When false, use selectedColor/selectedSize from the parent (e.g. product detail page). */
  showOptionPickers?: boolean;
  selectedColor?: string;
  selectedSize?: string;
};

export function ProductEnquiryDialog({
  product,
  trigger,
  requireColorSize = false,
  showOptionPickers = true,
  selectedColor: externalColor = "",
  selectedSize: externalSize = ""
}: ProductEnquiryDialogProps) {
  const { push } = useToast();
  const [open, setOpen] = useState(false);
  const [internalColor, setInternalColor] = useState("");
  const [internalSize, setInternalSize] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedColor = showOptionPickers ? internalColor : externalColor;
  const selectedSize = showOptionPickers ? internalSize : externalSize;

  const hasColors = (product.colors?.length ?? 0) > 0;
  const hasSizes = (product.sizes?.length ?? 0) > 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (requireColorSize && hasColors && !selectedColor) {
      push({ title: "Select a color", description: "Please choose a color before submitting." });
      return;
    }

    if (requireColorSize && hasSizes && !selectedSize) {
      push({ title: "Select a size", description: "Please choose a size before submitting." });
      return;
    }

    const formData = new FormData(event.currentTarget);
    const userMessage = String(formData.get("message") ?? "").trim();

    const productLines = [
      `Product: ${product.name}`,
      `Slug: ${product.slug}`,
      selectedColor ? `Color: ${selectedColor}` : null,
      selectedSize ? `Size: ${selectedSize}` : null
    ].filter(Boolean) as string[];

    const message = userMessage
      ? `${userMessage}\n\n---\n${productLines.join("\n")}`
      : productLines.join("\n");

    setSubmitting(true);
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        message,
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
    setOpen(false);
    setInternalColor("");
    setInternalSize("");
    event.currentTarget.reset();
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setInternalColor("");
      setInternalSize("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-xl font-semibold text-primary">Product Enquiry</DialogTitle>
        <p className="mb-4 text-sm text-primary/70">
          Enquiring about: <span className="font-medium text-primary">{product.name}</span>
        </p>
        {!showOptionPickers && (selectedColor || selectedSize) ? (
          <p className="mb-4 text-xs text-primary/60">
            {selectedColor ? `Color: ${selectedColor}` : null}
            {selectedColor && selectedSize ? " · " : null}
            {selectedSize ? `Size: ${selectedSize}` : null}
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-3">
          {showOptionPickers && hasColors ? (
            <div>
              <p className="mb-2 text-sm font-medium text-primary">
                Color{requireColorSize ? "*" : ""}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors!.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setInternalColor(color)}
                    className={`h-8 w-8 rounded-full border-2 ${
                      selectedColor === color ? "border-primary" : "border-black/20"
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {showOptionPickers && hasSizes ? (
            <div>
              <p className="mb-2 text-sm font-medium text-primary">
                Size{requireColorSize ? "*" : ""}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes!.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setInternalSize(size)}
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
          ) : null}

          <input name="name" required placeholder="Name*" className="h-11 w-full rounded-md border px-3" />
          <input name="phone" required placeholder="Phone*" className="h-11 w-full rounded-md border px-3" />
          <input name="email" type="email" placeholder="Email" className="h-11 w-full rounded-md border px-3" />
          <textarea name="message" placeholder="Message (optional)" rows={4} className="w-full rounded-md border p-3" />
          <button
            type="submit"
            disabled={submitting || product.inStock === false}
            className="w-full rounded-md bg-primary py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Enquiry"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
