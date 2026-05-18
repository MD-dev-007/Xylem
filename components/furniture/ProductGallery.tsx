"use client";

import Image from "next/image";
import { useState } from "react";

type ProductGalleryProps = {
  images: string[];
  productName: string;
};

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative hidden aspect-[4/5] overflow-hidden rounded-2xl border border-black/10 md:block">
        <Image
          src={images[active]}
          alt={productName}
          fill
          className="object-cover transition-transform duration-500 ease-out hover:scale-110"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className="hidden gap-3 md:flex">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setActive(index)}
            className={`relative aspect-square w-20 overflow-hidden rounded-lg border ${
              active === index ? "border-accent" : "border-black/15"
            }`}
          >
            <Image src={image} alt={`${productName} thumbnail`} fill className="object-cover" sizes="80px" />
          </button>
        ))}
      </div>

      <div className="md:hidden">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
          {images.map((image) => (
            <div key={image} className="relative aspect-[4/5] w-[84vw] snap-center overflow-hidden rounded-xl">
              <Image src={image} alt={productName} fill className="object-cover" sizes="84vw" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
