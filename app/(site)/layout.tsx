import { Footer } from "@/components/shared/Footer";
import { Navbar } from "@/components/shared/Navbar";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "XYLEM Industries",
    template: "%s | XYLEM Industries"
  },
  description: "Luxury furniture and interior design by XYLEM Industries.",
  openGraph: {
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200"]
  }
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="pt-20">{children}</div>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
