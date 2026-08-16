import type { NextApiRequest, NextApiResponse } from "next";
import { clearAdminCookie, methodNotAllowed } from "@/lib/adminAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }

  clearAdminCookie(res);
  return res.status(200).json({
    success: true,
    message: "Logged out.",
    redirectTo: "/maryam/login",
  });
}
