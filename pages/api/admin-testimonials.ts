import type { NextApiRequest, NextApiResponse } from "next";
import type { ResultSetHeader } from "mysql2";
import { methodNotAllowed, requireAdmin } from "@/lib/adminAuth";
import { ensureAdminSchema, type TestimonialRow } from "@/lib/adminSchema";
import { getPool } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = requireAdmin(req, res);
  if (!admin) return;

  try {
    await ensureAdminSchema();
    const pool = getPool();

    if (req.method === "GET") {
      const [rows] = await pool.query(
        `SELECT id, name, role, quote, is_active, sort_order, created_at
         FROM testimonials
         ORDER BY sort_order ASC, id DESC`
      );
      return res.status(200).json({ success: true, data: rows as TestimonialRow[] });
    }

    if (req.method === "POST") {
      const name = String(req.body?.name || "").trim();
      const role = String(req.body?.role || "").trim();
      const quote = String(req.body?.quote || "").trim();
      const is_active = req.body?.is_active === false || req.body?.is_active === 0 ? 0 : 1;
      const sort_order = Number(req.body?.sort_order || 0);

      if (!name || !quote) {
        return res.status(400).json({
          success: false,
          message: "Name and quote are required.",
        });
      }

      const [result] = await pool.execute(
        `INSERT INTO testimonials (name, role, quote, is_active, sort_order)
         VALUES (:name, :role, :quote, :is_active, :sort_order)`,
        {
          name,
          role: role || null,
          quote,
          is_active,
          sort_order: Number.isFinite(sort_order) ? sort_order : 0,
        }
      );

      return res.status(201).json({
        success: true,
        id: (result as ResultSetHeader).insertId,
        message: "Testimonial created.",
      });
    }

    if (req.method === "PATCH") {
      const id = Number(req.body?.id);
      const name = String(req.body?.name || "").trim();
      const role = String(req.body?.role || "").trim();
      const quote = String(req.body?.quote || "").trim();
      const is_active = req.body?.is_active === false || req.body?.is_active === 0 ? 0 : 1;
      const sort_order = Number(req.body?.sort_order || 0);

      if (!id || !name || !quote) {
        return res.status(400).json({
          success: false,
          message: "id, name, and quote are required.",
        });
      }

      const [result] = await pool.execute(
        `UPDATE testimonials
         SET name = :name,
             role = :role,
             quote = :quote,
             is_active = :is_active,
             sort_order = :sort_order
         WHERE id = :id`,
        {
          id,
          name,
          role: role || null,
          quote,
          is_active,
          sort_order: Number.isFinite(sort_order) ? sort_order : 0,
        }
      );

      if ((result as ResultSetHeader).affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Testimonial not found." });
      }

      return res.status(200).json({ success: true, message: "Testimonial updated." });
    }

    if (req.method === "DELETE") {
      const id = Number(req.body?.id ?? req.query.id);
      if (!id) {
        return res.status(400).json({ success: false, message: "id is required." });
      }

      const [result] = await pool.execute(`DELETE FROM testimonials WHERE id = :id`, { id });
      if ((result as ResultSetHeader).affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Testimonial not found." });
      }

      return res.status(200).json({ success: true, message: "Testimonial deleted." });
    }

    return methodNotAllowed(res, ["GET", "POST", "PATCH", "DELETE"]);
  } catch (error) {
    console.error("admin-testimonials error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}
