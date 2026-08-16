import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdminJwt } from "@/lib/adminApiAuth";
import { contentDbKey, groupContent } from "@/lib/contentSections";
import pool from "@/lib/db";

const EMPTY_CONTENT = {
  hero: { heading: "", subheading: "", button_text: "" },
  about: { heading: "", description: "" },
  stats: { patients: "", services: "", availability: "", city: "" },
  why_choose_us: { point_1: "", point_2: "", point_3: "", point_4: "" },
};

type ContentRow = {
  content_key?: string;
  content_value?: string | null;
  section?: string;
  key?: string;
  value?: string | null;
};

function rowsToGrouped(rows: ContentRow[]) {
  // Prefer explicit section/key/value columns if present
  const hasSectionCols = rows.some((r) => r.section && r.key);
  if (hasSectionCols) {
    const result: Record<string, Record<string, string>> = {};
    for (const row of rows) {
      const section = String(row.section || "");
      const key = String(row.key || "");
      if (!section || !key) continue;
      if (!result[section]) result[section] = {};
      result[section][key] = String(row.value ?? "");
    }
    return { ...EMPTY_CONTENT, ...result };
  }

  const map: Record<string, string> = {};
  for (const row of rows) {
    if (row.content_key) {
      map[row.content_key] = row.content_value || "";
    }
  }
  return groupContent(map);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdminJwt(req, res)) return;

  if (req.method === "GET") {
    try {
      const [rows] = await pool.execute("SELECT * FROM content");
      return res.status(200).json(rowsToGrouped(rows as ContentRow[]));
    } catch (error) {
      console.error("admin-content GET error:", error);
      return res.status(200).json(EMPTY_CONTENT);
    }
  }

  if (req.method === "PATCH") {
    try {
      const section = String(req.body?.section || "").trim();
      const key = String(req.body?.key || "").trim();
      const value = typeof req.body?.value === "string" ? req.body.value : "";

      // Bulk flat updates
      if (!section && req.body && typeof req.body === "object") {
        const updates =
          req.body?.data && typeof req.body.data === "object" ? req.body.data : req.body;
        for (const [flatKey, flatValue] of Object.entries(updates)) {
          if (typeof flatValue !== "string") continue;
          if (["section", "key", "value"].includes(flatKey)) continue;
          await pool.execute(
            `INSERT INTO content (content_key, content_value)
             VALUES (?, ?)
             ON DUPLICATE KEY UPDATE content_value = VALUES(content_value)`,
            [flatKey, flatValue.trim()]
          );
        }
        return res.status(200).json({ success: true });
      }

      const dbKey = contentDbKey(section, key);
      if (!dbKey) {
        return res.status(400).json({ error: "Valid section and key are required." });
      }

      await pool.execute(
        `INSERT INTO content (content_key, content_value)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE content_value = VALUES(content_value)`,
        [dbKey, value.trim()]
      );

      if (dbKey === "about_description") {
        await pool.execute(
          `INSERT INTO content (content_key, content_value)
           VALUES ('about_text', ?)
           ON DUPLICATE KEY UPDATE content_value = VALUES(content_value)`,
          [value.trim()]
        );
      }

      return res.status(200).json({ success: true, section, key, dbKey });
    } catch (error) {
      console.error("admin-content PATCH error:", error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Server error",
      });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
