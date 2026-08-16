import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdminJwt } from "@/lib/adminApiAuth";
import { contentDbKey, groupContent } from "@/lib/contentSections";
import {
  loadContentRows,
  rowsToFlatMap,
  upsertFlatContent,
  upsertSectionValue,
  type SectionContentRow,
} from "@/lib/contentStore";

const EMPTY_CONTENT = {
  hero: {
    heading: "",
    subheading: "",
    button_text: "",
    slide_1: "",
    slide_2: "",
    slide_3: "",
    slide_4: "",
  },
  about: { heading: "", description: "" },
  stats: { patients: "", services: "", availability: "", city: "" },
  why_choose_us: { point_1: "", point_2: "", point_3: "", point_4: "" },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdminJwt(req, res)) return;

  if (req.method === "GET") {
    try {
      const rows = await loadContentRows();
      const map = rowsToFlatMap(rows as SectionContentRow[]);
      return res.status(200).json(groupContent(map));
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

      if (!section && req.body && typeof req.body === "object") {
        const updates =
          req.body?.data && typeof req.body.data === "object" ? req.body.data : req.body;
        for (const [flatKey, flatValue] of Object.entries(updates)) {
          if (typeof flatValue !== "string") continue;
          if (["section", "key", "value"].includes(flatKey)) continue;
          await upsertFlatContent(flatKey, flatValue.trim());
        }
        return res.status(200).json({ success: true });
      }

      const dbKey = contentDbKey(section, key);
      if (!dbKey) {
        return res.status(400).json({ error: "Valid section and key are required." });
      }

      await upsertSectionValue(section, key, value.trim());

      if (dbKey === "about_description") {
        await upsertFlatContent("about_text", value.trim());
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
