import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { parse } from "cookie";
import jwt from "jsonwebtoken";
import { getPool } from "@/lib/db";

export const ADMIN_COOKIE = "admin_token";
export const JWT_SECRET_FALLBACK = "qhcare_jwt_secret_2024";

export type AdminJwtPayload = {
  id: number;
  username: string;
};

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET || JWT_SECRET_FALLBACK;
  return secret;
}

export function signAdminToken(payload: AdminJwtPayload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "1d" });
}

export function verifyAdminToken(token: string): AdminJwtPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as AdminJwtPayload;
    // Allow id === 0 for env-credential logins
    if (typeof decoded?.id !== "number" || !decoded?.username) return null;
    return { id: Number(decoded.id), username: String(decoded.username) };
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: NextApiRequest) {
  const headerCookie = req.headers.cookie;
  if (!headerCookie) return null;

  const cookies = parse(headerCookie);
  if (cookies[ADMIN_COOKIE]) return cookies[ADMIN_COOKIE];

  // Manual fallback parse in case cookie package misses the value
  const match = headerCookie.match(/(?:^|;\s*)admin_token=([^;]+)/);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export function getAdminFromRequest(req: NextApiRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return verifyAdminToken(token);
}

export function setAdminCookie(res: NextApiResponse, token: string) {
  // No Secure flag — Hostinger/proxy setups can drop Secure cookies.
  res.setHeader(
    "Set-Cookie",
    `admin_token=${token}; Path=/; HttpOnly; Max-Age=86400; SameSite=Lax`
  );
}

export function clearAdminCookie(res: NextApiResponse) {
  res.setHeader(
    "Set-Cookie",
    `admin_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`
  );
}

export function requireAdmin(req: NextApiRequest, res: NextApiResponse) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return null;
  }
  return admin;
}

export async function ensureAdminUser() {
  const pool = getPool();
  const [rows] = await pool.query(
    "SELECT id, username, password FROM admin_users WHERE username = 'admin' LIMIT 1"
  );
  const existing = (rows as Array<{ id: number; username: string; password: string }>)[0];

  if (!existing) {
    const hash = await bcrypt.hash("admin123", 10);
    await pool.execute(
      `INSERT INTO admin_users (username, password) VALUES (:username, :password)`,
      { username: "admin", password: hash }
    );
    return;
  }

  if (existing.password && !existing.password.startsWith("$2")) {
    const hash = await bcrypt.hash("admin123", 10);
    await pool.execute(`UPDATE admin_users SET password = :password WHERE id = :id`, {
      id: existing.id,
      password: hash,
    });
  }
}

export function methodNotAllowed(res: NextApiResponse, allow: string[]) {
  res.setHeader("Allow", allow);
  return res.status(405).json({ success: false, message: "Method not allowed" });
}
