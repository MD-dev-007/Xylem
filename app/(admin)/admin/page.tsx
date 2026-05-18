"use client";

import { LeadsTable } from "@/components/admin/LeadsTable";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useEffect, useState } from "react";

type Stats = {
  totalProducts: number;
  leadsToday: number;
  portfolioProjects: number;
  pendingLeads: number;
};

type Lead = {
  id: string;
  name: string;
  phone: string;
  type: string;
  status: string;
  createdAt: string;
};

export default function AdminHomePage() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    leadsToday: 0,
    portfolioProjects: 0,
    pendingLeads: 0
  });
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(() => undefined);
    fetch("/api/leads")
      .then((res) => res.json())
      .then((data) => setLeads(data.slice(0, 6)))
      .catch(() => undefined);
  }, []);

  const cards = [
    { label: "Total Products", value: stats.totalProducts },
    { label: "Leads Today", value: stats.leadsToday },
    { label: "Portfolio Projects", value: stats.portfolioProjects },
    { label: "Pending Leads", value: stats.pendingLeads }
  ];

  return (
    <main className="min-h-screen bg-surface pb-8">
      <AdminHeader />
      <div className="px-4 md:px-8">
        <h1 className="mb-6 text-3xl font-light text-primary">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div key={card.label} className="rounded-xl border border-black/10 bg-white p-5">
              <p className="text-sm text-primary/65">{card.label}</p>
              <p className="mt-2 text-3xl font-semibold text-primary">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <a href="/admin/products" className="rounded-lg bg-primary p-4 text-sm font-medium text-white">
            Manage Products
          </a>
          <a href="/admin/leads" className="rounded-lg bg-accent p-4 text-sm font-medium text-primary">
            Review Leads
          </a>
          <a href="/admin/portfolio" className="rounded-lg border border-primary/20 bg-white p-4 text-sm font-medium text-primary">
            Update Portfolio
          </a>
        </div>

        <section className="mt-8">
          <h2 className="mb-3 text-xl font-medium text-primary">Recent Leads</h2>
          <LeadsTable leads={leads} />
        </section>
      </div>
    </main>
  );
}
