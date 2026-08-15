import type { NextApiRequest, NextApiResponse } from "next";
import type { ResultSetHeader } from "mysql2";
import { methodNotAllowed } from "@/lib/adminAuth";
import { ensureAdminSchema } from "@/lib/adminSchema";
import { getPool } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }

  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
  const phone = typeof req.body?.phone === "string" ? req.body.phone.trim() : "";
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";

  if (!name || !message) {
    return res.status(400).json({
      success: false,
      message: "Name and message are required.",
    });
  }

  if (!email && !phone) {
    return res.status(400).json({
      success: false,
      message: "Please provide an email or phone number.",
    });
  }

  try {
    await ensureAdminSchema();
    const pool = getPool();
    const [result] = await pool.execute(
      `INSERT INTO messages (name, email, phone, message, is_read)
       VALUES (:name, :email, :phone, :message, 0)`,
      {
        name,
        email: email || null,
        phone: phone || null,
        message,
      }
    );

    return res.status(201).json({
      success: true,
      id: (result as ResultSetHeader).insertId,
      message: "Message sent successfully.",
    });
  } catch (error) {
    console.error("contact api error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to send message right now. Please call or WhatsApp us.",
    });
  }
}
