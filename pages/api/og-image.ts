import type { NextApiRequest, NextApiResponse } from "next";
import { loadContentMap } from "@/lib/contentStore";
import { whatsappSafeImageUrl } from "@/lib/ogImage";

/**
 * Same-domain OG image for WhatsApp/Facebook crawlers.
 * GET /api/og-image  → streams JPEG
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).end();
  }

  try {
    const map = await loadContentMap();
    const source = whatsappSafeImageUrl(
      String(map.og_image_url || map.logo_url || "").trim()
    );
    if (!source) {
      return res.status(404).json({ error: "No OG image configured" });
    }

    const upstream = await fetch(source, {
      headers: { "User-Agent": "qhcare-og-proxy/1.0" },
    });
    if (!upstream.ok) {
      return res.status(502).json({ error: "Upstream image failed" });
    }

    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
    res.setHeader("Content-Length", String(buffer.length));
    if (req.method === "HEAD") return res.status(200).end();
    return res.status(200).send(buffer);
  } catch (error) {
    console.error("og-image proxy error:", error);
    return res.status(500).json({ error: "OG image proxy failed" });
  }
}
