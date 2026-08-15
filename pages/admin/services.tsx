import { FormEvent, useCallback, useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";

type Service = {
  id: number;
  title: string;
  short_text: string | null;
  description: string | null;
  image: string | null;
  is_active: number;
  sort_order: number;
};

const emptyForm = {
  title: "",
  short_text: "",
  description: "",
  image: "",
  is_active: true,
  sort_order: 0,
};

export default function AdminServicesPage() {
  const [rows, setRows] = useState<Service[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin-services", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load services.");
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

  const onEdit = (row: Service) => {
    setEditingId(row.id);
    setForm({
      title: row.title,
      short_text: row.short_text || "",
      description: row.description || "",
      image: row.image || "",
      is_active: Boolean(row.is_active),
      sort_order: row.sort_order || 0,
    });
  };

  const onUpload = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    setError(null);

    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("Failed to read image."));
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/admin-upload", { method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.message || "Upload failed.");
      }
      setForm((f) => ({ ...f, image: data.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/admin-services", { method: editingId ? "PATCH" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId || undefined,
          ...form,
          is_active: form.is_active,
        }),
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
    if (!confirm("Delete this service?")) return;
    const res = await fetch("/api/admin-services", { method: "DELETE",
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

  return (
    <AdminLayout title="Services">
      <div className="grid gap-6 xl:grid-cols-5">
        <form onSubmit={onSubmit} className="rounded-2xl bg-white p-5 shadow-card xl:col-span-2">
          <h2 className="text-lg font-semibold text-primary">
            {editingId ? "Edit Service" : "Add Service"}
          </h2>
          <div className="mt-4 space-y-3">
            <input
              className="input-field"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
            <input
              className="input-field"
              placeholder="Short text"
              value={form.short_text}
              onChange={(e) => setForm((f) => ({ ...f, short_text: e.target.value }))}
            />
            <textarea
              className="input-field"
              rows={4}
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Image (Cloudinary upload)
              </label>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm text-slate-600"
                onChange={(e) => onUpload(e.target.files?.[0] || null)}
              />
              {uploading ? <p className="mt-1 text-xs text-secondary">Uploading...</p> : null}
              {form.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.image}
                  alt="Service preview"
                  className="mt-3 h-28 w-full rounded-lg object-cover"
                />
              ) : null}
            </div>
            <input
              className="input-field"
              placeholder="Image URL (optional override)"
              value={form.image}
              onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
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
            <button type="submit" className="btn-primary" disabled={saving || uploading}>
              {saving ? "Saving..." : editingId ? "Update" : "Add Service"}
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
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Active</th>
                  <th className="px-4 py-3">Order</th>
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
                      No services yet.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} className="border-t border-slate-100">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {row.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={row.image}
                              alt=""
                              className="h-12 w-16 rounded object-cover"
                            />
                          ) : null}
                          <div>
                            <p className="font-medium text-primary">{row.title}</p>
                            <p className="text-xs text-slate-500">{row.short_text}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{row.is_active ? "Yes" : "No"}</td>
                      <td className="px-4 py-3">{row.sort_order}</td>
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
