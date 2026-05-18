import { SITE_ADDRESS, SITE_EMAIL, SITE_MAP_EMBED_URL, SITE_MAP_LINK } from "@/lib/site-contact";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contact | XYLEM Industries",
    description: "Connect with XYLEM for furniture and interior consultations in Salem, Tamil Nadu.",
    openGraph: {
      images: ["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200"]
    }
  };
}

export default function ContactPage() {
  return (
    <main className="bg-surface pb-16">
      <section className="mx-auto max-w-4xl px-6 py-16 text-primary">
        <h1 className="text-4xl font-light">Contact</h1>
        <p className="mt-4 max-w-2xl text-primary/75">
          Visit our showroom or reach out for furniture and interior consultations.
        </p>

        <div className="mt-8 space-y-3 text-primary/85">
          <p>
            <span className="font-medium text-primary">Email: </span>
            <a href={`mailto:${SITE_EMAIL}`} className="text-accent underline-offset-2 hover:underline">
              {SITE_EMAIL}
            </a>
          </p>
          <p>
            <span className="font-medium text-primary">Address: </span>
            {SITE_ADDRESS}
          </p>
          <p>
            <a
              href={SITE_MAP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-accent underline-offset-2 hover:underline"
            >
              Open in Google Maps
            </a>
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6">
        <div className="overflow-hidden rounded-xl border border-primary/10 shadow-sm">
          <iframe
            title="XYLEM Industries location"
            src={SITE_MAP_EMBED_URL}
            className="h-[420px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </section>
    </main>
  );
}
