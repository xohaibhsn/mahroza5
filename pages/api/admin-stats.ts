import type { NextApiRequest, NextApiResponse } from "next";
import { methodNotAllowed, requireAdmin } from "@/lib/adminAuth";
import { ensureAdminSchema } from "@/lib/adminSchema";
import { getPool } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = requireAdmin(req, res);
  if (!admin) return;

  if (req.method !== "GET") {
    return methodNotAllowed(res, ["GET"]);
  }

  try {
    await ensureAdminSchema();
    const pool = getPool();

    const [
      [appointments],
      [pending],
      [services],
      [messages],
      [unread],
      [testimonials],
      [recentAppointments],
      [recentMessages],
    ] = await Promise.all([
      pool.query("SELECT COUNT(*) AS count FROM appointments"),
      pool.query(
        `SELECT COUNT(*) AS count FROM appointments WHERE status = 'pending' OR status IS NULL OR status = ''`
      ),
      pool.query("SELECT COUNT(*) AS count FROM services"),
      pool.query("SELECT COUNT(*) AS count FROM messages"),
      pool.query("SELECT COUNT(*) AS count FROM messages WHERE is_read = 0"),
      pool.query("SELECT COUNT(*) AS count FROM testimonials"),
      pool.query(
        `SELECT id, name, phone, service, status, created_at
         FROM appointments ORDER BY created_at DESC LIMIT 5`
      ),
      pool.query(
        `SELECT id, name, email, phone, message, is_read, created_at
         FROM messages ORDER BY created_at DESC LIMIT 5`
      ),
    ]);

    const countOf = (rows: unknown) =>
      Number((rows as Array<{ count: number }>)[0]?.count || 0);

    return res.status(200).json({
      success: true,
      data: {
        appointments: countOf(appointments),
        pending: countOf(pending),
        services: countOf(services),
        messages: countOf(messages),
        unread_messages: countOf(unread),
        testimonials: countOf(testimonials),
        recent_appointments: recentAppointments,
        recent_messages: recentMessages,
      },
    });
  } catch (error) {
    console.error("admin-stats error:", error);
    return res.status(500).json({ success: false, message: "Failed to load stats." });
  }
}
