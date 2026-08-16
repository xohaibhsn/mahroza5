import type { NextApiRequest, NextApiResponse } from "next";
import { methodNotAllowed } from "@/lib/adminAuth";
import { groupContent } from "@/lib/contentSections";
import pool from "@/lib/db";
import { getSiteContent } from "@/lib/siteData";

type ContentRow = {
  content_key?: string;
  content_value?: string | null;
  section?: string;
  key?: string;
  value?: string | null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return methodNotAllowed(res, ["GET"]);
  }

  try {
    const map: Record<string, string> = {};

    try {
      // Prefer section-based content if that schema exists
      const [sectionRows] = await pool.execute(
        `SELECT * FROM content WHERE section IN ('settings','hero','about','stats')`
      );
      const rows = sectionRows as ContentRow[];
      if (rows.length && rows.some((r) => r.section)) {
        const settings: Record<string, string> = {};
        const hero: Record<string, string> = {};
        const about: Record<string, string> = {};
        const stats: Record<string, string> = {};
        for (const row of rows) {
          const section = String(row.section || "");
          const key = String(row.key || row.content_key || "");
          const value = String(row.value ?? row.content_value ?? "");
          if (!section || !key) continue;
          if (section === "settings") settings[key] = value;
          if (section === "hero") hero[key] = value;
          if (section === "about") about[key] = value;
          if (section === "stats") stats[key] = value;
        }
        return res.status(200).json({
          settings: {
            logo_url: settings.logo_url || "",
            favicon_url: settings.favicon_url || "",
            phone: settings.phone || "+92 3004334065",
            whatsapp: settings.whatsapp || settings.phone || "+92 3004334065",
            address1: settings.address1 || settings.address_1 || "",
            address2: settings.address2 || settings.address_2 || "",
            email: settings.email || "info@qhcare.com.pk",
            site_title: settings.site_title || "QHC - Quality Health Care",
            meta_description: settings.meta_description || "",
          },
          hero: {
            heading: hero.heading || "Care You Can Trust",
            subheading: hero.subheading || "",
            button_text: hero.button_text || "Book Appointment",
          },
          about: {
            heading: about.heading || "",
            description: about.description || "",
          },
          stats: {
            patients: stats.patients || "1000+",
            services: stats.services || "8",
            availability: stats.availability || "24/7",
            city: stats.city || "Lahore",
          },
        });
      }
    } catch {
      // Fall through to key/value schema
    }

    const [rows] = await pool.execute("SELECT content_key, content_value FROM content");
    for (const row of rows as ContentRow[]) {
      if (row.content_key) map[row.content_key] = row.content_value || "";
    }

    const grouped = groupContent(map);
    const flat = await getSiteContent();

    const payload = {
      settings: {
        logo_url: flat.logo_url || map.logo_url || "",
        favicon_url: flat.favicon_url || map.favicon_url || "",
        phone: flat.phone || map.phone || "+92 3004334065",
        whatsapp: flat.whatsapp || map.whatsapp || "+92 3004334065",
        address1: flat.address1 || map.address1 || map.office1 || "",
        address2: flat.address2 || map.address2 || map.office2 || "",
        email: flat.email || map.email || "info@qhcare.com.pk",
        site_title: flat.site_title || map.site_title || "QHC - Quality Health Care",
        meta_description: flat.meta_description || map.meta_description || "",
      },
      hero: grouped.hero,
      about: grouped.about,
      stats: grouped.stats,
      // Backward-compatible flat payload for existing consumers
      data: flat,
    };

    return res.status(200).json(payload);
  } catch (error) {
    console.error("site-content api error:", error);
    return res.status(200).json({
      settings: {
        logo_url: "",
        favicon_url: "",
        phone: "+92 3004334065",
        whatsapp: "+92 3004334065",
        address1: "817, Al Hafeez Shopping Mall, Gulberg, Lahore",
        address2: "Office #5, Bismillah Plaza, Defense Road, Lahore",
        email: "info@qhcare.com.pk",
      },
      hero: {
        heading: "Care You Can Trust",
        subheading: "",
        button_text: "Book Appointment",
      },
      about: { heading: "", description: "" },
      stats: {
        patients: "1000+",
        services: "8",
        availability: "24/7",
        city: "Lahore",
      },
    });
  }
}
