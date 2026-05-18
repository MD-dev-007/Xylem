import { mockProjects } from "@/lib/mock-data";
import Image from "next/image";

export default function InteriorProjectPage({ params }: { params: { slug: string } }) {
  const project = mockProjects.find((item) => item.slug === params.slug);
  if (!project) {
    return <main className="px-6 py-16 text-primary">Project not found.</main>;
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <p className="text-xs uppercase tracking-[0.16em] text-accent">{project.style}</p>
      <h1 className="mt-2 text-4xl font-light text-primary">{project.title}</h1>
      <p className="mt-3 max-w-3xl text-primary/75">{project.description}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
          <Image src={project.beforePhoto} alt={`${project.title} before`} fill className="object-cover" />
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
          <Image src={project.afterPhoto} alt={`${project.title} after`} fill className="object-cover" />
        </div>
      </div>
    </main>
  );
}
