import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 bg-primary text-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <p className="text-xl font-semibold tracking-[0.2em] text-accent">XYLEM</p>
          <p className="mt-3 text-sm text-surface/80">Crafted furniture and interior experiences for timeless spaces.</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">Quick Links</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link href="/furniture">Furniture</Link>
            <Link href="/interior">Interior</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">Furniture Categories</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link href="/furniture/sofas">Sofas</Link>
            <Link href="/furniture/chairs">Chairs</Link>
            <Link href="/furniture/tables">Tables</Link>
            <Link href="/furniture/storage">Storage</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">Contact Info</p>
          <div className="mt-3 space-y-2 text-sm text-surface/85">
            <p>hello@xylem.com</p>
            <p>+91 90000 00000</p>
            <p>Mumbai, India</p>
          </div>
        </div>
      </div>
      <div className="border-t border-accent/30 px-6 py-4 text-center text-sm text-surface/75">
        <span>© {new Date().getFullYear()} XYLEM Industries. Made with craftsmanship.</span>
      </div>
    </footer>
  );
}
