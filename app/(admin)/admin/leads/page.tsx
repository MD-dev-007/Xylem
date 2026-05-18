"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";

type Lead = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  type: "PRODUCT_ENQUIRY" | "CONSULTATION";
  status: "NEW" | "CONTACTED" | "CLOSED";
  createdAt: string;
  product?: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [status, setStatus] = useState("ALL");
  const [type, setType] = useState("ALL");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = () => {
    fetch("/api/leads")
      .then((res) => res.json())
      .then(setLeads)
      .catch(() => undefined);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      const leadDate = new Date(lead.createdAt).getTime();
      const fromOk = from ? leadDate >= new Date(from).getTime() : true;
      const toOk = to ? leadDate <= new Date(to).getTime() : true;
      return (
        (status === "ALL" || lead.status === status) &&
        (type === "ALL" || lead.type === type) &&
        fromOk &&
        toOk
      );
    });
  }, [from, leads, status, to, type]);

  const updateStatus = async (id: string, nextStatus: string) => {
    await fetch(`/api/leads/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus })
    });
    load();
  };

  return (
    <main className="min-h-screen bg-surface pb-8">
      <AdminHeader />
      <div className="px-4 md:px-8">
      <h1 className="mb-5 text-3xl font-light text-primary">Leads</h1>
      <div className="mb-4 grid gap-3 rounded-xl border border-black/10 bg-white p-4 md:grid-cols-4">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-md border px-2">
          <option value="ALL">All Statuses</option>
          <option value="NEW">NEW</option>
          <option value="CONTACTED">CONTACTED</option>
          <option value="CLOSED">CLOSED</option>
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} className="h-10 rounded-md border px-2">
          <option value="ALL">All Types</option>
          <option value="PRODUCT_ENQUIRY">PRODUCT_ENQUIRY</option>
          <option value="CONSULTATION">CONSULTATION</option>
        </select>
        <input value={from} onChange={(e) => setFrom(e.target.value)} type="date" className="h-10 rounded-md border px-2" />
        <input value={to} onChange={(e) => setTo(e.target.value)} type="date" className="h-10 rounded-md border px-2" />
      </div>

      <div className="space-y-3">
        {filtered.map((lead) => (
          <div key={lead.id} className="rounded-xl border border-black/10 bg-white">
            <button
              type="button"
              onClick={() => setExpanded((prev) => (prev === lead.id ? null : lead.id))}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <div>
                <p className="font-medium text-primary">{lead.name}</p>
                <p className="text-xs text-primary/65">
                  {lead.phone} · {lead.type}
                  {lead.product ? ` · ${lead.product.name}` : ""}
                </p>
              </div>
              <span className="text-xs text-primary/70">{lead.status}</span>
            </button>
            {expanded === lead.id ? (
              <div className="border-t border-black/10 px-4 py-3 text-sm text-primary/80">
                <p>Email: {lead.email ?? "-"}</p>
                {lead.product ? (
                  <p>
                    Product:{" "}
                    <a
                      href={`/furniture/product/${lead.product.slug}`}
                      className="font-medium text-accent underline-offset-2 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {lead.product.name}
                    </a>
                  </p>
                ) : null}
                <p className="whitespace-pre-wrap">Message: {lead.message ?? "-"}</p>
                <p>Date: {new Date(lead.createdAt).toLocaleString()}</p>
                <div className="mt-3">
                  <label className="mr-2 text-xs">Update Status:</label>
                  <select
                    value={lead.status}
                    onChange={(event) => updateStatus(lead.id, event.target.value)}
                    className="h-9 rounded border px-2"
                  >
                    <option value="NEW">NEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      </div>
    </main>
  );
}
