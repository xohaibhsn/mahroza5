import Link from "next/link";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";

type Stats = {
  appointments: number;
  pending: number;
  services: number;
  messages: number;
  unread_messages: number;
  testimonials: number;
  recent_appointments: Array<{
    id: number;
    name: string;
    phone: string;
    service: string;
    status: string;
    created_at: string;
  }>;
  recent_messages: Array<{
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    message: string;
    is_read: number;
    created_at: string;
  }>;
};

const statusClass: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin-stats", { credentials: "include" });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || data.error || "Failed to load dashboard.");
        }
        const payload = data.data || data;
        setStats({
          appointments: Number(payload.appointments || 0),
          pending: Number(payload.pending || 0),
          services: Number(payload.services || 0),
          messages: Number(payload.messages || 0),
          unread_messages: Number(
            payload.unread_messages ?? payload.unread ?? 0
          ),
          testimonials: Number(payload.testimonials || 0),
          recent_appointments:
            payload.recent_appointments || payload.recentAppointments || [],
          recent_messages:
            payload.recent_messages || payload.recentMessages || [],
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cards = [
    { label: "Appointments", value: stats?.appointments || 0, tone: "bg-primary", href: "/admin/appointments" },
    { label: "Pending", value: stats?.pending || 0, tone: "bg-amber-500", href: "/admin/appointments" },
    { label: "Services", value: stats?.services || 0, tone: "bg-secondary", href: "/admin/services" },
    { label: "Testimonials", value: stats?.testimonials || 0, tone: "bg-indigo-500", href: "/admin/testimonials" },
    { label: "Unread Messages", value: stats?.unread_messages || 0, tone: "bg-emerald-600", href: "/admin/messages" },
  ];

  return (
    <AdminLayout title="Dashboard">
      {error ? (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      {loading || !stats ? (
        <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 shadow-card">
          Loading dashboard...
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {cards.map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className="rounded-2xl bg-white p-5 shadow-card transition hover:-translate-y-0.5"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {card.label}
                </p>
                <p className="mt-3 font-display text-4xl font-semibold text-primary">{card.value}</p>
                <div className={`mt-4 h-1.5 w-12 rounded-full ${card.tone}`} />
              </Link>
            ))}
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            <div className="overflow-hidden rounded-2xl bg-white shadow-card">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <h2 className="font-semibold text-primary">Latest Appointments</h2>
                <Link href="/admin/appointments" className="text-xs font-semibold text-secondary">
                  View all
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Service</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recent_appointments.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-6 text-center text-slate-500">
                          No appointments yet.
                        </td>
                      </tr>
                    ) : (
                      stats.recent_appointments.map((row) => (
                        <tr key={row.id} className="border-t border-slate-100">
                          <td className="px-4 py-3">
                            <p className="font-medium text-primary">{row.name}</p>
                            <p className="text-xs text-slate-500">{row.phone}</p>
                          </td>
                          <td className="px-4 py-3">{row.service}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                                statusClass[row.status] || statusClass.pending
                              }`}
                            >
                              {row.status || "pending"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-card">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <h2 className="font-semibold text-primary">Latest Messages</h2>
                <Link href="/admin/messages" className="text-xs font-semibold text-secondary">
                  View all
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {stats.recent_messages.length === 0 ? (
                  <p className="px-5 py-6 text-center text-sm text-slate-500">No messages yet.</p>
                ) : (
                  stats.recent_messages.map((row) => (
                    <div key={row.id} className="px-5 py-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-primary">{row.name}</p>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            row.is_read ? "bg-slate-100 text-slate-600" : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {row.is_read ? "Read" : "Unread"}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600">{row.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
