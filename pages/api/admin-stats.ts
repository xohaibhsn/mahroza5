import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import { verify } from "jsonwebtoken";
import pool from "@/lib/db";

type CountRow = { count: number | string };

async function countQuery(sql: string): Promise<number> {
  try {
    const [rows] = (await pool.execute(sql)) as [CountRow[], unknown];
    return Number(rows?.[0]?.count || 0);
  } catch (error) {
    console.error("admin-stats count error:", sql, error);
    return 0;
  }
}

async function listQuery(sql: string): Promise<unknown[]> {
  try {
    const [rows] = (await pool.execute(sql)) as [unknown[], unknown];
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error("admin-stats list error:", sql, error);
    return [];
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.admin_token;
    if (!token) return res.status(401).json({ success: false, error: "Unauthorized" });
    verify(token, process.env.JWT_SECRET || "qhcare_jwt_secret_2024");
  } catch {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const [
      appointments,
      pending,
      services,
      messages,
      unread,
      testimonials,
      recentAppointments,
      recentMessages,
    ] = await Promise.all([
      countQuery("SELECT COUNT(*) as count FROM appointments"),
      countQuery(
        "SELECT COUNT(*) as count FROM appointments WHERE status='pending' OR status IS NULL OR status=''"
      ),
      countQuery("SELECT COUNT(*) as count FROM services"),
      countQuery("SELECT COUNT(*) as count FROM messages"),
      countQuery("SELECT COUNT(*) as count FROM messages WHERE is_read=0"),
      countQuery("SELECT COUNT(*) as count FROM testimonials"),
      listQuery(
        "SELECT id, name, phone, service, status, created_at FROM appointments ORDER BY created_at DESC LIMIT 5"
      ),
      listQuery(
        "SELECT id, name, email, phone, message, is_read, created_at FROM messages ORDER BY created_at DESC LIMIT 5"
      ),
    ]);

    const payload = {
      appointments,
      pending,
      services,
      messages,
      unread,
      unread_messages: unread,
      testimonials,
      recentAppointments,
      recentMessages,
      recent_appointments: recentAppointments,
      recent_messages: recentMessages,
    };

    return res.status(200).json({
      success: true,
      ...payload,
      data: payload,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load stats.";
    console.error("admin-stats error:", error);
    return res.status(500).json({ success: false, error: message, message });
  }
}
