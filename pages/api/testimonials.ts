import type { NextApiRequest, NextApiResponse } from "next";
import { methodNotAllowed } from "@/lib/adminAuth";
import { getActiveTestimonials } from "@/lib/siteData";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return methodNotAllowed(res, ["GET"]);
  }

  try {
    const data = await getActiveTestimonials();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("testimonials api error:", error);
    return res.status(500).json({ success: false, message: "Failed to load testimonials." });
  }
}
