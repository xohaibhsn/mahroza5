import type { NextApiRequest, NextApiResponse } from "next";
import { methodNotAllowed } from "@/lib/adminAuth";
import { groupContent, DEFAULT_SLIDES } from "@/lib/contentSections";
import { loadContentMap } from "@/lib/contentStore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return methodNotAllowed(res, ["GET"]);
  }

  try {
    const map = await loadContentMap();
    const grouped = groupContent(map);

    const settings = {
      logo_url: (map.logo_url || "").trim(),
      favicon_url: (map.favicon_url || "").trim(),
      og_image_url: (map.og_image_url || "").trim(),
      phone: map.phone || "+92 3004334065",
      whatsapp: map.whatsapp || map.phone || "+92 3004334065",
      address1: map.address1 || map.office1 || "817, Al Hafeez Shopping Mall, Gulberg, Lahore",
      address2: map.address2 || map.office2 || "Office #5, Bismillah Plaza, Defense Road, Lahore",
      email: map.email || "info@qhcare.com.pk",
      site_title: map.site_title || "QHC - Quality Health Care",
      meta_description: map.meta_description || "Professional home healthcare services in Lahore",
      facebook_url: (map.facebook_url || "").trim(),
      instagram_url: (map.instagram_url || "").trim(),
      twitter_url: (map.twitter_url || "").trim(),
      tiktok_url: (map.tiktok_url || "").trim(),
    };

    const slides = [
      map.hero_slide_1 || DEFAULT_SLIDES[0],
      map.hero_slide_2 || DEFAULT_SLIDES[1],
      map.hero_slide_3 || DEFAULT_SLIDES[2],
      map.hero_slide_4 || DEFAULT_SLIDES[3],
    ];

    return res.status(200).json({
      settings,
      hero: {
        ...grouped.hero,
        slide_1: slides[0],
        slide_2: slides[1],
        slide_3: slides[2],
        slide_4: slides[3],
      },
      about: grouped.about,
      stats: grouped.stats,
      why_choose_us: grouped.why_choose_us,
      slides,
      data: {
        ...map,
        logo_url: settings.logo_url,
        favicon_url: settings.favicon_url,
        og_image_url: settings.og_image_url,
        phone: settings.phone,
        whatsapp: settings.whatsapp,
        address1: settings.address1,
        address2: settings.address2,
        email: settings.email,
        site_title: settings.site_title,
        meta_description: settings.meta_description,
        facebook_url: settings.facebook_url,
        instagram_url: settings.instagram_url,
        twitter_url: settings.twitter_url,
        tiktok_url: settings.tiktok_url,
        hero_heading: grouped.hero.heading,
        hero_subheading: grouped.hero.subheading,
        hero_button_text: grouped.hero.button_text,
        about_heading: grouped.about.heading,
        about_description: grouped.about.description,
        about_text: grouped.about.description,
        stat_patients: grouped.stats.patients,
        stat_services: grouped.stats.services,
        stat_availability: grouped.stats.availability,
        stat_location: grouped.stats.city,
      },
    });
  } catch (error) {
    console.error("site-content api error:", error);
    return res.status(200).json({
      settings: {
        logo_url: "",
        favicon_url: "",
        og_image_url: "",
        phone: "+92 3004334065",
        whatsapp: "+92 3004334065",
        address1: "817, Al Hafeez Shopping Mall, Gulberg, Lahore",
        address2: "Office #5, Bismillah Plaza, Defense Road, Lahore",
        email: "info@qhcare.com.pk",
        facebook_url: "",
        instagram_url: "",
        twitter_url: "",
        tiktok_url: "",
      },
      hero: {
        heading: "Care You Can Trust",
        subheading: "",
        button_text: "Book Appointment",
        slide_1: DEFAULT_SLIDES[0],
        slide_2: DEFAULT_SLIDES[1],
        slide_3: DEFAULT_SLIDES[2],
        slide_4: DEFAULT_SLIDES[3],
      },
      about: { heading: "", description: "" },
      stats: {
        patients: "1000+",
        services: "8",
        availability: "24/7",
        city: "Lahore",
      },
      slides: DEFAULT_SLIDES,
      data: {},
    });
  }
}
