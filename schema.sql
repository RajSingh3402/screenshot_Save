-- MySQL Database Schema for SiteWatch Dashboard
-- This file defines the tables, indexes, and constraints required by the application.

CREATE DATABASE IF NOT EXISTS `sitewatch` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `sitewatch`;

-- 1. Websites Table
CREATE TABLE IF NOT EXISTS `websites` (
  `id` BIGINT NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `url` VARCHAR(2048) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'active',
  `lastStatus` VARCHAR(50) DEFAULT NULL,
  `lastCapture` VARCHAR(50) DEFAULT NULL,
  `error` TEXT DEFAULT NULL,
  `lastCaptureImage` VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Reports Table
CREATE TABLE IF NOT EXISTS `reports` (
  `id` BIGINT NOT NULL PRIMARY KEY,
  `date` VARCHAR(50) NOT NULL,
  `time` VARCHAR(50) NOT NULL,
  `total` INT NOT NULL,
  `success` INT NOT NULL,
  `failed` INT NOT NULL,
  `file` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Report Details Table (stores individual runs for each report check)
CREATE TABLE IF NOT EXISTS `report_details` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `report_id` BIGINT NOT NULL,
  `website_id` BIGINT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `url` VARCHAR(2048) NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `loadTime` INT DEFAULT NULL,
  `error` TEXT DEFAULT NULL,
  `screenshot` VARCHAR(255) DEFAULT NULL,
  CONSTRAINT `fk_report_details_report` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `role` VARCHAR(100) NOT NULL DEFAULT 'Viewer',
  `status` VARCHAR(50) NOT NULL DEFAULT 'active',
  `created` VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Schedules Table
CREATE TABLE IF NOT EXISTS `schedules` (
  `id` BIGINT NOT NULL PRIMARY KEY,
  `time` VARCHAR(5) NOT NULL,
  `enabled` BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Email Recipients Table
CREATE TABLE IF NOT EXISTS `email_recipients` (
  `id` BIGINT NOT NULL PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. SMTP Settings Table (Configured for exactly one row)
CREATE TABLE IF NOT EXISTS `smtp_settings` (
  `id` INT NOT NULL PRIMARY KEY DEFAULT 1,
  `host` VARCHAR(255) DEFAULT NULL,
  `port` VARCHAR(50) DEFAULT NULL,
  `user` VARCHAR(255) DEFAULT NULL,
  `pass` VARCHAR(255) DEFAULT NULL,
  CONSTRAINT `chk_single_row` CHECK (`id` = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for performance optimization
CREATE INDEX `idx_report_details_report_id` ON `report_details` (`report_id`);
