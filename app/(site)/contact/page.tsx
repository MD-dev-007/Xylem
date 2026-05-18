import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contact | XYLEM Industries",
    description: "Connect with XYLEM for furniture and interior consultations.",
    openGraph: {
      images: ["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200"]
    }
  };
}

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-primary">
      <h1 className="text-4xl font-light">Contact</h1>
      <p className="mt-4 text-primary/75">Email: hello@xylem.com · Phone: +91 90000 00000</p>
    </main>
  );
}
