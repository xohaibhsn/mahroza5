const SITE_URL = "https://qhcare.com.pk";

export function absoluteUrl(url: string) {
  const value = String(url || "").trim();
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `${SITE_URL}${value.startsWith("/") ? value : `/${value}`}`;
}

/** WhatsApp-safe Cloudinary JPG URL (extension must match JPEG) */
export function whatsappSafeImageUrl(url: string) {
  const absolute = absoluteUrl(url);
  if (!absolute) return "";
  const marker = "/image/upload/";
  const idx = absolute.indexOf(marker);
  if (idx === -1) {
    return absolute.replace(/\.png($|\?)/i, ".jpg$1");
  }
  const before = absolute.slice(0, idx + marker.length);
  let after = absolute.slice(idx + marker.length);
  if (!/^c_fill,w_1200,h_630/.test(after) && !after.includes("f_jpg")) {
    after = `c_fill,w_1200,h_630,f_jpg,q_80/${after}`;
  }
  after = after.replace(/\.png($|\?)/i, ".jpg$1");
  return `${before}${after}`;
}

export function publicOgImageUrl(hasImage: boolean) {
  if (!hasImage) return "";
  return `${SITE_URL}/api/og-image`;
}
