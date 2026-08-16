import {
  company,
  services as fallbackServices,
  testimonials as fallbackTestimonials,
} from "@/lib/constants";
import { ensureAdminSchema, type ServiceRow, type TestimonialRow } from "@/lib/adminSchema";
import { loadContentMap } from "@/lib/contentStore";
import { getPool } from "@/lib/db";
import type { SiteContent, SiteService, SiteTestimonial } from "@/lib/siteTypes";

export type { SiteContent, SiteService, SiteTestimonial };

const defaultContent: SiteContent = {
  hero_heading: company.tagline,
  hero_subheading:
    "Trusted nursing, diagnostics, and personal care at your doorstep across Lahore.",
  hero_button_text: "Book Appointment",
  about_heading: "Care you can trust, closer to home",
  about_description:
    "QHC — Quality Health Care brings hospital-quality support into Lahore homes with compassion, skill, and reliability under Director Mahroza Rao.",
  about_text:
    "QHC — Quality Health Care brings hospital-quality support into Lahore homes with compassion, skill, and reliability under Director Mahroza Rao.",
  why_point_1: "Qualified Healthcare Professionals",
  why_point_2: "24/7 Availability Across Lahore",
  why_point_3: "Patient-Centric Home Care",
  why_point_4: "Seamless Continuum of Care",
  stat_patients: "1000+",
  stat_services: "8",
  stat_availability: "24/7",
  stat_location: "Lahore",
  phone: company.phone,
  whatsapp: company.phone,
  address1: company.offices[0].address,
  address2: company.offices[1].address,
  email: company.email,
  logo_url: "",
  favicon_url: "",
  og_image_url: "",
  site_title: "QHC — Quality Health Care | Lahore",
  meta_description:
    "QHC provides professional home nursing, physiotherapy, doctor visits, diagnostics, elderly care, and baby care across Lahore, Pakistan.",
  facebook_url: "",
  instagram_url: "",
  twitter_url: "",
  tiktok_url: "",
};

async function seedCatalogIfEmpty() {
  const pool = getPool();
  const [serviceCountRows] = await pool.query("SELECT COUNT(*) AS count FROM services");
  const serviceCount = Number((serviceCountRows as Array<{ count: number }>)[0]?.count || 0);

  if (serviceCount === 0) {
    for (let i = 0; i < fallbackServices.length; i += 1) {
      const service = fallbackServices[i];
      await pool.execute(
        `INSERT INTO services (title, short_text, description, icon, image, is_active, sort_order)
         VALUES (:title, :short_text, :description, :icon, :image, 1, :sort_order)`,
        {
          title: service.title,
          short_text: service.short,
          description: service.description,
          icon: "🏥",
          image: service.image,
          sort_order: i + 1,
        }
      );
    }
  }

  // Replace missing / placeholder service images with real Unsplash URLs
  const imageSeeds: Array<[string, string]> = [
    [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
      "%Nursing%",
    ],
    [
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80",
      "%Dressing%",
    ],
    [
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80",
      "%Injection%",
    ],
    [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",
      "%Physio%",
    ],
    [
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80",
      "%Doctor%",
    ],
    [
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=600&q=80",
      "%X-Ray%",
    ],
    [
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=600&q=80",
      "%Ultrasound%",
    ],
    [
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=600&q=80",
      "%ECG%",
    ],
    [
      "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=600&q=80",
      "%Elderly%",
    ],
    [
      "https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?auto=format&fit=crop&w=600&q=80",
      "%Mental%",
    ],
    [
      "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80",
      "%Baby%",
    ],
  ];

  for (const [imageUrl, pattern] of imageSeeds) {
    await pool.execute(
      `UPDATE services
       SET image = :image
       WHERE title LIKE :pattern
         AND (
           image IS NULL OR image = '' OR image LIKE '%placehold.co%'
           OR image LIKE '%photo-1542849808%'
         )`,
      { image: imageUrl, pattern }
    );
  }

  const [testimonialCountRows] = await pool.query("SELECT COUNT(*) AS count FROM testimonials");
  const testimonialCount = Number(
    (testimonialCountRows as Array<{ count: number }>)[0]?.count || 0
  );

  if (testimonialCount === 0) {
    for (let i = 0; i < fallbackTestimonials.length; i += 1) {
      const item = fallbackTestimonials[i];
      await pool.execute(
        `INSERT INTO testimonials (name, role, quote, rating, is_active, sort_order)
         VALUES (:name, :role, :quote, 5, 1, :sort_order)`,
        {
          name: item.name,
          role: item.role,
          quote: item.quote,
          sort_order: i + 1,
        }
      );
    }
  }
}

