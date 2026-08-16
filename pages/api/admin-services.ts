import type { NextApiRequest, NextApiResponse } from "next";
import type { ResultSetHeader } from "mysql2";
import { requireAdminJwt } from "@/lib/adminApiAuth";
import pool from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdminJwt(req, res)) return;

  if (req.method === "GET") {
    try {
      const [rows] = await pool.execute(
        "SELECT * FROM services ORDER BY sort_order ASC"
      );
      return res.status(200).json(rows);
    } catch (error) {
      console.error("admin-services GET error:", error);
      return res.status(200).json([]);
    }
  }

  try {
    if (req.method === "POST") {
      const title = String(req.body?.title || "").trim();
      const short_text = String(req.body?.short_text || "").trim();
      const description = String(req.body?.description || "").trim();
      const icon = String(req.body?.icon || "").trim();
      const image = String(req.body?.image || "").trim();
      const is_active = req.body?.is_active === false || req.body?.is_active === 0 ? 0 : 1;
      const sort_order = Number(req.body?.sort_order || 0);

      if (!title) {
        return res.status(400).json({ error: "Title is required." });
      }

      try {
        const [result] = await pool.execute(
          `INSERT INTO services (title, short_text, description, icon, image, is_active, sort_order)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            title,
            short_text || null,
            description || null,
            icon || null,
            image || null,
            is_active,
            Number.isFinite(sort_order) ? sort_order : 0,
          ]
        );
        return res.status(201).json({
          success: true,
          id: (result as ResultSetHeader).insertId,
        });
      } catch {
        // Fallback if icon column is missing on older DBs
        const [result] = await pool.execute(
          `INSERT INTO services (title, short_text, description, image, is_active, sort_order)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            title,
            short_text || null,
            description || null,
            image || null,
            is_active,
            Number.isFinite(sort_order) ? sort_order : 0,
          ]
        );
        return res.status(201).json({
          success: true,
          id: (result as ResultSetHeader).insertId,
        });
      }
    }

    if (req.method === "PATCH") {
      const id = Number(req.body?.id);
      if (!id) return res.status(400).json({ error: "id is required." });

      if (typeof req.body?.is_active !== "undefined" && !req.body?.title) {
        const is_active = req.body?.is_active === false || req.body?.is_active === 0 ? 0 : 1;
        await pool.execute(`UPDATE services SET is_active = ? WHERE id = ?`, [is_active, id]);
        return res.status(200).json({ success: true });
      }

      const title = String(req.body?.title || "").trim();
      const short_text = String(req.body?.short_text || "").trim();
      const description = String(req.body?.description || "").trim();
      const icon = String(req.body?.icon || "").trim();
      const image = String(req.body?.image || "").trim();
      const is_active = req.body?.is_active === false || req.body?.is_active === 0 ? 0 : 1;
      const sort_order = Number(req.body?.sort_order || 0);

      if (!title) return res.status(400).json({ error: "Title is required." });

      try {
        await pool.execute(
          `UPDATE services
           SET title = ?, short_text = ?, description = ?, icon = ?, image = ?, is_active = ?, sort_order = ?
           WHERE id = ?`,
          [
            title,
            short_text || null,
            description || null,
            icon || null,
            image || null,
            is_active,
            Number.isFinite(sort_order) ? sort_order : 0,
            id,
          ]
        );
      } catch {
        await pool.execute(
          `UPDATE services
           SET title = ?, short_text = ?, description = ?, image = ?, is_active = ?, sort_order = ?
           WHERE id = ?`,
          [
            title,
            short_text || null,
            description || null,
            image || null,
            is_active,
            Number.isFinite(sort_order) ? sort_order : 0,
            id,
          ]
        );
      }

      return res.status(200).json({ success: true });
    }

    if (req.method === "DELETE") {
      const id = Number(req.body?.id ?? req.query.id);
      if (!id) return res.status(400).json({ error: "id is required." });
      await pool.execute(`DELETE FROM services WHERE id = ?`, [id]);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("admin-services error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Server error",
    });
  }
}
