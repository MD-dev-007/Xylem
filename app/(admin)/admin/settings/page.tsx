import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminSettingsPage() {
  return (
    <main className="min-h-screen bg-surface pb-8">
      <AdminHeader />
      <div className="px-4 md:px-8">
        <h1 className="mb-4 text-3xl font-light text-primary">Settings</h1>
        <div className="max-w-2xl rounded-xl border border-black/10 bg-white p-5 text-sm text-primary/80">
          <p>Environment-backed settings will be configurable here in the next iteration.</p>
        </div>
      </div>
    </main>
  );
}
