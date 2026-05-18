import SplitHero from "@/components/landing/SplitHero";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "XYLEM Industries | Home",
    description: "Furniture and interior worlds built around craftsmanship and vision.",
    openGraph: {
      images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200"]
    }
  };
}

export default function LandingPage() {
  return (
    <main>
      <SplitHero />
    </main>
  );
}
