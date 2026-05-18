"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";

type Project = {
  id: string;
  title: string;
  style: string;
  slug: string;
};

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [style, setStyle] = useState("");

  const load = () => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then(setProjects)
      .catch(() => undefined);
  };

  useEffect(() => {
    load();
  }, []);

  const reorder = (sourceId: string, targetId: string) => {
    const sourceIndex = projects.findIndex((item) => item.id === sourceId);
    const targetIndex = projects.findIndex((item) => item.id === targetId);
    if (sourceIndex === -1 || targetIndex === -1) return;
    const next = [...projects];
    const [moved] = next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, moved);
    setProjects(next);
  };

  const saveProject = async () => {
    if (!title || !style) return;
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug: title.toLowerCase().replace(/\s+/g, "-"),
        style,
        beforePhoto: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1200",
        afterPhoto: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200",
        description: "New project entry",
        featured: false
      })
    });
    setTitle("");
    setStyle("");
    load();
  };

  return (
    <main className="min-h-screen bg-surface pb-8">
      <AdminHeader />
      <div className="px-4 md:px-8">
      <h1 className="mb-5 text-3xl font-light text-primary">Portfolio</h1>

      <div className="mb-6 grid gap-3 rounded-xl border border-black/10 bg-white p-4 md:grid-cols-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="h-10 rounded-md border px-3" placeholder="Project title" />
        <input value={style} onChange={(e) => setStyle(e.target.value)} className="h-10 rounded-md border px-3" placeholder="Style" />
        <button type="button" onClick={saveProject} className="h-10 rounded-md bg-primary text-sm text-white">
          Add Project
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.id}
            draggable
            onDragStart={() => setDraggingId(project.id)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (draggingId) reorder(draggingId, project.id);
            }}
            className="rounded-xl border border-black/10 bg-white p-4"
          >
            <p className="text-xs uppercase tracking-[0.16em] text-accent">{project.style}</p>
            <h3 className="mt-1 text-lg font-medium text-primary">{project.title}</h3>
            <p className="mt-1 text-xs text-primary/60">{project.slug}</p>
          </div>
        ))}
      </div>
      </div>
    </main>
  );
}
