import type { NextApiRequest, NextApiResponse } from "next";
import type { ResultSetHeader } from "mysql2";
import { methodNotAllowed, requireAdmin } from "@/lib/adminAuth";
import { ensureAdminSchema, type ServiceRow } from "@/lib/adminSchema";
import { getPool } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = requireAdmin(req, res);
  if (!admin) return;

  try {
    await ensureAdminSchema();
    const pool = getPool();

    if (req.method === "GET") {
      const [rows] = await pool.query(
        `SELECT id, title, short_text, description, icon, image, is_active, sort_order, created_at
         FROM services
         ORDER BY sort_order ASC, id ASC`
      );
      return res.status(200).json({ success: true, data: rows as ServiceRow[] });
    }

    if (req.method === "POST") {
      const title = String(req.body?.title || "").trim();
      const short_text = String(req.body?.short_text || "").trim();
      const description = String(req.body?.description || "").trim();
      const icon = String(req.body?.icon || "").trim();
      const image = String(req.body?.image || "").trim();
      const is_active = req.body?.is_active === false || req.body?.is_active === 0 ? 0 : 1;
      const sort_order = Number(req.body?.sort_order || 0);

      if (!title) {
        return res.status(400).json({ success: false, message: "Title is required." });
      }

      const [result] = await pool.execute(
        `INSERT INTO services (title, short_text, description, icon, image, is_active, sort_order)
         VALUES (:title, :short_text, :description, :icon, :image, :is_active, :sort_order)`,
        {
          title,
          short_text: short_text || null,
          description: description || null,
          icon: icon || null,
          image: image || null,
          is_active,
          sort_order: Number.isFinite(sort_order) ? sort_order : 0,
        }
      );

      return res.status(201).json({
        success: true,
        id: (result as ResultSetHeader).insertId,
        message: "Service created.",
      });
    }

    if (req.method === "PATCH") {
      const id = Number(req.body?.id);
      if (!id) {
        return res.status(400).json({ success: false, message: "id is required." });
      }

      // Support toggle-only updates
      if (typeof req.body?.is_active !== "undefined" && !req.body?.title) {
        const is_active = req.body?.is_active === false || req.body?.is_active === 0 ? 0 : 1;
        const [result] = await pool.execute(
          `UPDATE services SET is_active = :is_active WHERE id = :id`,
          { id, is_active }
        );
        if ((result as ResultSetHeader).affectedRows === 0) {
          return res.status(404).json({ success: false, message: "Service not found." });
        }
        return res.status(200).json({ success: true, message: "Service updated." });
      }

      const title = String(req.body?.title || "").trim();
      const short_text = String(req.body?.short_text || "").trim();
      const description = String(req.body?.description || "").trim();
      const icon = String(req.body?.icon || "").trim();
      const image = String(req.body?.image || "").trim();
      const is_active = req.body?.is_active === false || req.body?.is_active === 0 ? 0 : 1;
      const sort_order = Number(req.body?.sort_order || 0);

      if (!title) {
        return res.status(400).json({ success: false, message: "Title is required." });
      }

      const [result] = await pool.execute(
        `UPDATE services
         SET title = :title,
             short_text = :short_text,
             description = :description,
             icon = :icon,
             image = :image,
             is_active = :is_active,
             sort_order = :sort_order
         WHERE id = :id`,
        {
          id,
          title,
          short_text: short_text || null,
          description: description || null,
          icon: icon || null,
          image: image || null,
          is_active,
          sort_order: Number.isFinite(sort_order) ? sort_order : 0,
        }
      );

      if ((result as ResultSetHeader).affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Service not found." });
      }

      return res.status(200).json({ success: true, message: "Service updated." });
    }

    if (req.method === "DELETE") {
      const id = Number(req.body?.id ?? req.query.id);
      if (!id) {
        return res.status(400).json({ success: false, message: "id is required." });
      }

      const [result] = await pool.execute(`DELETE FROM services WHERE id = :id`, { id });
      if ((result as ResultSetHeader).affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Service not found." });
      }

      return res.status(200).json({ success: true, message: "Service deleted." });
    }

    return methodNotAllowed(res, ["GET", "POST", "PATCH", "DELETE"]);
  } catch (error) {
    console.error("admin-services error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}
