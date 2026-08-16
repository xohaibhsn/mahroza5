import type { NextApiRequest, NextApiResponse } from "next";
import type { ResultSetHeader } from "mysql2";
import { requireAdminJwt } from "@/lib/adminApiAuth";
import pool from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdminJwt(req, res)) return;

  if (req.method === "GET") {
    try {
      const [rows] = await pool.execute(
        "SELECT * FROM testimonials ORDER BY created_at DESC"
      );
      return res.status(200).json(rows);
    } catch (error) {
      console.error("admin-testimonials GET error:", error);
      return res.status(200).json([]);
    }
  }

  try {
    if (req.method === "POST") {
      const name = String(req.body?.name || "").trim();
      const role = String(req.body?.role || "").trim();
      const quote = String(req.body?.quote || req.body?.message || "").trim();
      const rating = Math.min(5, Math.max(1, Number(req.body?.rating || 5)));
      const is_active = req.body?.is_active === false || req.body?.is_active === 0 ? 0 : 1;
      const sort_order = Number(req.body?.sort_order || 0);

      if (!name || !quote) {
        return res.status(400).json({ error: "Name and message are required." });
      }

      try {
        const [result] = await pool.execute(
          `INSERT INTO testimonials (name, role, quote, rating, is_active, sort_order)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [name, role || null, quote, rating, is_active, Number.isFinite(sort_order) ? sort_order : 0]
        );
        return res.status(201).json({
          success: true,
          id: (result as ResultSetHeader).insertId,
        });
      } catch {
        const [result] = await pool.execute(
          `INSERT INTO testimonials (name, role, quote, is_active, sort_order)
           VALUES (?, ?, ?, ?, ?)`,
          [name, role || null, quote, is_active, Number.isFinite(sort_order) ? sort_order : 0]
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

      if (
        typeof req.body?.is_active !== "undefined" &&
        !req.body?.name &&
        !req.body?.quote &&
        !req.body?.message
      ) {
        const is_active = req.body?.is_active === false || req.body?.is_active === 0 ? 0 : 1;
        await pool.execute(`UPDATE testimonials SET is_active = ? WHERE id = ?`, [
          is_active,
          id,
        ]);
        return res.status(200).json({ success: true });
      }

      const name = String(req.body?.name || "").trim();
      const role = String(req.body?.role || "").trim();
      const quote = String(req.body?.quote || req.body?.message || "").trim();
      const rating = Math.min(5, Math.max(1, Number(req.body?.rating || 5)));
      const is_active = req.body?.is_active === false || req.body?.is_active === 0 ? 0 : 1;
      const sort_order = Number(req.body?.sort_order || 0);

      if (!name || !quote) {
        return res.status(400).json({ error: "Name and message are required." });
      }

      try {
        await pool.execute(
          `UPDATE testimonials
           SET name = ?, role = ?, quote = ?, rating = ?, is_active = ?, sort_order = ?
           WHERE id = ?`,
          [
            name,
            role || null,
            quote,
            rating,
            is_active,
            Number.isFinite(sort_order) ? sort_order : 0,
            id,
          ]
        );
      } catch {
        await pool.execute(
          `UPDATE testimonials
           SET name = ?, role = ?, quote = ?, is_active = ?, sort_order = ?
           WHERE id = ?`,
          [
            name,
            role || null,
            quote,
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
      await pool.execute(`DELETE FROM testimonials WHERE id = ?`, [id]);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("admin-testimonials error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Server error",
    });
  }
}
