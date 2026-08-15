export const CONTENT_SECTION_MAP = {
  hero: {
    heading: "hero_heading",
    subheading: "hero_subheading",
    button_text: "hero_button_text",
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

export function groupContent(map: Record<string, string>) {
  return {
    hero: {
      heading: map.hero_heading || "Care You Can Trust",
      subheading:
        map.hero_subheading ||
        "Trusted nursing, diagnostics, and personal care at your doorstep across Lahore.",
      button_text: map.hero_button_text || "Book Appointment",
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
