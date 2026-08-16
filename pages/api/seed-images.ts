import type { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";

/** Visit /api/seed-images?secret=qhcare2024 to force-update service images. */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.query.secret !== "qhcare2024") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const updates: Array<[string, string]> = [
      [
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
        "UPDATE services SET image=? WHERE title LIKE '%Nursing%'",
      ],
      [
        "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80",
        "UPDATE services SET image=? WHERE title LIKE '%Injection%' OR title LIKE '%Dressing%'",
      ],
      [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",
        "UPDATE services SET image=? WHERE title LIKE '%Physio%'",
      ],
      [
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80",
        "UPDATE services SET image=? WHERE title LIKE '%Doctor%'",
      ],
      [
        "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=600&q=80",
        "UPDATE services SET image=? WHERE title LIKE '%X-Ray%' OR title LIKE '%Ultrasound%' OR title LIKE '%ECG%' OR title LIKE '%Diagnostic%'",
      ],
      [
        "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=600&q=80",
        "UPDATE services SET image=? WHERE title LIKE '%Elderly%'",
      ],
      [
        "https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?auto=format&fit=crop&w=600&q=80",
        "UPDATE services SET image=? WHERE title LIKE '%Mental%'",
      ],
      [
        "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80",
        "UPDATE services SET image=? WHERE title LIKE '%Baby%'",
      ],
    ];

    let updated = 0;
    for (const [imageUrl, sql] of updates) {
      const [result] = await pool.execute(sql, [imageUrl]);
      updated += Number((result as { affectedRows?: number }).affectedRows || 0);
    }

    // Also seed default hero slides if empty
    const slides = [
      [
        "slide_1",
        "https://images.unsplash.com/photo-1643297654416-05795d62e39c?auto=format&fit=crop&w=800&q=80",
      ],
      [
        "slide_2",
        "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80",
      ],
      [
        "slide_3",
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
      ],
      [
        "slide_4",
        "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80",
      ],
    ] as const;

    for (const [key, value] of slides) {
      await pool.execute(
        `INSERT INTO content (section, \`key\`, value)
         VALUES ('hero', ?, ?)
         ON DUPLICATE KEY UPDATE value = IF(value IS NULL OR value = '', VALUES(value), value)`,
        [key, value]
      );
    }

    return res.status(200).json({
      success: true,
      message: "Service images + hero slides seeded successfully",
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
