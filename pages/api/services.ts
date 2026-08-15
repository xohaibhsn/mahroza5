import type { NextApiRequest, NextApiResponse } from "next";
import { methodNotAllowed } from "@/lib/adminAuth";
import { getActiveServices } from "@/lib/siteData";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return methodNotAllowed(res, ["GET"]);
  }

  try {
    const data = await getActiveServices();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("services api error:", error);
    return res.status(500).json({ success: false, message: "Failed to load services." });
  }
}
