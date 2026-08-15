import { FormEvent, useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";

type SettingsForm = {
  phone: string;
  whatsapp: string;
  address1: string;
  address2: string;
  email: string;
  logo_url: string;
  favicon_url: string;
  site_title: string;
  meta_description: string;
};

const empty: SettingsForm = {
  phone: "",
  whatsapp: "",
  address1: "",
  address2: "",
  email: "",
  logo_url: "",
  favicon_url: "",
  site_title: "",
  meta_description: "",
};

async function uploadImage(file: File, folder: string) {
  const reader = new FileReader();
  const base64 = await new Promise<string>((resolve, reject) => {
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read image."));
    reader.readAsDataURL(file);
  });

  const res = await fetch("/api/upload-image", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64, folder }),
  });
  const data = await res.json();
  if (!res.ok || !data.url) {
    throw new Error(data.message || "Upload failed.");
  }
  return String(data.url);
}

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SettingsForm>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
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

  const persistPartial = async (partial: Partial<SettingsForm>) => {
    const next = { ...form, ...partial };
    setForm(next);
    const res = await fetch("/api/admin-settings", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Save failed.");
  };

  const onLogoUpload = async (file: File | null) => {
    if (!file) return;
    setUploadingLogo(true);
    setError(null);
    setMessage(null);
    try {
      const url = await uploadImage(file, "qhcare/branding");
      await persistPartial({ logo_url: url });
      setMessage("Logo uploaded and saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logo upload failed.");
    } finally {
      setUploadingLogo(false);
    }
  };

  const onFaviconUpload = async (file: File | null) => {
    if (!file) return;
    setUploadingFavicon(true);
    setError(null);
    setMessage(null);
    try {
      const url = await uploadImage(file, "qhcare/branding");
      await persistPartial({ favicon_url: url });
      setMessage("Favicon uploaded and saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Favicon upload failed.");
    } finally {
      setUploadingFavicon(false);
    }
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/admin-settings", {
        method: "PATCH",
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
        <form onSubmit={onSubmit} className="max-w-3xl space-y-6">
          <section className="rounded-2xl bg-white p-6 shadow-card">
            <h2 className="text-lg font-semibold text-primary">Branding</h2>
            <div className="mt-4 grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">Logo Upload</p>
                {form.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.logo_url}
                    alt="Current logo"
                    className="mb-3 h-16 w-auto max-w-full rounded border border-slate-100 bg-slate-50 object-contain p-2"
                  />
                ) : (
                  <p className="mb-3 text-xs text-slate-500">No logo uploaded yet.</p>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-slate-600"
                  onChange={(e) => onLogoUpload(e.target.files?.[0] || null)}
                />
                {uploadingLogo ? (
                  <p className="mt-1 text-xs text-secondary">Uploading logo...</p>
                ) : null}
                <button
                  type="button"
                  className="mt-2 text-xs font-semibold text-red-600"
                  onClick={() => persistPartial({ logo_url: "" }).catch((err) => setError(String(err.message || err)))}
                >
                  Remove logo
                </button>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">Favicon Upload</p>
                {form.favicon_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.favicon_url}
                    alt="Current favicon"
                    className="mb-3 h-12 w-12 rounded border border-slate-100 bg-slate-50 object-contain p-1"
                  />
                ) : (
                  <p className="mb-3 text-xs text-slate-500">Using default /favicon.ico</p>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-slate-600"
                  onChange={(e) => onFaviconUpload(e.target.files?.[0] || null)}
                />
                {uploadingFavicon ? (
                  <p className="mt-1 text-xs text-secondary">Uploading favicon...</p>
                ) : null}
                <button
                  type="button"
                  className="mt-2 text-xs font-semibold text-red-600"
                  onClick={() =>
                    persistPartial({ favicon_url: "" }).catch((err) =>
                      setError(String(err.message || err))
                    )
                  }
                >
                  Remove favicon
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl bg-white p-6 shadow-card">
            <h2 className="text-lg font-semibold text-primary">SEO & Contact</h2>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Site Title</label>
              <input
                className="input-field"
                value={form.site_title}
                onChange={(e) => setForm((f) => ({ ...f, site_title: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Meta Description
              </label>
              <textarea
                className="input-field"
                rows={3}
                value={form.meta_description}
                onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))}
              />
            </div>
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
          </section>

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
