import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";

type Stats = {
  appointments: number;
  pending: number;
  services: number;
  messages: number;
  testimonials: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    appointments: 0,
    pending: 0,
    services: 0,
    messages: 0,
    testimonials: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin-stats", { credentials: "include" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load dashboard stats.");
        setStats({
          appointments: data.data?.appointments || 0,
          pending: data.data?.pending || 0,
          services: data.data?.services || 0,
          messages: data.data?.messages || 0,
          testimonials: data.data?.testimonials || 0,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load stats.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cards = [
    { label: "Total Appointments", value: stats.appointments, tone: "bg-primary" },
    { label: "Pending", value: stats.pending, tone: "bg-amber-500" },
    { label: "Services", value: stats.services, tone: "bg-secondary" },
    { label: "Testimonials", value: stats.testimonials, tone: "bg-indigo-500" },
    { label: "Messages", value: stats.messages, tone: "bg-emerald-600" },
  ];

  return (
    <AdminLayout title="Dashboard">
      {error ? (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      {loading ? (
        <p className="text-sm text-slate-500">Loading stats...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {cards.map((card) => (
            <div key={card.label} className="rounded-2xl bg-white p-5 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {card.label}
              </p>
              <p className="mt-3 font-display text-4xl font-semibold text-primary">{card.value}</p>
              <div className={`mt-4 h-1.5 w-12 rounded-full ${card.tone}`} />
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-card">
        <h2 className="text-lg font-semibold text-primary">Welcome to QHC Admin</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Manage appointments, services, testimonials, homepage content, contact messages, and
          settings from the sidebar.
        </p>
      </div>
    </AdminLayout>
  );
}
