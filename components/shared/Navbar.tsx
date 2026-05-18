"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/furniture", label: "Furniture" },
  { href: "/interior", label: "Interior" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 to-transparent" />

      <nav className="relative mx-auto mt-4 flex h-14 max-w-6xl items-center justify-between rounded-full border border-white/30 bg-black/30 px-5 text-white shadow-[0_10px_35px_rgba(0,0,0,0.25)] backdrop-blur-md md:px-8">
        <Link href="/" className="text-sm font-semibold tracking-[0.35em]">
          XYLEM INDUSTRIES
        </Link>

        <div className="hidden items-center gap-7 text-[12px] uppercase tracking-[0.14em] md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`transition-colors ${
                pathname === item.href ? "text-accent" : "text-white/90 hover:text-accent"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="rounded-full border border-white/45 bg-black/25 p-2 text-white md:hidden"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {isOpen && (
        <div className="mx-auto mt-3 w-[calc(100%-2rem)] max-w-6xl rounded-2xl border border-white/20 bg-primary/90 p-5 text-white backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-4 text-sm uppercase tracking-[0.12em]">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`transition-colors ${
                  pathname === item.href ? "text-accent" : "text-white/90 hover:text-accent"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
