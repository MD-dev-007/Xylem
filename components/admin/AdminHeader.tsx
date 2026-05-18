"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/portfolio", label: "Portfolio" },
  { href: "/admin/settings", label: "Settings" }
];

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 mb-6 border-b border-primary/10 bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-accent">XYLEM Admin</p>
          <h1 className="text-xl font-semibold text-primary">Control Panel</h1>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-primary/15 bg-white p-1 md:flex">
          {navItems.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin" || pathname.startsWith("/admin/dashboard")
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.08em] transition ${
                  active ? "bg-primary text-white" : "text-primary/75 hover:bg-primary/5 hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          onClick={async () => {
            await signOut({ redirect: false });
            router.replace("/admin/login");
            router.refresh();
          }}
          className="rounded-full border border-primary/20 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-primary transition hover:border-primary hover:bg-primary hover:text-white"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
