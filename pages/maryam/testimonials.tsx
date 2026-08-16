import { FormEvent, useCallback, useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import AdminToast from "@/components/AdminToast";

type Testimonial = {
  id: number;
  name: string;
  quote: string;
  rating: number;
  is_active: number;
};

const emptyForm = {
  name: "",
  message: "",
  rating: 5,
  is_active: true,
};

export default function AdminTestimonialsPage() {
  const [rows, setRows] = useState<Testimonial[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin-testimonials", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Failed to load testimonials.");
      // API returns a raw array
      setRows(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const onEdit = (row: Testimonial) => {
    setEditingId(row.id);
    setForm({
      name: row.name,
      message: row.quote || "",
      rating: Number(row.rating) || 5,
      is_active: Boolean(row.is_active),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin-testimonials", {
        method: editingId ? "PATCH" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId || undefined,
          name: form.name,
          message: form.message,
          quote: form.message,
          rating: form.rating,
          is_active: form.is_active,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Save failed.");
      setToast({
        ok: true,
        text: editingId ? "Testimonial updated and saved." : "Testimonial added and saved.",
      });
      resetForm();
      await load();
    } catch (err) {
      const text = err instanceof Error ? err.message : "Save failed.";
      setError(text);
      setToast({ ok: false, text });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this testimonial?")) return;
    const res = await fetch("/api/admin-testimonials", {
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
    if (editingId === id) resetForm();
    await load();
  };

  const stars = (n: number) => "★".repeat(Math.max(1, Math.min(5, n))) + "☆".repeat(5 - Math.max(1, Math.min(5, n)));

  return (
    <AdminLayout title="Testimonials">
      {toast ? (
        <AdminToast ok={toast.ok} text={toast.text} onClose={() => setToast(null)} />
      ) : null}
      <div className="grid gap-6 xl:grid-cols-5">
        <form onSubmit={onSubmit} className="rounded-2xl bg-white p-5 shadow-card xl:col-span-2">
          <h2 className="text-lg font-semibold text-primary">
            {editingId ? "Edit Testimonial" : "Add Testimonial"}
          </h2>
          <div className="mt-4 space-y-3">
            <input
              className="input-field"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
            <textarea
              className="input-field"
              rows={4}
              placeholder="Message"
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              required
            />
            <label className="block text-sm font-medium text-slate-700">
              Rating
              <select
                className="input-field mt-1"
                value={form.rating}
                onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "star" : "stars"}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
              />
              Active
            </label>
          </div>
          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
          <div className="mt-4 flex gap-2">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update" : "Add Testimonial"}
            </button>
            {editingId ? (
              <button type="button" onClick={resetForm} className="rounded-lg border px-4 py-2 text-sm">
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <div className="overflow-hidden rounded-2xl bg-white shadow-card xl:col-span-3">
          {loading ? (
            <p className="p-8 text-center text-sm text-slate-500">Loading testimonials...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Message</th>
                    <th className="px-4 py-3">Rating</th>
                    <th className="px-4 py-3">Active</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                        No testimonials yet.
                      </td>
                    </tr>
                  ) : (
                    rows.map((row) => (
                      <tr key={row.id} className="border-t border-slate-100 align-top">
                        <td className="px-4 py-3 font-medium text-primary">{row.name}</td>
                        <td className="px-4 py-3">
                          <p className="line-clamp-2 text-slate-600">{row.quote}</p>
                        </td>
                        <td className="px-4 py-3 text-amber-500">{stars(Number(row.rating) || 5)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              row.is_active
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {row.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => onEdit(row)}
                              className="rounded-md bg-secondary/10 px-3 py-1.5 text-xs font-semibold text-secondary"
                            >
                              Edit
                            </button>
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
      </div>
    </AdminLayout>
  );
}
