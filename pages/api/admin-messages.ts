import type { NextApiRequest, NextApiResponse } from "next";
import type { ResultSetHeader } from "mysql2";
import { methodNotAllowed, requireAdmin } from "@/lib/adminAuth";
import { ensureAdminSchema, type MessageRow } from "@/lib/adminSchema";
import { getPool } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = requireAdmin(req, res);
  if (!admin) return;

  try {
    await ensureAdminSchema();
    const pool = getPool();

    if (req.method === "GET") {
      const [rows] = await pool.query(
        `SELECT id, name, email, phone, message, is_read, created_at
         FROM messages
         ORDER BY created_at DESC`
      );
      return res.status(200).json({ success: true, data: rows as MessageRow[] });
    }

    if (req.method === "PATCH") {
      const id = Number(req.body?.id);
      if (!id) {
        return res.status(400).json({ success: false, message: "id is required." });
      }

      const is_read = req.body?.is_read === false || req.body?.is_read === 0 ? 0 : 1;
      const [result] = await pool.execute(
        `UPDATE messages SET is_read = :is_read WHERE id = :id`,
        { id, is_read }
      );

      if ((result as ResultSetHeader).affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Message not found." });
      }

      return res.status(200).json({ success: true, message: "Message updated." });
    }

    if (req.method === "DELETE") {
      const id = Number(req.body?.id ?? req.query.id);
      if (!id) {
        return res.status(400).json({ success: false, message: "id is required." });
      }

      const [result] = await pool.execute(`DELETE FROM messages WHERE id = :id`, { id });
      if ((result as ResultSetHeader).affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Message not found." });
      }

      return res.status(200).json({ success: true, message: "Message deleted." });
    }

    return methodNotAllowed(res, ["GET", "PATCH", "DELETE"]);
  } catch (error) {
    console.error("admin-messages error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}
