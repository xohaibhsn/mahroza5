import { useCallback, useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";

type Appointment = {
  id: number;
  name: string;
  phone: string;
  service: string;
  message: string | null;
  status: string;
  created_at: string;
};

const statuses = ["pending", "confirmed", "completed", "cancelled"] as const;

const statusClass: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminAppointmentsPage() {
  const [rows, setRows] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin-appointments", { credentials: "include" });
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
    load();
  }, [load]);

  const updateStatus = async (id: number, status: string) => {
    const res = await fetch("/api/admin-appointments", { credentials: "include", method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Update failed");
      return;
    }
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status } : row)));
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this appointment?")) return;
    const res = await fetch("/api/admin-appointments", { credentials: "include", method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Delete failed");
      return;
    }
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  return (
    <AdminLayout title="Appointments">
      {error ? (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <div className="overflow-hidden rounded-2xl bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    Loading...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    No appointments yet.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-t border-slate-100 align-top">
                    <td className="px-4 py-3 font-medium text-slate-700">#{row.id}</td>
                    <td className="px-4 py-3 text-primary">{row.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.phone}</td>
                    <td className="px-4 py-3">{row.service}</td>
                    <td className="max-w-xs px-4 py-3 text-slate-600">{row.message || "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          statusClass[row.status] || statusClass.pending
                        }`}
                      >
                        {row.status || "pending"}
                      </span>
                      <select
                        className="mt-2 block w-full rounded-md border border-slate-200 px-2 py-1 text-xs"
                        value={row.status || "pending"}
                        onChange={(e) => updateStatus(row.id, e.target.value)}
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                      {new Date(row.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => remove(row.id)}
                        className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
