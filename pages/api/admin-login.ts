import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2";
import {
  ensureAdminUser,
  methodNotAllowed,
  setAdminCookie,
  signAdminToken,
} from "@/lib/adminAuth";
import { ensureAdminSchema } from "@/lib/adminSchema";
import { getPool } from "@/lib/db";

type AdminRow = RowDataPacket & {
  id: number;
  username: string;
  password: string;
};

function matchesEnvCredentials(username: string, password: string) {
  const envUsername = process.env.ADMIN_USERNAME?.trim() || "";
  const envPassword = process.env.ADMIN_PASSWORD || "";
  if (!envUsername || !envPassword) return false;
  return username === envUsername && password === envPassword;
}

function loginSuccess(
  res: NextApiResponse,
  payload: { id: number; username: string }
) {
  const token = signAdminToken(payload);
  setAdminCookie(res, token);
  return res.status(200).json({
    success: true,
    message: "Logged in successfully.",
    user: payload,
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }

  const username =
    typeof req.body?.username === "string" ? req.body.username.trim() : "";
  const password =
    typeof req.body?.password === "string" ? req.body.password : "";

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required.",
    });
  }

  // Env fallback — works even when the database is unavailable.
  if (matchesEnvCredentials(username, password)) {
    return loginSuccess(res, {
      id: 0,
      username: process.env.ADMIN_USERNAME!.trim(),
    });
  }

  try {
    await ensureAdminSchema();
    await ensureAdminUser();

    const pool = getPool();
    const [rows] = await pool.execute(
      `SELECT id, username, password FROM admin_users WHERE username = :username LIMIT 1`,
      { username }
    );
    const user = (rows as AdminRow[])[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    return loginSuccess(res, { id: user.id, username: user.username });
  } catch (error) {
    console.error("admin-login error:", error);

    // Last chance: if env credentials match, still allow login after DB failure.
    if (matchesEnvCredentials(username, password)) {
      return loginSuccess(res, {
        id: 0,
        username: process.env.ADMIN_USERNAME!.trim(),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
}
