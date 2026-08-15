import type { NextApiRequest, NextApiResponse } from "next";
import { methodNotAllowed, requireAdmin } from "@/lib/adminAuth";
import { getCloudinary } from "@/lib/cloudinary";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "8mb",
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = requireAdmin(req, res);
  if (!admin) return;

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
    const cloudinary = getCloudinary();
    const uploaded = await cloudinary.uploader.upload(image, {
      folder: "qhcare/services",
      resource_type: "image",
    });

    return res.status(200).json({
      success: true,
      url: uploaded.secure_url,
      public_id: uploaded.public_id,
    });
  } catch (error) {
    console.error("admin-upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Image upload failed. Check Cloudinary credentials.",
    });
  }
}
