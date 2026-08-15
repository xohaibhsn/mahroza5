import type { NextApiRequest, NextApiResponse } from "next";
import { methodNotAllowed, requireAdmin } from "@/lib/adminAuth";
import { ensureAdminSchema, type ContentRow } from "@/lib/adminSchema";
import { getPool } from "@/lib/db";

const SETTINGS_KEYS = [
  "phone",
  "whatsapp",
  "address1",
  "address2",
  "email",
  "logo_url",
  "favicon_url",
  "site_title",
  "meta_description",
] as const;

const SETTINGS_DEFAULTS: Record<(typeof SETTINGS_KEYS)[number], string> = {
  phone: "+92 3004334065",
  whatsapp: "+92 3004334065",
  address1: "817, Al Hafeez Shopping Mall, Gulberg, Lahore",
  address2: "Office #5, Bismillah Plaza, Defense Road, Lahore",
  email: "info@qhcare.com.pk",
  logo_url: "",
  favicon_url: "",
  site_title: "QHC - Quality Health Care",
  meta_description: "Professional home healthcare services in Lahore",
};

async function ensureSettingsDefaults() {
  const pool = getPool();
  for (const [key, value] of Object.entries(SETTINGS_DEFAULTS)) {
    await pool.execute(
      `INSERT IGNORE INTO content (content_key, content_value) VALUES (:key, :value)`,
      { key, value }
    );
  }
}

function mapSettings(rows: ContentRow[]) {
  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.content_key] = row.content_value ?? "";
  }

  return {
    phone: map.phone || SETTINGS_DEFAULTS.phone,
    whatsapp: map.whatsapp || SETTINGS_DEFAULTS.whatsapp,
    address1: map.address1 || map.office1 || SETTINGS_DEFAULTS.address1,
    address2: map.address2 || map.office2 || SETTINGS_DEFAULTS.address2,
    email: map.email || SETTINGS_DEFAULTS.email,
    logo_url: map.logo_url || "",
    favicon_url: map.favicon_url || "",
    site_title: map.site_title || SETTINGS_DEFAULTS.site_title,
    meta_description: map.meta_description || SETTINGS_DEFAULTS.meta_description,
  };
}

function defaultsResponse(res: NextApiResponse) {
  return res.status(200).json({
    success: true,
    data: { ...SETTINGS_DEFAULTS },
    ...SETTINGS_DEFAULTS,
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = requireAdmin(req, res);
  if (!admin) return;

  if (req.method === "GET") {
    try {
      await ensureAdminSchema();
      const pool = getPool();
      await ensureSettingsDefaults();

      const [rows] = await pool.query(
        `SELECT content_key, content_value
         FROM content
         WHERE content_key IN (
           'phone','whatsapp','address1','address2','office1','office2','email',
           'logo_url','favicon_url','site_title','meta_description'
         )`
      );

      const data = mapSettings(rows as ContentRow[]);
      return res.status(200).json({
        success: true,
        data,
        ...data,
      });
    } catch (error) {
      console.error("admin-settings GET fallback:", error);
      return defaultsResponse(res);
    }
  }

  try {
    await ensureAdminSchema();
    const pool = getPool();

    if (req.method === "PATCH") {
      const updates = req.body?.data && typeof req.body.data === "object" ? req.body.data : req.body;
      if (typeof updates?.address_1 === "string" && typeof updates.address1 !== "string") {
        updates.address1 = updates.address_1;
      }
      if (typeof updates?.address_2 === "string" && typeof updates.address2 !== "string") {
        updates.address2 = updates.address_2;
      }
      let changed = 0;

      for (const key of SETTINGS_KEYS) {
        if (typeof updates?.[key] !== "string") continue;
        await pool.execute(
          `INSERT INTO content (content_key, content_value)
           VALUES (:key, :value)
           ON DUPLICATE KEY UPDATE content_value = VALUES(content_value)`,
          { key, value: updates[key].trim() }
        );

        if (key === "address1") {
          await pool.execute(
            `INSERT INTO content (content_key, content_value)
             VALUES ('office1', :value)
             ON DUPLICATE KEY UPDATE content_value = VALUES(content_value)`,
            { value: updates[key].trim() }
          );
        }
        if (key === "address2") {
          await pool.execute(
            `INSERT INTO content (content_key, content_value)
             VALUES ('office2', :value)
             ON DUPLICATE KEY UPDATE content_value = VALUES(content_value)`,
            { value: updates[key].trim() }
          );
        }

        changed += 1;
      }

      if (!changed) {
        return res.status(400).json({
          success: false,
          message: "No valid settings fields provided.",
        });
      }

      return res.status(200).json({ success: true, message: "Settings updated." });
    }

    return methodNotAllowed(res, ["GET", "PATCH"]);
  } catch (error) {
    console.error("admin-settings error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}
