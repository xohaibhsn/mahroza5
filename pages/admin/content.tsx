import { useCallback, useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";

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
};

const FIELDS: FieldDef[] = [
  { section: "hero", key: "heading", label: "Hero Heading" },
  { section: "hero", key: "subheading", label: "Hero Subheading", multiline: true },
  { section: "hero", key: "button_text", label: "Hero Button Text" },
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

export default function AdminContentPage() {
  const [groups, setGroups] = useState<ContentGroups>(emptyGroups());
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, { ok: boolean; text: string }>>({});
  const [error, setError] = useState<string | null>(null);

  const fieldId = (section: string, key: string) => `${section}.${key}`;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin-content", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load content.");
      const next = { ...emptyGroups(), ...(data.data || {}) } as ContentGroups;
      setGroups(next);
      const nextDrafts: Record<string, string> = {};
      for (const field of FIELDS) {
        nextDrafts[fieldId(field.section, field.key)] = next[field.section]?.[field.key] || "";
      }
      setDrafts(nextDrafts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveField = async (field: FieldDef) => {
    const id = fieldId(field.section, field.key);
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
          value: drafts[id] ?? "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Save failed.");
      setGroups((g) => ({
        ...g,
        [field.section]: {
          ...g[field.section],
          [field.key]: drafts[id] ?? "",
        },
      }));
      setMessages((m) => ({ ...m, [id]: { ok: true, text: "Saved." } }));
    } catch (err) {
      setMessages((m) => ({
        ...m,
        [id]: { ok: false, text: err instanceof Error ? err.message : "Save failed." },
      }));
    } finally {
      setSavingKey(null);
    }
  };

  const sections: Array<{ title: string; keys: FieldDef[] }> = [
    { title: "Hero Section", keys: FIELDS.filter((f) => f.section === "hero") },
    { title: "About Section", keys: FIELDS.filter((f) => f.section === "about") },
    { title: "Stats Section", keys: FIELDS.filter((f) => f.section === "stats") },
    { title: "Why Choose Us", keys: FIELDS.filter((f) => f.section === "why_choose_us") },
  ];

  return (
    <AdminLayout title="Content">
      {error ? (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
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
                      {field.multiline ? (
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
                          disabled={savingKey === id}
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
