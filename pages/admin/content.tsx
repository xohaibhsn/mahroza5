import { useCallback, useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import AdminToast from "@/components/AdminToast";
import ImageSizeHint from "@/components/ImageSizeHint";

type ContentGroups = {
  hero: Record<string, string>;
  about: Record<string, string>;
  stats: Record<string, string>;
  why_choose_us: Record<string, string>;
};

type FieldDef = {
  section: keyof ContentGroups;
  key: string;
  label: string;
  multiline?: boolean;
  image?: boolean;
  imageSize?: string;
  imageNote?: string;
};

const FIELDS: FieldDef[] = [
  { section: "hero", key: "heading", label: "Hero Heading" },
  { section: "hero", key: "subheading", label: "Hero Subheading", multiline: true },
  { section: "hero", key: "button_text", label: "Hero Button Text" },
  {
    section: "hero",
    key: "slide_1",
    label: "Hero Slider Image 1",
    image: true,
    imageSize: "1200 × 900 px",
    imageNote: "JPG/WebP, landscape 4:3, homepage right slider",
  },
  {
    section: "hero",
    key: "slide_2",
    label: "Hero Slider Image 2",
    image: true,
    imageSize: "1200 × 900 px",
    imageNote: "JPG/WebP, landscape 4:3, homepage right slider",
  },
  {
    section: "hero",
    key: "slide_3",
    label: "Hero Slider Image 3",
    image: true,
    imageSize: "1200 × 900 px",
    imageNote: "JPG/WebP, landscape 4:3, homepage right slider",
  },
  {
    section: "hero",
    key: "slide_4",
    label: "Hero Slider Image 4",
    image: true,
    imageSize: "1200 × 900 px",
    imageNote: "JPG/WebP, landscape 4:3, homepage right slider",
  },
  { section: "about", key: "heading", label: "About Heading" },
  { section: "about", key: "description", label: "About Description", multiline: true },
  { section: "stats", key: "patients", label: "Patients count" },
  { section: "stats", key: "services", label: "Services count" },
  { section: "stats", key: "availability", label: "Availability" },
  { section: "stats", key: "city", label: "City" },
  { section: "why_choose_us", key: "point_1", label: "Why Choose Us — Point 1", multiline: true },
  { section: "why_choose_us", key: "point_2", label: "Why Choose Us — Point 2", multiline: true },
  { section: "why_choose_us", key: "point_3", label: "Why Choose Us — Point 3", multiline: true },
  { section: "why_choose_us", key: "point_4", label: "Why Choose Us — Point 4", multiline: true },
];

const emptyGroups = (): ContentGroups => ({
  hero: {},
  about: {},
  stats: {},
  why_choose_us: {},
});

async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", "qhcare/hero");
  const res = await fetch("/api/upload-image", {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok || !data.url) throw new Error(data.message || "Upload failed.");
  return String(data.url);
}

export default function AdminContentPage() {
  const [groups, setGroups] = useState<ContentGroups>(emptyGroups());
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, { ok: boolean; text: string }>>({});
  const [toast, setToast] = useState<{ ok: boolean; text: string } | null>(null);

  const fieldId = (section: string, key: string) => `${section}.${key}`;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin-content", { credentials: "include" });
      const data = await res.json();
      const grouped =
        data && typeof data === "object" && !Array.isArray(data) && (data.hero || data.about || data.data)
          ? data.data && data.hero === undefined
            ? data.data
            : data
          : {};
      const next = { ...emptyGroups(), ...grouped } as ContentGroups;
      setGroups(next);
      const nextDrafts: Record<string, string> = {};
      for (const field of FIELDS) {
        nextDrafts[fieldId(field.section, field.key)] =
          next[field.section]?.[field.key] || data?.[field.section]?.[field.key] || "";
      }
      setDrafts(nextDrafts);
    } catch {
      setGroups(emptyGroups());
      const nextDrafts: Record<string, string> = {};
      for (const field of FIELDS) {
        nextDrafts[fieldId(field.section, field.key)] = "";
      }
      setDrafts(nextDrafts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveField = async (field: FieldDef, valueOverride?: string) => {
    const id = fieldId(field.section, field.key);
    const value = valueOverride ?? drafts[id] ?? "";
    setSavingKey(id);
    setMessages((m) => ({ ...m, [id]: { ok: true, text: "" } }));
    try {
      const res = await fetch("/api/admin-content", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: field.section,
          key: field.key,
          value,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Save failed.");
      setDrafts((d) => ({ ...d, [id]: value }));
      setGroups((g) => ({
        ...g,
        [field.section]: {
          ...g[field.section],
          [field.key]: value,
        },
      }));
      setMessages((m) => ({ ...m, [id]: { ok: true, text: "Saved." } }));
      setToast({ ok: true, text: `${field.label} saved.` });
    } catch (err) {
      const text = err instanceof Error ? err.message : "Save failed.";
      setMessages((m) => ({
        ...m,
        [id]: { ok: false, text },
      }));
      setToast({ ok: false, text: `${field.label}: ${text}` });
    } finally {
      setSavingKey(null);
    }
  };

  const onUploadSlide = async (field: FieldDef, file: File) => {
    const id = fieldId(field.section, field.key);
    setUploadingKey(id);
    try {
      const url = await uploadImage(file);
      setDrafts((d) => ({ ...d, [id]: url }));
      await saveField(field, url);
    } catch (err) {
      setMessages((m) => ({
        ...m,
        [id]: { ok: false, text: err instanceof Error ? err.message : "Upload failed." },
      }));
    } finally {
      setUploadingKey(null);
    }
  };

  const sections: Array<{ title: string; keys: FieldDef[] }> = [
    { title: "Hero Section", keys: FIELDS.filter((f) => f.section === "hero" && !f.image) },
    { title: "Hero Slider Images (Homepage)", keys: FIELDS.filter((f) => f.image) },
    { title: "About Section", keys: FIELDS.filter((f) => f.section === "about") },
    { title: "Stats Section", keys: FIELDS.filter((f) => f.section === "stats") },
    { title: "Why Choose Us", keys: FIELDS.filter((f) => f.section === "why_choose_us") },
  ];

  return (
    <AdminLayout title="Content">
      {toast ? (
        <AdminToast ok={toast.ok} text={toast.text} onClose={() => setToast(null)} />
      ) : null}
      {loading ? (
        <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 shadow-card">
          Loading content...
        </div>
      ) : (
        <div className="space-y-6">
          {sections.map((section) => (
            <section key={section.title} className="rounded-2xl bg-white p-5 shadow-card">
              <h2 className="text-lg font-semibold text-primary">{section.title}</h2>
              <div className="mt-4 space-y-5">
                {section.keys.map((field) => {
                  const id = fieldId(field.section, field.key);
                  const msg = messages[id];
                  return (
                    <div key={id}>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        {field.label}
                      </label>
                      {field.image ? (
                        <div className="space-y-3">
                          <ImageSizeHint
                            size={field.imageSize || "1200 × 900 px"}
                            note={field.imageNote}
                          />
                          <input
                            className="input-field"
                            placeholder="Image URL"
                            value={drafts[id] ?? ""}
                            onChange={(e) =>
                              setDrafts((d) => ({ ...d, [id]: e.target.value }))
                            }
                          />
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingKey === id}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) onUploadSlide(field, file);
                            }}
                          />
                          {uploadingKey === id ? (
                            <p className="text-xs text-secondary">Uploading...</p>
                          ) : null}
                          {drafts[id] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={drafts[id]}
                              alt={field.label}
                              className="h-36 w-full max-w-md rounded-lg object-cover"
                            />
                          ) : null}
                        </div>
                      ) : field.multiline ? (
                        <textarea
                          className="input-field"
                          rows={3}
                          value={drafts[id] ?? ""}
                          onChange={(e) =>
                            setDrafts((d) => ({ ...d, [id]: e.target.value }))
                          }
                        />
                      ) : (
                        <input
                          className="input-field"
                          value={drafts[id] ?? ""}
                          onChange={(e) =>
                            setDrafts((d) => ({ ...d, [id]: e.target.value }))
                          }
                        />
                      )}
                      <div className="mt-2 flex items-center gap-3">
                        <button
                          type="button"
                          className="btn-primary px-4 py-2 text-sm"
                          disabled={savingKey === id || uploadingKey === id}
                          onClick={() => saveField(field)}
                        >
                          {savingKey === id ? "Saving..." : "Save"}
                        </button>
                        {msg?.text ? (
                          <span
                            className={`text-sm ${msg.ok ? "text-emerald-600" : "text-red-600"}`}
                          >
                            {msg.text}
                          </span>
                        ) : null}
                        {groups[field.section]?.[field.key] !== undefined &&
                        groups[field.section]?.[field.key] !== drafts[id] ? (
                          <span className="text-xs text-amber-600">Unsaved changes</span>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
