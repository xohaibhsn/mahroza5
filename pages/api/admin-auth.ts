import type { NextApiRequest, NextApiResponse } from "next";
import { getAdminFromRequest, methodNotAllowed } from "@/lib/adminAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return methodNotAllowed(res, ["GET"]);
  }

  const admin = getAdminFromRequest(req);
  if (!admin) {
    return res.status(401).json({ success: false, authenticated: false });
  }

  return res.status(200).json({
    success: true,
    authenticated: true,
    user: admin,
  });
}
