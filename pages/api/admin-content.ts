import type { NextApiRequest, NextApiResponse } from "next";
import { methodNotAllowed, requireAdmin } from "@/lib/adminAuth";
import { ensureAdminSchema, type ContentRow } from "@/lib/adminSchema";
import { getPool } from "@/lib/db";

const CONTENT_KEYS = [
  "hero_heading",
  "hero_subheading",
  "about_text",
  "stat_patients",
  "stat_services",
  "stat_availability",
  "stat_location",
] as const;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = requireAdmin(req, res);
  if (!admin) return;

  try {
    await ensureAdminSchema();
    const pool = getPool();

    if (req.method === "GET") {
      const [rows] = await pool.query(
        `SELECT id, content_key, content_value, updated_at
         FROM content
         WHERE content_key IN (
           'hero_heading','hero_subheading','about_text',
           'stat_patients','stat_services','stat_availability','stat_location'
         )`
      );

      const map: Record<string, string> = {};
      for (const row of rows as ContentRow[]) {
        map[row.content_key] = row.content_value || "";
      }

      return res.status(200).json({ success: true, data: map, rows });
    }

    if (req.method === "PATCH") {
      const updates = req.body?.data && typeof req.body.data === "object" ? req.body.data : req.body;
      let changed = 0;

      for (const key of CONTENT_KEYS) {
        if (typeof updates?.[key] !== "string") continue;
        await pool.execute(
          `INSERT INTO content (content_key, content_value)
           VALUES (:key, :value)
           ON DUPLICATE KEY UPDATE content_value = VALUES(content_value)`,
          { key, value: updates[key].trim() }
        );
        changed += 1;
      }

      if (!changed) {
        return res.status(400).json({
          success: false,
          message: "No valid content fields provided.",
        });
      }

      return res.status(200).json({ success: true, message: "Content updated." });
    }

    return methodNotAllowed(res, ["GET", "PATCH"]);
  } catch (error) {
    console.error("admin-content error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}
