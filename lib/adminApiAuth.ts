import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import { verify } from "jsonwebtoken";

export function requireAdminJwt(req: NextApiRequest, res: NextApiResponse): boolean {
  try {
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.admin_token;
    if (!token) {
      res.status(401).json({ error: "Unauthorized", redirectTo: "/maryam/login" });
      return false;
    }
    verify(token, process.env.JWT_SECRET || "qhcare_jwt_secret_2024");
    return true;
  } catch {
    res.status(401).json({ error: "Invalid token", redirectTo: "/maryam/login" });
    return false;
  }
}
