import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdminJwt } from "@/lib/adminApiAuth";
import pool from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdminJwt(req, res)) return;

  if (req.method === "GET") {
    try {
      const [rows] = await pool.execute(
        "SELECT * FROM messages ORDER BY created_at DESC"
      );
      return res.status(200).json(rows);
    } catch (error) {
      console.error("admin-messages GET error:", error);
      return res.status(200).json([]);
    }
  }

  try {
    if (req.method === "PATCH") {
      const id = Number(req.body?.id);
      if (!id) return res.status(400).json({ error: "id is required." });
      const is_read = req.body?.is_read === false || req.body?.is_read === 0 ? 0 : 1;
      await pool.execute(`UPDATE messages SET is_read = ? WHERE id = ?`, [is_read, id]);
      return res.status(200).json({ success: true });
    }

    if (req.method === "DELETE") {
      const id = Number(req.body?.id ?? req.query.id);
      if (!id) return res.status(400).json({ error: "id is required." });
      await pool.execute(`DELETE FROM messages WHERE id = ?`, [id]);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("admin-messages error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Server error",
    });
  }
}
