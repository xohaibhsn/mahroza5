import type { NextApiRequest, NextApiResponse } from "next";
import type { ResultSetHeader } from "mysql2";
import { ensureAdminSchema } from "@/lib/adminSchema";
import { getPool } from "@/lib/db";

type AppointmentBody = {
  name?: string;
  phone?: string;
  service?: string;
  message?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { name, phone, service, message }: AppointmentBody = req.body ?? {};

  const trimmedName = typeof name === "string" ? name.trim() : "";
  const trimmedPhone = typeof phone === "string" ? phone.trim() : "";
  const trimmedService = typeof service === "string" ? service.trim() : "";
  const trimmedMessage = typeof message === "string" ? message.trim() : "";

  if (!trimmedName || !trimmedPhone || !trimmedService) {
    return res.status(400).json({
      success: false,
      message: "Name, phone, and service are required.",
    });
  }

  if (trimmedPhone.length < 10) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid phone number.",
    });
  }

  try {
    await ensureAdminSchema();
    const pool = getPool();
    const [result] = await pool.execute(
      `INSERT INTO appointments (name, phone, service, message, status)
       VALUES (:name, :phone, :service, :message, 'pending')`,
      {
        name: trimmedName,
        phone: trimmedPhone,
        service: trimmedService,
        message: trimmedMessage || null,
      }
    );

    return res.status(201).json({
      success: true,
      id: (result as ResultSetHeader).insertId,
      message: "Appointment request saved successfully.",
    });
  } catch (error) {
    console.error("Appointment API error:", error);
    return res.status(500).json({
      success: false,
      message:
        "Unable to save appointment right now. Please call or WhatsApp us instead.",
    });
  }
}