function mapContent(map: Record<string, string>): SiteContent {
  const aboutDescription =
    map.about_description || map.about_text || defaultContent.about_description;

  return {
    hero_heading: map.hero_heading || defaultContent.hero_heading,
    hero_subheading: map.hero_subheading || defaultContent.hero_subheading,
    hero_button_text: map.hero_button_text || defaultContent.hero_button_text,
    about_heading: map.about_heading || defaultContent.about_heading,
    about_description: aboutDescription,
    about_text: aboutDescription,
    why_point_1: map.why_point_1 || defaultContent.why_point_1,
    why_point_2: map.why_point_2 || defaultContent.why_point_2,
    why_point_3: map.why_point_3 || defaultContent.why_point_3,
    why_point_4: map.why_point_4 || defaultContent.why_point_4,
    stat_patients: map.stat_patients || defaultContent.stat_patients,
    stat_services: map.stat_services || defaultContent.stat_services,
    stat_availability: map.stat_availability || defaultContent.stat_availability,
    stat_location: map.stat_location || defaultContent.stat_location,
    phone: map.phone || defaultContent.phone,
    whatsapp: map.whatsapp || map.phone || defaultContent.whatsapp,
    address1: map.address1 || map.office1 || defaultContent.address1,
    address2: map.address2 || map.office2 || defaultContent.address2,
    email: map.email || defaultContent.email,
    logo_url: map.logo_url || "",
    favicon_url: map.favicon_url || "",
    og_image_url: map.og_image_url || "",
    site_title: map.site_title || defaultContent.site_title,
    meta_description: map.meta_description || defaultContent.meta_description,
    facebook_url: map.facebook_url || "",
    instagram_url: map.instagram_url || "",
    twitter_url: map.twitter_url || "",
    tiktok_url: map.tiktok_url || "",
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    await ensureAdminSchema();
    return mapContent(await loadContentMap());
  } catch (error) {
    console.error("getSiteContent fallback:", error);
    return defaultContent;
  }
}

export async function getActiveServices(): Promise<SiteService[]> {
  try {
    await ensureAdminSchema();
    await seedCatalogIfEmpty();
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT id, title, short_text, description, icon, image
       FROM services
       WHERE is_active = 1
       ORDER BY sort_order ASC, id ASC`
    );

    const list = rows as ServiceRow[];
    if (!list.length) {
      return fallbackServices.map((service) => ({ ...service }));
    }

    return list.map((row) => ({
      id: String(row.id),
      dbId: row.id,
      title: row.title,
      short: row.short_text || "",
      description: row.description || "",
      icon: row.icon || "🏥",
      image:
        row.image ||
        `https://placehold.co/600x400/1e3a5f/ffffff?text=${encodeURIComponent(row.title)}`,
    }));
  } catch (error) {
    console.error("getActiveServices fallback:", error);
    return fallbackServices.map((service) => ({ ...service }));
  }
}

export async function getActiveTestimonials(): Promise<SiteTestimonial[]> {
  try {
    await ensureAdminSchema();
    await seedCatalogIfEmpty();
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT name, role, quote, rating
       FROM testimonials
       WHERE is_active = 1
       ORDER BY sort_order ASC, id DESC`
    );

    const list = rows as TestimonialRow[];
    if (!list.length) {
      return fallbackTestimonials.map((item) => ({
        name: item.name,
        role: item.role,
        quote: item.quote,
        rating: 5,
      }));
    }

    return list.map((row) => ({
      name: row.name,
      role: row.role || "",
      quote: row.quote,
      rating: Number(row.rating) || 5,
    }));
  } catch (error) {
    console.error("getActiveTestimonials fallback:", error);
    return fallbackTestimonials.map((item) => ({
      name: item.name,
      role: item.role,
      quote: item.quote,
      rating: 5,
    }));
  }
}

export function phoneToTel(phone: string) {
  return phone.replace(/[^\d+]/g, "") || company.phoneTel;
}

export function phoneToWhatsApp(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return company.whatsappUrl;
  return `https://wa.me/${digits.startsWith("0") ? `92${digits.slice(1)}` : digits}`;
}
