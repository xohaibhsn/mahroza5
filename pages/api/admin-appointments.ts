import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdminJwt } from "@/lib/adminApiAuth";
import pool from "@/lib/db";

const ALLOWED_STATUS = new Set(["pending", "confirmed", "completed", "cancelled"]);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdminJwt(req, res)) return;

  if (req.method === "GET") {
    try {
      const status = String(req.query.status || "").toLowerCase();
      let rows;
      if (status && ALLOWED_STATUS.has(status)) {
        const [filtered] = await pool.execute(
          "SELECT * FROM appointments WHERE status = ? ORDER BY created_at DESC",
          [status]
        );
        rows = filtered;
      } else {
        const [all] = await pool.execute(
          "SELECT * FROM appointments ORDER BY created_at DESC"
        );
        rows = all;
      }
      return res.status(200).json(rows);
    } catch (error) {
      console.error("admin-appointments GET error:", error);
      return res.status(200).json([]);
    }
  }

  try {
    if (req.method === "PATCH") {
      const id = Number(req.body?.id);
      const status = String(req.body?.status || "").toLowerCase();
      if (!id || !ALLOWED_STATUS.has(status)) {
        return res.status(400).json({ error: "Valid id and status are required." });
      }
      await pool.execute(`UPDATE appointments SET status = ? WHERE id = ?`, [status, id]);
      return res.status(200).json({ success: true });
    }

    if (req.method === "DELETE") {
      const id = Number(req.body?.id ?? req.query.id);
      if (!id) return res.status(400).json({ error: "id is required." });
      await pool.execute(`DELETE FROM appointments WHERE id = ?`, [id]);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("admin-appointments error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Server error",
    });
  }
}
