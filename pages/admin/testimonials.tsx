import { FormEvent, useCallback, useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";

type Testimonial = {
  id: number;
  name: string;
  role: string | null;
  quote: string;
  is_active: number;
  sort_order: number;
};

const emptyForm = {
  name: "",
  role: "",
  quote: "",
  is_active: true,
  sort_order: 0,
};

export default function AdminTestimonialsPage() {
  const [rows, setRows] = useState<Testimonial[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin-testimonials", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load testimonials.");
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

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const onEdit = (row: Testimonial) => {
    setEditingId(row.id);
    setForm({
      name: row.name,
      role: row.role || "",
      quote: row.quote,
      is_active: Boolean(row.is_active),
      sort_order: row.sort_order || 0,
    });
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin-testimonials", { credentials: "include", method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId || undefined, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Save failed.");
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this testimonial?")) return;
    const res = await fetch("/api/admin-testimonials", { credentials: "include", method: "DELETE",
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

  return (
    <AdminLayout title="Testimonials">
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
            <input
              className="input-field"
              placeholder="Role / Location"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            />
            <textarea
              className="input-field"
              rows={5}
              placeholder="Quote"
              value={form.quote}
              onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
              required
            />
            <input
              className="input-field"
              type="number"
              placeholder="Sort order"
              value={form.sort_order}
              onChange={(e) =>
                setForm((f) => ({ ...f, sort_order: Number(e.target.value) || 0 }))
              }
            />
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
              />
              Active
            </label>
          </div>
          {error ? (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}
          <div className="mt-4 flex gap-2">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update" : "Add Testimonial"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <div className="overflow-hidden rounded-2xl bg-white shadow-card xl:col-span-3">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Quote</th>
                  <th className="px-4 py-3">Active</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                      Loading...
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                      No testimonials yet.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} className="border-t border-slate-100 align-top">
                      <td className="px-4 py-3">
                        <p className="font-medium text-primary">{row.name}</p>
                        <p className="text-xs text-slate-500">{row.role}</p>
                      </td>
                      <td className="max-w-sm px-4 py-3 text-slate-600">{row.quote}</td>
                      <td className="px-4 py-3">{row.is_active ? "Yes" : "No"}</td>
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
        </div>
      </div>
    </AdminLayout>
  );
}
