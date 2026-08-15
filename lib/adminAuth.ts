import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { parse, serialize } from "cookie";
import jwt from "jsonwebtoken";
import { getPool } from "@/lib/db";

export const ADMIN_COOKIE = "qhcare_admin_token";

export type AdminJwtPayload = {
  id: number;
  username: string;
};

function getJwtSecret() {
  const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Missing NEXTAUTH_SECRET environment variable");
  }
  return secret;
}

export function signAdminToken(payload: AdminJwtPayload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyAdminToken(token: string): AdminJwtPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as AdminJwtPayload;
    if (!decoded?.id || !decoded?.username) return null;
    return { id: Number(decoded.id), username: String(decoded.username) };
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: NextApiRequest) {
  const headerCookie = req.headers.cookie;
  if (!headerCookie) return null;
  const cookies = parse(headerCookie);
  return cookies[ADMIN_COOKIE] || null;
}

export function getAdminFromRequest(req: NextApiRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return verifyAdminToken(token);
}

export function setAdminCookie(res: NextApiResponse, token: string) {
  const isProd = process.env.NODE_ENV === "production";
  res.setHeader(
    "Set-Cookie",
    serialize(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })
  );
}

export function clearAdminCookie(res: NextApiResponse) {
  const isProd = process.env.NODE_ENV === "production";
  res.setHeader(
    "Set-Cookie",
    serialize(ADMIN_COOKIE, "", {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    })
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

  // Re-hash if an older plain-text password was stored.
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
