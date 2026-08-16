export const CONTENT_SECTION_MAP = {
  hero: {
    heading: "hero_heading",
    subheading: "hero_subheading",
    button_text: "hero_button_text",
    slide_1: "hero_slide_1",
    slide_2: "hero_slide_2",
    slide_3: "hero_slide_3",
    slide_4: "hero_slide_4",
  },
  about: {
    heading: "about_heading",
    description: "about_description",
  },
  stats: {
    patients: "stat_patients",
    services: "stat_services",
    availability: "stat_availability",
    city: "stat_location",
  },
  why_choose_us: {
    point_1: "why_point_1",
    point_2: "why_point_2",
    point_3: "why_point_3",
    point_4: "why_point_4",
  },
} as const;

export type ContentSection = keyof typeof CONTENT_SECTION_MAP;

export function contentDbKey(section: string, key: string): string | null {
  const sectionMap = CONTENT_SECTION_MAP[section as ContentSection] as
    | Record<string, string>
    | undefined;
  if (!sectionMap) return null;
  return sectionMap[key] || null;
}

export const DEFAULT_SLIDES = [
  "https://images.unsplash.com/photo-1643297654416-05795d62e39c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80",
];

export function groupContent(map: Record<string, string>) {
  return {
    hero: {
      heading: map.hero_heading || "Care You Can Trust",
      subheading:
        map.hero_subheading ||
        "Trusted nursing, diagnostics, and personal care at your doorstep across Lahore.",
      button_text: map.hero_button_text || "Book Appointment",
      slide_1: map.hero_slide_1 || DEFAULT_SLIDES[0],
      slide_2: map.hero_slide_2 || DEFAULT_SLIDES[1],
      slide_3: map.hero_slide_3 || DEFAULT_SLIDES[2],
      slide_4: map.hero_slide_4 || DEFAULT_SLIDES[3],
    },
    about: {
      heading: map.about_heading || "Care you can trust, closer to home",
      description:
        map.about_description ||
        map.about_text ||
        "QHC — Quality Health Care brings hospital-quality support into Lahore homes.",
    },
    stats: {
      patients: map.stat_patients || "1000+",
      services: map.stat_services || "8",
      availability: map.stat_availability || "24/7",
      city: map.stat_location || "Lahore",
    },
    why_choose_us: {
      point_1: map.why_point_1 || "Qualified Healthcare Professionals",
      point_2: map.why_point_2 || "24/7 Availability Across Lahore",
      point_3: map.why_point_3 || "Patient-Centric Home Care",
      point_4: map.why_point_4 || "Seamless Continuum of Care",
    },
  };
}
