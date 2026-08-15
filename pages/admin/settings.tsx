import { FormEvent, useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";

type SettingsForm = {
  phone: string;
  whatsapp: string;
  address1: string;
  address2: string;
  email: string;
};

const empty: SettingsForm = {
  phone: "",
  whatsapp: "",
  address1: "",
  address2: "",
  email: "",
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SettingsForm>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin-settings", { credentials: "include" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load settings.");
        setForm({ ...empty, ...(data.data || {}) });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/admin-settings", { method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Save failed.");
      setMessage("Settings saved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Settings">
      {loading ? (
        <p className="text-sm text-slate-500">Loading settings...</p>
      ) : (
        <form onSubmit={onSubmit} className="max-w-2xl space-y-4 rounded-2xl bg-white p-6 shadow-card">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Phone</label>
            <input
              className="input-field"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">WhatsApp</label>
            <input
              className="input-field"
              value={form.whatsapp}
              onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Address 1</label>
            <textarea
              className="input-field"
              rows={2}
              value={form.address1}
              onChange={(e) => setForm((f) => ({ ...f, address1: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Address 2</label>
            <textarea
              className="input-field"
              rows={2}
              value={form.address2}
              onChange={(e) => setForm((f) => ({ ...f, address2: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
            <input
              className="input-field"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>

          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}
          {message ? (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>
          ) : null}

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </form>
      )}
    </AdminLayout>
  );
}
