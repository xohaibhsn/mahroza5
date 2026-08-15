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
  content_key: string;
  content_value: string | null;
  updated_at: string;
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

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS content (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      content_key VARCHAR(100) NOT NULL,
      content_value TEXT NULL,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uniq_content_key (content_key)
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

  const defaults: Array<[string, string]> = [
    ["hero_heading", "Care You Can Trust"],
    [
      "hero_subheading",
      "Trusted nursing, diagnostics, and personal care at your doorstep across Lahore.",
    ],
    ["hero_button_text", "Book Appointment"],
    ["about_heading", "Care you can trust, closer to home"],
    [
      "about_description",
      "QHC — Quality Health Care brings hospital-quality support into Lahore homes with compassion, skill, and reliability under Director Mahroza Rao.",
    ],
    [
      "about_text",
      "QHC — Quality Health Care brings hospital-quality support into Lahore homes with compassion, skill, and reliability under Director Mahroza Rao.",
    ],
    ["stat_patients", "1000+"],
    ["stat_services", "8"],
    ["stat_availability", "24/7"],
    ["stat_location", "Lahore"],
    ["why_point_1", "Qualified Healthcare Professionals"],
    ["why_point_2", "24/7 Availability Across Lahore"],
    ["why_point_3", "Patient-Centric Home Care"],
    ["why_point_4", "Seamless Continuum of Care"],
    ["phone", "+92 3004334065"],
    ["whatsapp", "+92 3004334065"],
    ["address1", "817, Al Hafeez Shopping Mall, Gulberg, Lahore"],
    ["address2", "Office #5, Bismillah Plaza, Defense Road, Lahore"],
    ["office1", "817, Al Hafeez Shopping Mall, Gulberg, Lahore"],
    ["office2", "Office #5, Bismillah Plaza, Defense Road, Lahore"],
    ["email", "info@qhcare.com.pk"],
    ["logo_url", ""],
    ["favicon_url", ""],
    ["site_title", "QHC - Quality Health Care"],
    ["meta_description", "Professional home healthcare services in Lahore"],
  ];

  for (const [key, value] of defaults) {
    await pool.execute(
      `INSERT IGNORE INTO content (content_key, content_value) VALUES (:key, :value)`,
      { key, value }
    );
  }
}

export type { ResultSetHeader };
