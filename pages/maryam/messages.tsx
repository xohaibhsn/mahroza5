import { useCallback, useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";

type Message = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  is_read: number;
  created_at: string;
};

export default function AdminMessagesPage() {
  const [rows, setRows] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin-messages", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Failed to load messages.");
      setRows(Array.isArray(data) ? data : data.data || []);
      window.dispatchEvent(new Event("admin-messages-updated"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markRead = async (id: number) => {
    const res = await fetch("/api/admin-messages", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_read: true }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Update failed");
      return;
    }
    await load();
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    const res = await fetch("/api/admin-messages", {
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
    await load();
  };

  return (
    <AdminLayout title="Messages">
      {error ? (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <div className="overflow-hidden rounded-2xl bg-white shadow-card">
        {loading ? (
          <p className="p-8 text-center text-sm text-slate-500">Loading messages...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Message</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      No messages yet.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr
                      key={row.id}
                      className={`border-t border-slate-100 align-top ${
                        row.is_read ? "" : "bg-blue-50/40"
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-primary">{row.name}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        <p>{row.phone || "—"}</p>
                        <p>{row.email || "—"}</p>
                      </td>
                      <td className="max-w-md px-4 py-3 text-slate-700">{row.message}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500">
                        {row.created_at
                          ? new Date(row.created_at).toLocaleString()
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            row.is_read
                              ? "bg-slate-100 text-slate-600"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {row.is_read ? "Read" : "Unread"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-2">
                          {!row.is_read ? (
                            <button
                              type="button"
                              onClick={() => markRead(row.id)}
                              className="rounded-md bg-secondary/10 px-3 py-1.5 text-xs font-semibold text-secondary"
                            >
                              Mark as read
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => remove(row.id)}
                            className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
