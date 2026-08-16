import type { NextApiRequest, NextApiResponse } from "next";
import { methodNotAllowed } from "@/lib/adminAuth";
import { requireAdminJwt } from "@/lib/adminApiAuth";
import cloudinary from "@/lib/cloudinary";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "8mb",
    },
  },
};

/** Kept for compatibility; new uploads should use /api/upload-image. */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdminJwt(req, res)) return;

  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }

  const image = typeof req.body?.image === "string" ? req.body.image : "";
  if (!image || !image.startsWith("data:image/")) {
    return res.status(400).json({
      success: false,
      message: "A valid base64 image is required.",
    });
  }

  try {
    const uploaded = await cloudinary.uploader.upload(image, {
      folder: "qhcare",
    });

    return res.status(200).json({
      success: true,
      url: uploaded.secure_url,
    });
  } catch (error) {
    console.error("admin-upload error:", error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Image upload failed.",
    });
  }
}
