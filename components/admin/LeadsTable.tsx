"use client";

type LeadRow = {
  id: string;
  name: string;
  phone: string;
  type: string;
  status: string;
  createdAt: string;
};

type LeadsTableProps = {
  leads: LeadRow[];
};

export function LeadsTable({ leads }: LeadsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-primary/5 text-primary">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-t border-black/10">
              <td className="px-4 py-3">{lead.name}</td>
              <td className="px-4 py-3">{lead.phone}</td>
              <td className="px-4 py-3">{lead.type}</td>
              <td className="px-4 py-3">{lead.status}</td>
              <td className="px-4 py-3">{new Date(lead.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
