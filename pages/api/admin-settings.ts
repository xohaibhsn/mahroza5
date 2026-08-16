import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdminJwt } from "@/lib/adminApiAuth";
import { ensureSettingsKeys, loadContentMap, upsertFlatContent } from "@/lib/contentStore";

const SETTINGS_DEFAULTS = {
  site_title: "QHC - Quality Health Care",
  meta_description: "Professional home healthcare services in Lahore",
  phone: "+92 3004334065",
  whatsapp: "+92 3004334065",
  address1: "817, Al Hafeez Shopping Mall, Gulberg, Lahore",
  address2: "Office #5, Bismillah Plaza, Defense Road, Lahore",
  email: "info@qhcare.com.pk",
  logo_url: "",
  favicon_url: "",
  facebook_url: "",
  instagram_url: "",
  twitter_url: "",
  tiktok_url: "",
};

const SETTINGS_KEYS = Object.keys(SETTINGS_DEFAULTS) as Array<keyof typeof SETTINGS_DEFAULTS>;

async function readSettings() {
  await ensureSettingsKeys();
  const map = await loadContentMap();

  return {
    site_title: map.site_title || SETTINGS_DEFAULTS.site_title,
    meta_description: map.meta_description || SETTINGS_DEFAULTS.meta_description,
    phone: map.phone || SETTINGS_DEFAULTS.phone,
    whatsapp: map.whatsapp || SETTINGS_DEFAULTS.whatsapp,
    address1: map.address1 || map.office1 || SETTINGS_DEFAULTS.address1,
    address2: map.address2 || map.office2 || SETTINGS_DEFAULTS.address2,
    email: map.email || SETTINGS_DEFAULTS.email,
    logo_url: (map.logo_url || "").trim(),
    favicon_url: (map.favicon_url || "").trim(),
    facebook_url: (map.facebook_url || "").trim(),
    instagram_url: (map.instagram_url || "").trim(),
    twitter_url: (map.twitter_url || "").trim(),
    tiktok_url: (map.tiktok_url || "").trim(),
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdminJwt(req, res)) return;

  if (req.method === "GET") {
    try {
      const settings = await readSettings();
      return res.status(200).json({ success: true, ...settings, data: settings });
    } catch (error) {
      console.error("admin-settings GET:", error);
      return res.status(200).json({
        success: true,
        ...SETTINGS_DEFAULTS,
        data: SETTINGS_DEFAULTS,
        warning: error instanceof Error ? error.message : "DB read failed",
      });
    }
  }

  if (req.method === "PATCH") {
    try {
      const updates =
        req.body?.data && typeof req.body.data === "object" ? req.body.data : req.body || {};

      if (typeof updates.address_1 === "string" && typeof updates.address1 !== "string") {
        updates.address1 = updates.address_1;
      }
      if (typeof updates.address_2 === "string" && typeof updates.address2 !== "string") {
        updates.address2 = updates.address_2;
      }

      let changed = 0;
      const saved: string[] = [];

      for (const key of SETTINGS_KEYS) {
        if (typeof updates[key] !== "string") continue;
        const value = String(updates[key]).trim();
        const ok = await upsertFlatContent(key, value);
        if (!ok) continue;
        saved.push(key);
        changed += 1;

        if (key === "address1") await upsertFlatContent("office1", value);
        if (key === "address2") await upsertFlatContent("office2", value);
      }

      if (!changed) {
        return res.status(400).json({
          success: false,
          error: "No valid settings fields provided.",
          receivedKeys: Object.keys(updates || {}),
        });
      }

      const settings = await readSettings();
      return res.status(200).json({
        success: true,
        message: `Saved: ${saved.join(", ")}`,
        ...settings,
        data: settings,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Save failed";
      console.error("admin-settings PATCH:", error);
      return res.status(500).json({
        success: false,
        error: message,
        message,
      });
    }
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
