import { v2 as cloudinary } from "cloudinary";

export function configureCloudinary() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME || "dehknghwm";
  const api_key = process.env.CLOUDINARY_API_KEY || "241139362455838";
  const api_secret = process.env.CLOUDINARY_API_SECRET;

  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
    secure: true,
  });

  return { cloud_name, api_key, api_secret };
}

export function getCloudinary() {
  const { api_secret } = configureCloudinary();

  if (!api_secret) {
    throw new Error("CLOUDINARY_API_SECRET is missing.");
  }

  return cloudinary;
}
