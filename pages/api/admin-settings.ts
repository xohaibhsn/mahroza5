import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdminJwt } from "@/lib/adminApiAuth";
import pool from "@/lib/db";

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

async function readSettings() {
  const [rows] = await pool.execute(
    `SELECT content_key, content_value FROM content
     WHERE content_key IN (
       'phone','whatsapp','address1','address2','address_1','address_2',
       'office1','office2','email','logo_url','favicon_url','site_title','meta_description'
     )`
  );

  const map: Record<string, string> = {};
  for (const row of rows as Array<{ content_key: string; content_value: string | null }>) {
    map[row.content_key] = row.content_value || "";
  }

  return {
    site_title: map.site_title || SETTINGS_DEFAULTS.site_title,
    meta_description: map.meta_description || SETTINGS_DEFAULTS.meta_description,
    phone: map.phone || SETTINGS_DEFAULTS.phone,
    whatsapp: map.whatsapp || SETTINGS_DEFAULTS.whatsapp,
    address1: map.address1 || map.address_1 || map.office1 || SETTINGS_DEFAULTS.address1,
    address2: map.address2 || map.address_2 || map.office2 || SETTINGS_DEFAULTS.address2,
    email: map.email || SETTINGS_DEFAULTS.email,
    logo_url: map.logo_url || "",
    favicon_url: map.favicon_url || "",
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdminJwt(req, res)) return;

  if (req.method === "GET") {
    try {
      const settings = await readSettings();
      return res.status(200).json({ success: true, ...settings, data: settings });
    } catch (error) {
      console.error("admin-settings GET fallback:", error);
      return res.status(200).json({ success: true, ...SETTINGS_DEFAULTS, data: SETTINGS_DEFAULTS });
    }
  }

  if (req.method === "PATCH") {
    try {
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
        const value = updates[key].trim();
        await pool.execute(
          `INSERT INTO content (content_key, content_value)
           VALUES (?, ?)
           ON DUPLICATE KEY UPDATE content_value = VALUES(content_value)`,
          [key, value]
        );
        if (key === "address1") {
          await pool.execute(
            `INSERT INTO content (content_key, content_value)
             VALUES ('office1', ?)
             ON DUPLICATE KEY UPDATE content_value = VALUES(content_value)`,
            [value]
          );
        }
        if (key === "address2") {
          await pool.execute(
            `INSERT INTO content (content_key, content_value)
             VALUES ('office2', ?)
             ON DUPLICATE KEY UPDATE content_value = VALUES(content_value)`,
            [value]
          );
        }
        changed += 1;
      }

      if (!changed) {
        return res.status(400).json({ success: false, error: "No valid settings fields provided." });
      }

      const settings = await readSettings();
      return res.status(200).json({ success: true, ...settings, data: settings });
    } catch (error) {
      console.error("admin-settings PATCH error:", error);
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Save failed",
      });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
