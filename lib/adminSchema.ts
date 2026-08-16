import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { getPool } from "@/lib/db";

export type AppointmentRow = RowDataPacket & {
  id: number;
  name: string;
  phone: string;
  service: string;
  message: string | null;
  status: string;
  created_at: string;
};

export type ServiceRow = RowDataPacket & {
  id: number;
  title: string;
  short_text: string | null;
  description: string | null;
  icon: string | null;
  image: string | null;
  is_active: number;
  sort_order: number;
  created_at: string;
};

export type TestimonialRow = RowDataPacket & {
  id: number;
  name: string;
  role: string | null;
  quote: string;
  rating: number;
  is_active: number;
  sort_order: number;
  created_at: string;
};

export type ContentRow = RowDataPacket & {
  id: number;
  section: string;
  key: string;
  value: string | null;
};

export type MessageRow = RowDataPacket & {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  is_read: number;
  created_at: string;
};

async function ignoreDuplicateColumn(error: unknown) {
  const err = error as { code?: string };
  if (err.code !== "ER_DUP_FIELDNAME") throw error;
}

export async function ensureAdminSchema() {
  const pool = getPool();

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      username VARCHAR(100) NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uniq_username (username)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      service VARCHAR(255) NOT NULL,
      message TEXT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      INDEX idx_created_at (created_at),
      INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  try {
    await pool.execute(
      `ALTER TABLE appointments ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'pending'`
    );
  } catch (error) {
    await ignoreDuplicateColumn(error);
  }

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS services (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      short_text VARCHAR(255) NULL,
      description TEXT NULL,
      icon VARCHAR(50) NULL,
      image VARCHAR(500) NULL,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  try {
    await pool.execute(`ALTER TABLE services ADD COLUMN icon VARCHAR(50) NULL`);
  } catch (error) {
    await ignoreDuplicateColumn(error);
  }

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(255) NULL,
      quote TEXT NOT NULL,
      rating INT NOT NULL DEFAULT 5,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  try {
    await pool.execute(`ALTER TABLE testimonials ADD COLUMN rating INT NOT NULL DEFAULT 5`);
  } catch (error) {
    await ignoreDuplicateColumn(error);
  }

  // Live Hostinger schema: content(section, key, value) + unique_section_key
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS content (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      section VARCHAR(100) NOT NULL,
      \`key\` VARCHAR(100) NOT NULL,
      value TEXT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY unique_section_key (section, \`key\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS messages (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NULL,
      phone VARCHAR(50) NULL,
      message TEXT NOT NULL,
      is_read TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      INDEX idx_is_read (is_read)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  const defaults: Array<[string, string, string]> = [
    ["hero", "heading", "Care You Can Trust"],
    [
      "hero",
      "subheading",
      "Trusted nursing, diagnostics, and personal care at your doorstep across Lahore.",
    ],
    ["hero", "button_text", "Book Appointment"],
    ["about", "heading", "Care you can trust, closer to home"],
    [
      "about",
      "description",
      "QHC — Quality Health Care brings hospital-quality support into Lahore homes with compassion, skill, and reliability under Director Mahroza Rao.",
    ],
    ["stats", "patients", "1000+"],
    ["stats", "services", "8"],
    ["stats", "availability", "24/7"],
    ["stats", "city", "Lahore"],
    ["why_choose_us", "point_1", "Qualified Healthcare Professionals"],
    ["why_choose_us", "point_2", "24/7 Availability Across Lahore"],
    ["why_choose_us", "point_3", "Patient-Centric Home Care"],
    ["why_choose_us", "point_4", "Seamless Continuum of Care"],
    ["settings", "phone", "+92 3004334065"],
    ["settings", "whatsapp", "+92 3004334065"],
    ["settings", "address1", "817, Al Hafeez Shopping Mall, Gulberg, Lahore"],
    ["settings", "address2", "Office #5, Bismillah Plaza, Defense Road, Lahore"],
    ["settings", "email", "info@qhcare.com.pk"],
    ["settings", "logo_url", ""],
    ["settings", "favicon_url", ""],
    ["settings", "og_image_url", ""],
    ["settings", "site_title", "QHC - Quality Health Care"],
    ["settings", "meta_description", "Professional home healthcare services in Lahore"],
    ["settings", "facebook_url", ""],
    ["settings", "instagram_url", ""],
    ["settings", "twitter_url", ""],
    ["settings", "tiktok_url", ""],
    [
      "hero",
      "slide_1",
      "https://images.unsplash.com/photo-1643297654416-05795d62e39c?auto=format&fit=crop&w=800&q=80",
    ],
    [
      "hero",
      "slide_2",
      "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80",
    ],
    [
      "hero",
      "slide_3",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
    ],
    [
      "hero",
      "slide_4",
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80",
    ],
  ];

  for (const [section, key, value] of defaults) {
    await pool.execute(
      `INSERT IGNORE INTO content (section, \`key\`, value) VALUES (?, ?, ?)`,
      [section, key, value]
    );
  }
}

export type { ResultSetHeader };
