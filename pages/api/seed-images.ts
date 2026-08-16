import type { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.query.secret !== "qhcare2024") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const updates: Array<[string, string]> = [
      [
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80",
        "%Nursing%",
      ],
      [
        "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=400&q=80",
        "%Injection%",
      ],
      [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80",
        "%Physio%",
      ],
      [
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80",
        "%Doctor%",
      ],
      [
        "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=400&q=80",
        "%X-Ray%",
      ],
      [
        "https://images.unsplash.com/photo-1542849808-1ed9a6d0e862?auto=format&fit=crop&w=400&q=80",
        "%Elderly%",
      ],
      [
        "https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?auto=format&fit=crop&w=400&q=80",
        "%Mental%",
      ],
      [
        "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=400&q=80",
        "%Baby%",
      ],
    ];

    let updated = 0;
    for (const [imageUrl, titlePattern] of updates) {
      const [result] = await pool.execute(
        "UPDATE services SET image=? WHERE title LIKE ?",
        [imageUrl, titlePattern]
      );
      updated += Number((result as { affectedRows?: number }).affectedRows || 0);
    }

    return res.status(200).json({
      success: true,
      message: "Images seeded successfully",
      updated,
    });
  } catch (error) {
    console.error("seed-images error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Seed failed",
    });
  }
}
