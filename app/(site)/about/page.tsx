import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "About | XYLEM Industries",
    description: "Learn about XYLEM craftsmanship and design philosophy.",
    openGraph: {
      images: ["https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200"]
    }
  };
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-primary">
      <h1 className="text-4xl font-light">About XYLEM Industries</h1>
      <p className="mt-4 text-primary/75">
        We craft furniture and interiors where material excellence meets design vision.
      </p>
    </main>
  );
}
