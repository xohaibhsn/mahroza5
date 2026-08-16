import { FormEvent, useCallback, useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";

type SettingsForm = {
  site_title: string;
  meta_description: string;
  phone: string;
  whatsapp: string;
  address1: string;
  address2: string;
  email: string;
  logo_url: string;
  favicon_url: string;
};

const defaults: SettingsForm = {
  site_title: "QHC – Quality Health Care",
  meta_description:
    "Professional home healthcare services in Lahore. Nursing care, physiotherapy, doctor visits, and more.",
  phone: "+92 3004334065",
  whatsapp: "+92 3004334065",
  address1: "817, Al Hafeez Shopping Mall, Gulberg, Lahore",
  address2: "Office #5, Bismillah Plaza, Defense Road, Lahore",
  email: "info@qhcare.com.pk",
  logo_url: "",
  favicon_url: "",
};

async function uploadImage(file: File, folder: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  const res = await fetch("/api/upload-image", {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok || !data.url) throw new Error(data.message || data.error || "Upload failed.");
  return String(data.url);
}

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SettingsForm>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"logo" | "favicon" | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const applyRaw = (raw: Record<string, string>) => {
    setForm({
      site_title: raw.site_title || defaults.site_title,
      meta_description: raw.meta_description || defaults.meta_description,
      phone: raw.phone || defaults.phone,
      whatsapp: raw.whatsapp || defaults.whatsapp,
      address1: raw.address1 || raw.address_1 || defaults.address1,
      address2: raw.address2 || raw.address_2 || defaults.address2,
      email: raw.email || defaults.email,
      logo_url: String(raw.logo_url || "").trim(),
      favicon_url: String(raw.favicon_url || "").trim(),
    });
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin-settings", { credentials: "include" });
      const data = await res.json();
      const raw = (data?.data && typeof data.data === "object" ? data.data : data) as Record<
        string,
        string
      >;
      applyRaw(raw);
    } catch {
      setForm(defaults);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin-settings", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.error || data.message || "Save failed.");
      }
      applyRaw((data.data || data) as Record<string, string>);
      setMessage({ ok: true, text: "All settings saved. Logo/favicon will appear on the website." });
    } catch (err) {
      setMessage({
        ok: false,
        text: err instanceof Error ? err.message : "Save failed.",
      });
    } finally {
      setSaving(false);
    }
  };

  const saveOne = async (key: keyof SettingsForm) => {
    setMessage(null);
    try {
      const res = await fetch("/api/admin-settings", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: form[key] }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.error || data.message || "Save failed.");
      }
      applyRaw((data.data || data) as Record<string, string>);
      setMessage({ ok: true, text: `${key.replace(/_/g, " ")} saved.` });
    } catch (err) {
      setMessage({
        ok: false,
        text: err instanceof Error ? err.message : "Save failed.",
      });
    }
  };

  const onUpload = async (kind: "logo" | "favicon", file: File) => {
    setUploading(kind);
    setMessage(null);
    try {
      const url = await uploadImage(file, kind === "logo" ? "qhcare/logo" : "qhcare/favicon");
      const key = kind === "logo" ? "logo_url" : "favicon_url";
      setForm((f) => ({ ...f, [key]: url }));

      const res = await fetch("/api/admin-settings", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: url }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.error || data.message || "DB save failed after upload.");
      }
      applyRaw((data.data || data) as Record<string, string>);
      setMessage({
        ok: true,
        text: `${kind} uploaded to Cloudinary and saved to database. Refresh homepage to see it.`,
      });
    } catch (err) {
      setMessage({
        ok: false,
        text: err instanceof Error ? err.message : "Upload failed.",
      });
    } finally {
      setUploading(null);
    }
  };

  const fields: Array<{ key: keyof SettingsForm; label: string; multiline?: boolean }> = [
    { key: "site_title", label: "Site Title" },
    { key: "meta_description", label: "Meta Description", multiline: true },
    { key: "phone", label: "Phone" },
    { key: "whatsapp", label: "WhatsApp" },
    { key: "address1", label: "Address 1" },
    { key: "address2", label: "Address 2" },
    { key: "email", label: "Email" },
  ];

  return (
    <AdminLayout title="Settings">
      {loading ? (
        <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 shadow-card">
          Loading settings...
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-6 rounded-2xl bg-white p-6 shadow-card">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="mb-1 block text-sm font-medium text-slate-700">{field.label}</label>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                {field.multiline ? (
                  <textarea
                    className="input-field flex-1"
                    rows={3}
                    value={form[field.key]}
                    onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                  />
                ) : (
                  <input
                    className="input-field flex-1"
                    value={form[field.key]}
                    onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                  />
                )}
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  onClick={() => saveOne(field.key)}
                >
                  Save
                </button>
              </div>
            </div>
          ))}

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Logo Upload</label>
              <input
                type="file"
                accept="image/*"
                disabled={uploading === "logo"}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onUpload("logo", file);
                }}
              />
              {uploading === "logo" ? (
                <p className="mt-2 text-xs text-secondary">Uploading logo...</p>
              ) : null}
              {form.logo_url ? (
                <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.logo_url}
                    alt="Logo preview"
                    className="h-16 bg-primary object-contain p-2"
                  />
                  <p className="mt-2 break-all text-[11px] text-slate-500">{form.logo_url}</p>
                </div>
              ) : (
                <p className="mt-2 text-xs text-slate-500">No logo set.</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Favicon Upload</label>
              <input
                type="file"
                accept="image/*"
                disabled={uploading === "favicon"}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onUpload("favicon", file);
                }}
              />
              {uploading === "favicon" ? (
                <p className="mt-2 text-xs text-secondary">Uploading favicon...</p>
              ) : null}
              {form.favicon_url ? (
                <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.favicon_url}
                    alt="Favicon preview"
                    className="h-10 w-10 object-contain"
                  />
                  <p className="mt-2 break-all text-[11px] text-slate-500">{form.favicon_url}</p>
                </div>
              ) : (
                <p className="mt-2 text-xs text-slate-500">No favicon set.</p>
              )}
            </div>
          </div>

          {message ? (
            <p className={`text-sm ${message.ok ? "text-emerald-600" : "text-red-600"}`}>
              {message.text}
            </p>
          ) : null}

          <button type="submit" className="btn-primary" disabled={saving || Boolean(uploading)}>
            {saving ? "Saving..." : "Save All"}
          </button>
        </form>
      )}
    </AdminLayout>
  );
}
