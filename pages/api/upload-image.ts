import type { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import type { Fields, Files } from "formidable";
import fs from "fs";
import { methodNotAllowed, requireAdmin } from "@/lib/adminAuth";

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function readJsonBody(req: NextApiRequest) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function firstValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseForm(req: NextApiRequest): Promise<{ fields: Fields; files: Files }> {
  const form = formidable({
    multiples: false,
    maxFileSize: 8 * 1024 * 1024,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = requireAdmin(req, res);
  if (!admin) return;

  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return res.status(500).json({
      success: false,
      message: "Cloudinary environment variables are missing.",
    });
  }

  try {
    const contentType = req.headers["content-type"] || "";
    let uploadSource: string | undefined;
    let folder = "qhcare";

    if (contentType.includes("application/json")) {
      const body = await readJsonBody(req);
      folder = typeof body.folder === "string" && body.folder.trim() ? body.folder.trim() : "qhcare";
      if (typeof body.image === "string" && body.image.startsWith("data:image/")) {
        uploadSource = body.image;
      }
    } else {
      const { fields, files } = await parseForm(req);
      folder = firstValue(fields.folder as string | string[] | undefined)?.trim() || "qhcare";
      const fileField = files.file || files.image;
      const file = Array.isArray(fileField) ? fileField[0] : fileField;
      if (file?.filepath) {
        uploadSource = file.filepath;
      }
    }

    if (!uploadSource) {
      return res.status(400).json({
        success: false,
        message: "No image provided. Send multipart file or base64 image.",
      });
    }

    const uploaded = await cloudinary.uploader.upload(uploadSource, {
      folder,
      resource_type: "image",
    });

    if (uploadSource && !uploadSource.startsWith("data:image/") && fs.existsSync(uploadSource)) {
      try {
        fs.unlinkSync(uploadSource);
      } catch {
        // ignore temp cleanup errors
      }
    }

    return res.status(200).json({
      success: true,
      url: uploaded.secure_url,
      public_id: uploaded.public_id,
    });
  } catch (error) {
    console.error("upload-image error:", error);
    return res.status(500).json({
      success: false,
      message: "Image upload failed. Check Cloudinary credentials.",
    });
  }
}
