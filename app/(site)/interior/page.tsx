"use client";

import { ConsultationForm } from "@/components/interior/ConsultationForm";
import { ProjectCard } from "@/components/interior/ProjectCard";
import { mockProjects } from "@/lib/mock-data";
import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";

const styles = ["All", "Modern", "Classic", "Minimalist", "Contemporary"];

export default function InteriorPage() {
  const [activeStyle, setActiveStyle] = useState("All");
  const projects = useMemo(
    () => (activeStyle === "All" ? mockProjects : mockProjects.filter((item) => item.style === activeStyle)),
    [activeStyle]
  );

  return (
    <main className="bg-surface">
      <section className="relative h-[70vh] min-h-[460px] overflow-hidden">
        <motion.div initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 1.2 }} className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=2000"
            alt="Interior design world"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/45" />
        </motion.div>
        <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
          <h1 className="font-serif text-5xl font-light text-white md:text-7xl">Interior Design World</h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="mb-8 flex flex-wrap gap-3 border-b border-black/10 pb-3">
          {styles.map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => setActiveStyle(style)}
              className={`relative px-1 py-2 text-sm ${
                activeStyle === style ? "text-primary" : "text-primary/55"
              }`}
            >
              {style}
              {activeStyle === style ? (
                <motion.span layoutId="style-underline" className="absolute inset-x-0 -bottom-3 h-0.5 bg-accent" />
              ) : null}
            </button>
          ))}
        </div>

        <div className="columns-1 gap-5 space-y-5 md:columns-2">
          {projects.map((project) => (
            <div key={project.id} className="break-inside-avoid">
              <ProjectCard
                title={project.title}
                style={project.style}
                beforePhoto={project.beforePhoto}
                afterPhoto={project.afterPhoto}
                description={project.description}
              />
            </div>
          ))}
        </div>

        <div className="mt-14">
          <ConsultationForm />
        </div>
      </section>
    </main>
  );
}
