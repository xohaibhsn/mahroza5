import type { NextApiRequest, NextApiResponse } from "next";
import type { ResultSetHeader } from "mysql2";
import { methodNotAllowed, requireAdmin } from "@/lib/adminAuth";
import { ensureAdminSchema, type AppointmentRow } from "@/lib/adminSchema";
import { getPool } from "@/lib/db";

const ALLOWED_STATUS = new Set(["pending", "confirmed", "completed", "cancelled"]);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = requireAdmin(req, res);
  if (!admin) return;

  try {
    await ensureAdminSchema();
    const pool = getPool();

    if (req.method === "GET") {
      const [rows] = await pool.query(
        `SELECT id, name, phone, service, message, status, created_at
         FROM appointments
         ORDER BY created_at DESC`
      );
      return res.status(200).json({ success: true, data: rows as AppointmentRow[] });
    }

    if (req.method === "PATCH") {
      const id = Number(req.body?.id);
      const status = String(req.body?.status || "").toLowerCase();

      if (!id || !ALLOWED_STATUS.has(status)) {
        return res.status(400).json({
          success: false,
          message: "Valid id and status are required.",
        });
      }

      const [result] = await pool.execute(
        `UPDATE appointments SET status = :status WHERE id = :id`,
        { id, status }
      );

      if ((result as ResultSetHeader).affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Appointment not found." });
      }

      return res.status(200).json({ success: true, message: "Status updated." });
    }

    if (req.method === "DELETE") {
      const id = Number(req.body?.id ?? req.query.id);
      if (!id) {
        return res.status(400).json({ success: false, message: "id is required." });
      }

      const [result] = await pool.execute(`DELETE FROM appointments WHERE id = :id`, {
        id,
      });

      if ((result as ResultSetHeader).affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Appointment not found." });
      }

      return res.status(200).json({ success: true, message: "Appointment deleted." });
    }

    return methodNotAllowed(res, ["GET", "PATCH", "DELETE"]);
  } catch (error) {
    console.error("admin-appointments error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}
