import { FormEvent, useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";

type ContentForm = {
  hero_heading: string;
  hero_subheading: string;
  about_text: string;
  stat_patients: string;
  stat_services: string;
  stat_availability: string;
  stat_location: string;
};

const empty: ContentForm = {
  hero_heading: "",
  hero_subheading: "",
  about_text: "",
  stat_patients: "",
  stat_services: "",
  stat_availability: "",
  stat_location: "",
};

export default function AdminContentPage() {
  const [form, setForm] = useState<ContentForm>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin-content", { credentials: "include" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load content.");
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
      const res = await fetch("/api/admin-content", { credentials: "include", method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Save failed.");
      setMessage("Content saved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Content">
      {loading ? (
        <p className="text-sm text-slate-500">Loading content...</p>
      ) : (
        <form onSubmit={onSubmit} className="max-w-3xl space-y-5 rounded-2xl bg-white p-6 shadow-card">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Hero Heading</label>
            <input
              className="input-field"
              value={form.hero_heading}
              onChange={(e) => setForm((f) => ({ ...f, hero_heading: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Hero Subheading
            </label>
            <textarea
              className="input-field"
              rows={3}
              value={form.hero_subheading}
              onChange={(e) => setForm((f) => ({ ...f, hero_subheading: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">About Text</label>
            <textarea
              className="input-field"
              rows={5}
              value={form.about_text}
              onChange={(e) => setForm((f) => ({ ...f, about_text: e.target.value }))}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Stat — Patients
              </label>
              <input
                className="input-field"
                value={form.stat_patients}
                onChange={(e) => setForm((f) => ({ ...f, stat_patients: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Stat — Services
              </label>
              <input
                className="input-field"
                value={form.stat_services}
                onChange={(e) => setForm((f) => ({ ...f, stat_services: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Stat — Availability
              </label>
              <input
                className="input-field"
                value={form.stat_availability}
                onChange={(e) => setForm((f) => ({ ...f, stat_availability: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Stat — Location
              </label>
              <input
                className="input-field"
                value={form.stat_location}
                onChange={(e) => setForm((f) => ({ ...f, stat_location: e.target.value }))}
              />
            </div>
          </div>

          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}
          {message ? (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>
          ) : null}

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Content"}
          </button>
        </form>
      )}
    </AdminLayout>
  );
}
