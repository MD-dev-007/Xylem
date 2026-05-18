"use client";

import Image from "next/image";
import { useState } from "react";

type ProjectCardProps = {
  title: string;
  style: string;
  beforePhoto: string;
  afterPhoto: string;
  description: string;
};

export function ProjectCard({ title, style, beforePhoto, afterPhoto, description }: ProjectCardProps) {
  const [position, setPosition] = useState(50);

  return (
    <article className="overflow-hidden rounded-xl border border-black/10 bg-white">
      <div className="relative aspect-[4/3]">
        <Image src={beforePhoto} alt={`${title} before`} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <Image src={afterPhoto} alt={`${title} after`} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
        </div>
        <div className="absolute inset-y-0 z-20" style={{ left: `${position}%` }}>
          <div className="h-full w-0.5 bg-white/90" />
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          className="absolute bottom-4 left-1/2 z-30 w-2/3 -translate-x-1/2 accent-accent"
          aria-label="Before and after slider"
        />
      </div>
      <div className="space-y-2 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">{style}</p>
        <h3 className="text-lg font-medium text-primary">{title}</h3>
        <p className="text-sm text-primary/70">{description}</p>
      </div>
    </article>
  );
}
