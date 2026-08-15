import { useCallback, useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";

type Appointment = {
  id: number;
  name: string;
  phone: string;
  service: string;
  status: string;
  preferred_date: string | null;
  created_at: string;
};

const TABS = ["all", "pending", "confirmed", "completed", "cancelled"] as const;
type Tab = (typeof TABS)[number];

const statusClass: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminAppointmentsPage() {
  const [rows, setRows] = useState<Appointment[]>([]);
  const [tab, setTab] = useState<Tab>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (status: Tab) => {
    setLoading(true);
    setError(null);
    try {
      const qs = status === "all" ? "" : `?status=${status}`;
      const res = await fetch(`/api/admin-appointments${qs}`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load appointments.");
      setRows(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(tab);
  }, [load, tab]);

  const updateStatus = async (id: number, status: string) => {
    const res = await fetch("/api/admin-appointments", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Update failed");
      return;
    }
    await load(tab);
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this appointment?")) return;
    const res = await fetch("/api/admin-appointments", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Delete failed");
      return;
    }
    await load(tab);
  };

  return (
    <AdminLayout title="Appointments">
      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize ${
              tab === t
                ? "bg-primary text-white"
                : "bg-white text-slate-600 shadow-card hover:bg-slate-50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {error ? (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <div className="overflow-hidden rounded-2xl bg-white shadow-card">
        {loading ? (
          <p className="p-8 text-center text-sm text-slate-500">Loading appointments...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Date booked</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => {
                    const status = (row.status || "pending").toLowerCase();
                    return (
                      <tr key={row.id} className="border-t border-slate-100">
                        <td className="px-4 py-3 font-medium text-primary">{row.name}</td>
                        <td className="px-4 py-3">{row.phone}</td>
                        <td className="px-4 py-3">{row.service}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500">
                          {row.created_at
                            ? new Date(row.created_at).toLocaleString()
                            : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-2">
                            <span
                              className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                                statusClass[status] || statusClass.pending
                              }`}
                            >
                              {status}
                            </span>
                            <select
                              className="rounded border border-slate-200 px-2 py-1 text-xs"
                              value={status}
                              onChange={(e) => updateStatus(row.id, e.target.value)}
                            >
                              <option value="pending">pending</option>
                              <option value="confirmed">confirmed</option>
                              <option value="completed">completed</option>
                              <option value="cancelled">cancelled</option>
                            </select>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => remove(row.id)}
                            className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
