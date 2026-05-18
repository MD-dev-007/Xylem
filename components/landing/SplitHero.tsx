"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const panels = [
  {
    eyebrow: "FURNITURE WORLD",
    title: "Craft Your Space",
    href: "/furniture",
    image:
      "bg-[url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200')]"
  },
  {
    eyebrow: "INTERIOR DESIGN",
    title: "Design Your World",
    href: "/interior",
    image:
      "bg-[url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200')]"
  }
];

export default function SplitHero() {
  return (
    <section className="w-full">
      <div className="relative flex min-h-screen flex-col md:flex-row">
        {panels.map((panel, index) => (
          <motion.div
            key={panel.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 + index * 0.15 }}
            className="group relative flex min-h-[50vh] flex-1 items-center justify-center overflow-hidden"
          >
            <div
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[600ms] ease-out group-hover:scale-105 ${panel.image}`}
            />
            <div className="absolute inset-0 bg-black/45 transition-colors duration-[600ms] ease-out group-hover:bg-black/20" />

            <div className="relative z-10 mx-auto flex max-w-md flex-col items-center gap-5 px-6 text-center">
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.65,
                  ease: "easeOut",
                  delay: 0.25 + index * 0.15
                }}
                className="text-[11px] uppercase tracking-[0.2em] text-accent"
              >
                {panel.eyebrow}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.65,
                  ease: "easeOut",
                  delay: 0.35 + index * 0.15
                }}
                className="text-balance text-[40px] font-light leading-tight text-white md:text-[52px]"
              >
                {panel.title}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.65,
                  ease: "easeOut",
                  delay: 0.45 + index * 0.15
                }}
              >
                <Link
                  href={panel.href}
                  className="inline-flex items-center gap-2 border border-white px-6 py-3 text-sm font-medium text-white transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-primary"
                >
                  Explore <span aria-hidden>→</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ))}

        <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden -translate-x-1/2 md:flex md:items-center">
          <div className="relative flex h-full items-center justify-center">
            <div className="h-full w-px bg-white/40" />
            <div className="absolute rounded-full border border-white/40 bg-black/35 px-4 py-2 text-sm font-semibold tracking-[0.2em] text-white">
              XYLEM
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-primary px-6 py-12 text-center"
      >
        <p className="font-serif text-2xl italic text-surface md:text-3xl">
          Where craftsmanship meets vision.
        </p>
      </motion.div>
    </section>
  );
}
