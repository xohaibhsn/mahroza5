import type { NextApiRequest, NextApiResponse } from "next";
import type { ResultSetHeader } from "mysql2";
import { requireAdminJwt } from "@/lib/adminApiAuth";
import { getPool } from "@/lib/db";

const SETTINGS_DEFAULTS = {
  site_title: "QHC - Quality Health Care",
  meta_description: "Professional home healthcare services in Lahore",
  phone: "+92 3004334065",
  whatsapp: "+92 3004334065",
  address1: "817, Al Hafeez Shopping Mall, Gulberg, Lahore",
  address2: "Office #5, Bismillah Plaza, Defense Road, Lahore",
  email: "info@qhcare.com.pk",
  logo_url: "",
  favicon_url: "",
};

const SETTINGS_KEYS = Object.keys(SETTINGS_DEFAULTS) as Array<keyof typeof SETTINGS_DEFAULTS>;

/** Works even if UNIQUE key is missing on content_key */
async function upsertContent(key: string, value: string) {
  const pool = getPool();
  const [updateResult] = await pool.execute(
    `UPDATE content SET content_value = ? WHERE content_key = ?`,
    [value, key]
  );
  const updated = (updateResult as ResultSetHeader).affectedRows || 0;
  if (updated > 0) return;

  try {
    await pool.execute(
      `INSERT INTO content (content_key, content_value) VALUES (?, ?)`,
      [key, value]
    );
  } catch {
    // Race / duplicate: force update
    await pool.execute(
      `UPDATE content SET content_value = ? WHERE content_key = ?`,
      [value, key]
    );
  }
}

async function readSettings() {
  const pool = getPool();
  const [rows] = await pool.execute(
    `SELECT content_key, content_value FROM content
     WHERE content_key IN (
       'phone','whatsapp','address1','address2','address_1','address_2',
       'office1','office2','email','logo_url','favicon_url','site_title','meta_description'
     )`
  );

  const map: Record<string, string> = {};
  for (const row of rows as Array<{ content_key: string; content_value: string | null }>) {
    // Last non-empty value wins if duplicates exist
    const prev = map[row.content_key];
    const next = row.content_value || "";
    if (!prev || next) map[row.content_key] = next;
  }

  return {
    site_title: map.site_title || SETTINGS_DEFAULTS.site_title,
    meta_description: map.meta_description || SETTINGS_DEFAULTS.meta_description,
    phone: map.phone || SETTINGS_DEFAULTS.phone,
    whatsapp: map.whatsapp || SETTINGS_DEFAULTS.whatsapp,
    address1: map.address1 || map.address_1 || map.office1 || SETTINGS_DEFAULTS.address1,
    address2: map.address2 || map.address_2 || map.office2 || SETTINGS_DEFAULTS.address2,
    email: map.email || SETTINGS_DEFAULTS.email,
    logo_url: (map.logo_url || "").trim(),
    favicon_url: (map.favicon_url || "").trim(),
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdminJwt(req, res)) return;

  if (req.method === "GET") {
    try {
      const settings = await readSettings();
      return res.status(200).json({ success: true, ...settings, data: settings });
    } catch (error) {
      console.error("admin-settings GET:", error);
      return res.status(200).json({
        success: true,
        ...SETTINGS_DEFAULTS,
        data: SETTINGS_DEFAULTS,
        warning: error instanceof Error ? error.message : "DB read failed",
      });
    }
  }

  if (req.method === "PATCH") {
    try {
      const updates =
        req.body?.data && typeof req.body.data === "object" ? req.body.data : req.body || {};

      if (typeof updates.address_1 === "string" && typeof updates.address1 !== "string") {
        updates.address1 = updates.address_1;
      }
      if (typeof updates.address_2 === "string" && typeof updates.address2 !== "string") {
        updates.address2 = updates.address_2;
      }

      let changed = 0;
      const saved: string[] = [];

      for (const key of SETTINGS_KEYS) {
        if (typeof updates[key] !== "string") continue;
        const value = String(updates[key]).trim();
        await upsertContent(key, value);
        saved.push(key);
        changed += 1;

        if (key === "address1") await upsertContent("office1", value);
        if (key === "address2") await upsertContent("office2", value);
      }

      if (!changed) {
        return res.status(400).json({
          success: false,
          error: "No valid settings fields provided.",
          receivedKeys: Object.keys(updates || {}),
        });
      }

      const settings = await readSettings();
      return res.status(200).json({
        success: true,
        message: `Saved: ${saved.join(", ")}`,
        ...settings,
        data: settings,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Save failed";
      console.error("admin-settings PATCH:", error);
      return res.status(500).json({
        success: false,
        error: message,
        message,
      });
    }
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
