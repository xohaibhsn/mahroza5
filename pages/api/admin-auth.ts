import type { NextApiRequest, NextApiResponse } from "next";
import {
  getAdminFromRequest,
  getJwtSecret,
  getTokenFromRequest,
  methodNotAllowed,
  verifyAdminToken,
} from "@/lib/adminAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return methodNotAllowed(res, ["GET"]);
  }

  // Ensure JWT secret always resolves (JWT_SECRET || fallback)
  const secret = process.env.JWT_SECRET || "qhcare_jwt_secret_2024";
  void secret;
  void getJwtSecret();

  const token = getTokenFromRequest(req);
  if (!token) {
    return res.status(401).json({
      success: false,
      authenticated: false,
      redirectTo: "/maryam/login",
    });
  }

  const admin = verifyAdminToken(token) || getAdminFromRequest(req);
  if (!admin) {
    return res.status(401).json({
      success: false,
      authenticated: false,
      redirectTo: "/maryam/login",
    });
  }

  return res.status(200).json({
    success: true,
    authenticated: true,
    user: admin,
  });
}
