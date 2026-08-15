-- Run once in Hostinger phpMyAdmin if you prefer creating the table manually.
-- The app also auto-creates this table on first appointment submit.

CREATE TABLE IF NOT EXISTS appointments (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  service VARCHAR(255) NOT NULL,
  message TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
