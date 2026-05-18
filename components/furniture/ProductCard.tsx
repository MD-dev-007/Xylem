"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

export type FurnitureProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  image: string;
  price: number;
  discount: number;
};

type ProductCardProps = {
  product: FurnitureProduct;
};

const cardItemMotion = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export function ProductCard({ product }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const discountedPrice = useMemo(
    () => product.price * (1 - product.discount / 100),
    [product.price, product.discount]
  );

  return (
    <motion.article variants={cardItemMotion} transition={{ duration: 0.45, ease: "easeOut" }}>
      <div className="group rounded-xl transition-shadow duration-400 hover:shadow-lg">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {product.discount > 0 && (
            <div className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
              -{product.discount}%
            </div>
          )}

          <button
            type="button"
            onClick={() => setWishlisted((prev) => !prev)}
            className="absolute right-3 top-3 rounded-full border border-white/30 bg-black/30 p-2 text-white backdrop-blur transition-colors hover:bg-black/40"
            aria-label="Toggle wishlist"
          >
            <Heart
              className={wishlisted ? "fill-red-500 text-red-500" : "text-white"}
              size={18}
              strokeWidth={1.8}
            />
          </button>
        </div>

        <div className="space-y-3 px-1 pt-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-black/55">{product.category}</p>
          <h3 className="text-base font-medium text-primary">{product.name}</h3>

          <div className="flex items-center gap-3">
            <p
              className={`text-sm ${
                product.discount > 0 ? "text-black/45 line-through" : "font-medium text-primary"
              }`}
            >
              {formatINR(product.price)}
            </p>
            {product.discount > 0 && (
              <p className="text-sm font-semibold text-accent">{formatINR(discountedPrice)}</p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Link
              href={`/furniture/product/${product.slug}`}
              className="rounded-md border border-primary/25 px-4 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/5"
            >
              View Details
            </Link>
            <button
              type="button"
              className="rounded-md bg-accent px-4 py-2 text-xs font-semibold text-primary transition-opacity hover:opacity-90"
            >
              Enquire
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
