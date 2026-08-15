import type { NextApiRequest, NextApiResponse } from "next";
import { methodNotAllowed, requireAdmin } from "@/lib/adminAuth";
import { ensureAdminSchema, type ContentRow } from "@/lib/adminSchema";
import { contentDbKey, groupContent } from "@/lib/contentSections";
import { getPool } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = requireAdmin(req, res);
  if (!admin) return;

  try {
    await ensureAdminSchema();
    const pool = getPool();

    if (req.method === "GET") {
      const [rows] = await pool.query(`SELECT content_key, content_value FROM content`);
      const map: Record<string, string> = {};
      for (const row of rows as ContentRow[]) {
        map[row.content_key] = row.content_value || "";
      }

      return res.status(200).json({
        success: true,
        data: groupContent(map),
        flat: map,
      });
    }

    if (req.method === "PATCH") {
      const section = String(req.body?.section || "").trim();
      const key = String(req.body?.key || "").trim();
      const value = typeof req.body?.value === "string" ? req.body.value : "";

      // Support bulk flat updates for backward compatibility
      if (!section && req.body && typeof req.body === "object") {
        const updates = req.body?.data && typeof req.body.data === "object" ? req.body.data : req.body;
        let changed = 0;
        for (const [flatKey, flatValue] of Object.entries(updates)) {
          if (typeof flatValue !== "string") continue;
          if (["section", "key", "value"].includes(flatKey)) continue;
          await pool.execute(
            `INSERT INTO content (content_key, content_value)
             VALUES (:key, :value)
             ON DUPLICATE KEY UPDATE content_value = VALUES(content_value)`,
            { key: flatKey, value: flatValue.trim() }
          );
          changed += 1;
        }
        if (!changed) {
          return res.status(400).json({ success: false, message: "No valid fields provided." });
        }
        return res.status(200).json({ success: true, message: "Content updated." });
      }

      const dbKey = contentDbKey(section, key);
      if (!dbKey) {
        return res.status(400).json({
          success: false,
          message: "Valid section and key are required.",
        });
      }

      await pool.execute(
        `INSERT INTO content (content_key, content_value)
         VALUES (:key, :value)
         ON DUPLICATE KEY UPDATE content_value = VALUES(content_value)`,
        { key: dbKey, value: value.trim() }
      );

      // Keep legacy about_text in sync
      if (dbKey === "about_description") {
        await pool.execute(
          `INSERT INTO content (content_key, content_value)
           VALUES ('about_text', :value)
           ON DUPLICATE KEY UPDATE content_value = VALUES(content_value)`,
          { value: value.trim() }
        );
      }

      return res.status(200).json({
        success: true,
        message: "Content updated.",
        section,
        key,
        dbKey,
      });
    }

    return methodNotAllowed(res, ["GET", "PATCH"]);
  } catch (error) {
    console.error("admin-content error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}
