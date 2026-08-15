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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = requireAdmin(req, res);
  if (!admin) return;

  try {
    await ensureAdminSchema();
    const pool = getPool();

    if (req.method === "GET") {
      const [rows] = await pool.query(
        `SELECT content_key, content_value
         FROM content
         WHERE content_key IN (
           'phone','whatsapp','address1','address2','office1','office2','email',
           'logo_url','favicon_url','site_title','meta_description'
         )`
      );

      const map: Record<string, string> = {};
      for (const row of rows as ContentRow[]) {
        map[row.content_key] = row.content_value || "";
      }

      return res.status(200).json({
        success: true,
        data: {
          phone: map.phone || "",
          whatsapp: map.whatsapp || "",
          address1: map.address1 || map.office1 || "",
          address2: map.address2 || map.office2 || "",
          email: map.email || "",
          logo_url: map.logo_url || "",
          favicon_url: map.favicon_url || "",
          site_title: map.site_title || "",
          meta_description: map.meta_description || "",
        },
      });
    }

    if (req.method === "PATCH") {
      const updates = req.body?.data && typeof req.body.data === "object" ? req.body.data : req.body;
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
