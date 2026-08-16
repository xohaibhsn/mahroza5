import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { CONTENT_SECTION_MAP } from "@/lib/contentSections";
import { getPool } from "@/lib/db";

export type SectionContentRow = RowDataPacket & {
  id?: number;
  section: string;
  key: string;
  value: string | null;
};

/** Flat app keys → live DB section + key */
const FLAT_TO_SECTION_KEY: Record<string, { section: string; key: string }> = {
  phone: { section: "settings", key: "phone" },
  whatsapp: { section: "settings", key: "whatsapp" },
  address1: { section: "settings", key: "address1" },
  address2: { section: "settings", key: "address2" },
  office1: { section: "settings", key: "address1" },
  office2: { section: "settings", key: "address2" },
  email: { section: "settings", key: "email" },
  logo_url: { section: "settings", key: "logo_url" },
  favicon_url: { section: "settings", key: "favicon_url" },
  og_image_url: { section: "settings", key: "og_image_url" },
  site_title: { section: "settings", key: "site_title" },
  meta_description: { section: "settings", key: "meta_description" },
  facebook_url: { section: "settings", key: "facebook_url" },
  instagram_url: { section: "settings", key: "instagram_url" },
  twitter_url: { section: "settings", key: "twitter_url" },
  tiktok_url: { section: "settings", key: "tiktok_url" },
  about_text: { section: "about", key: "description" },
};

for (const [section, keys] of Object.entries(CONTENT_SECTION_MAP)) {
  for (const [localKey, flatKey] of Object.entries(keys)) {
    FLAT_TO_SECTION_KEY[flatKey] = { section, key: localKey };
  }
}

export function resolveContentTarget(flatKey: string): { section: string; key: string } | null {
  return FLAT_TO_SECTION_KEY[flatKey] || null;
}

/** Build both section.key and flat keys (hero_heading, logo_url, …) */
export function rowsToFlatMap(rows: SectionContentRow[]): Record<string, string> {
  const map: Record<string, string> = {};

  for (const row of rows) {
    const section = String(row.section || "").trim();
    const key = String(row.key || "").trim();
    const value = row.value == null ? "" : String(row.value);
    if (!section || !key) continue;

    const dotted = `${section}.${key}`;
    if (!map[dotted] || value) map[dotted] = value;

    // settings.phone → phone
    if (section === "settings") {
      if (!map[key] || value) map[key] = value;
    }

    // hero.heading → hero_heading via CONTENT_SECTION_MAP
    const sectionMap = CONTENT_SECTION_MAP[section as keyof typeof CONTENT_SECTION_MAP] as
      | Record<string, string>
      | undefined;
    const flat = sectionMap?.[key];
    if (flat && (!map[flat] || value)) map[flat] = value;

    // about.description also as about_text
    if (section === "about" && key === "description") {
      if (!map.about_text || value) map.about_text = value;
      if (!map.about_description || value) map.about_description = value;
    }
  }

  // aliases
  if (map.address1) map.office1 = map.address1;
  if (map.address2) map.office2 = map.address2;

  return map;
}

export async function loadContentRows(): Promise<SectionContentRow[]> {
  const pool = getPool();
  const [rows] = await pool.execute("SELECT section, `key`, value FROM content");
  return rows as SectionContentRow[];
}

export async function loadContentMap(): Promise<Record<string, string>> {
  return rowsToFlatMap(await loadContentRows());
}

export async function upsertSectionValue(section: string, key: string, value: string) {
  const pool = getPool();
  await pool.execute(
    `INSERT INTO content (section, \`key\`, value)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE value = VALUES(value)`,
    [section, key, value]
  );
}

export async function upsertFlatContent(flatKey: string, value: string): Promise<boolean> {
  const target = resolveContentTarget(flatKey);
  if (!target) return false;
  await upsertSectionValue(target.section, target.key, value);
  return true;
}

/** Ensure logo/favicon keys exist even if older DBs never seeded them */
export async function ensureSettingsKeys(
  keys: string[] = [
    "logo_url",
    "favicon_url",
    "og_image_url",
    "site_title",
    "meta_description",
    "facebook_url",
    "instagram_url",
    "twitter_url",
    "tiktok_url",
  ]
) {
  const pool = getPool();
  for (const key of keys) {
    await pool.execute(
      `INSERT IGNORE INTO content (section, \`key\`, value) VALUES ('settings', ?, '')`,
      [key]
    );
  }
}

export type { ResultSetHeader };
