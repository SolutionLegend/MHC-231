-- =============================================================================
-- Mary Help of Christians Catholic High School Portal
-- Comprehensive MySQL Relational Database Schema
-- Prepared for Phase 2: Core Academic & Institutional Management
-- =============================================================================

-- Disable foreign key checks temporarily to allow clean table dropping/creation
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `post_comments`;
DROP TABLE IF EXISTS `post_likes`;
DROP TABLE IF EXISTS `posts`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `library_resources`;
DROP TABLE IF EXISTS `prayer_requests`;
DROP TABLE IF EXISTS `suggestions`;
DROP TABLE IF EXISTS `audit_logs`;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `results`;
DROP TABLE IF EXISTS `attendance`;
DROP TABLE IF EXISTS `subjects`;
DROP TABLE IF EXISTS `club_members`;
DROP TABLE IF EXISTS `clubs`;
DROP TABLE IF EXISTS `classes`;
DROP TABLE IF EXISTS `staff`;
DROP TABLE IF EXISTS `teachers`;
DROP TABLE IF EXISTS `parents`;
DROP TABLE IF EXISTS `students`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `roles`;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- 1. ROLES TABLE
-- =============================================================================
CREATE TABLE `roles` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 2. USERS TABLE
-- =============================================================================
CREATE TABLE `users` (
  `id` VARCHAR(50) PRIMARY KEY, -- maps to portal string ID (e.g. 'u-1')
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role_name` VARCHAR(50) NOT NULL, -- Enum validation helper / direct role reference
  `role_id` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 3. PARENTS SUB-ENTITY PROFILE
-- =============================================================================
CREATE TABLE `parents` (
  `user_id` VARCHAR(50) PRIMARY KEY,
  `phone_number` VARCHAR(30) NULL,
  `address` TEXT NULL,
  `emergency_contact` VARCHAR(100) NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 4. CLASSES TABLE
-- =============================================================================
CREATE TABLE `classes` (
  `id` VARCHAR(50) PRIMARY KEY, -- e.g. 'c-1'
  `name` VARCHAR(50) NOT NULL UNIQUE, -- e.g. 'Grade 12 Science'
  `grade_level` VARCHAR(10) NOT NULL, -- e.g. '12'
  `room_number` VARCHAR(20) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 5. STUDENTS SUB-ENTITY PROFILE
-- =============================================================================
CREATE TABLE `students` (
  `user_id` VARCHAR(50) PRIMARY KEY,
  `parent_id` VARCHAR(50) NULL, -- Associated Parent (user_id)
  `class_id` VARCHAR(50) NULL,  -- Associated Class Group
  `grade_level` VARCHAR(10) NOT NULL,
  `student_leader_status` BOOLEAN DEFAULT FALSE, -- e.g. Student Council Prefect
  `student_status` VARCHAR(30) DEFAULT 'Active', -- e.g. Active, Suspended, Graduated
  `enrollment_date` DATE NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`parent_id`) REFERENCES `parents` (`user_id`) ON DELETE SET NULL,
  FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 6. TEACHERS SUB-ENTITY PROFILE
-- =============================================================================
CREATE TABLE `teachers` (
  `user_id` VARCHAR(50) PRIMARY KEY,
  `qualification` VARCHAR(150) NULL, -- e.g. 'B.Sc. in Physics'
  `bio` TEXT NULL,
  `subjects_taught_summary` VARCHAR(255) NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 7. STAFF SUB-ENTITY PROFILE
-- =============================================================================
CREATE TABLE `staff` (
  `user_id` VARCHAR(50) PRIMARY KEY,
  `department` VARCHAR(100) NOT NULL, -- e.g. 'Registrar', 'IT Department', 'Admissions'
  `job_title` VARCHAR(100) NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 8. SUBJECTS TABLE
-- =============================================================================
CREATE TABLE `subjects` (
  `id` VARCHAR(50) PRIMARY KEY, -- e.g. 'sub-1'
  `name` VARCHAR(100) NOT NULL, -- e.g. 'Mathematics'
  `code` VARCHAR(20) NOT NULL UNIQUE, -- e.g. 'MTH-12'
  `class_id` VARCHAR(50) NOT NULL,
  `teacher_id` VARCHAR(50) NULL, -- Primary subject instructor
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 9. ATTENDANCE TABLE
-- =============================================================================
CREATE TABLE `attendance` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `student_id` VARCHAR(50) NOT NULL,
  `class_id` VARCHAR(50) NOT NULL,
  `status` ENUM('Present', 'Absent', 'Late') NOT NULL DEFAULT 'Present',
  `remarks` VARCHAR(255) NULL,
  `date` DATE NOT NULL,
  `recorded_by` VARCHAR(50) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_student_class_date` (`student_id`, `class_id`, `date`),
  FOREIGN KEY (`student_id`) REFERENCES `students` (`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`recorded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 10. RESULTS (GRADING CARD) TABLE
-- =============================================================================
CREATE TABLE `results` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `student_id` VARCHAR(50) NOT NULL,
  `subject_id` VARCHAR(50) NOT NULL,
  `exam_term` ENUM('First Period', 'Mid Term', 'Finals') NOT NULL,
  `score` DECIMAL(5,2) NOT NULL,
  `max_score` DECIMAL(5,2) NOT NULL DEFAULT 100.00,
  `remarks` VARCHAR(255) NULL,
  `graded_by` VARCHAR(50) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_student_subject_term` (`student_id`, `subject_id`, `exam_term`),
  FOREIGN KEY (`student_id`) REFERENCES `students` (`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`graded_by`) REFERENCES `teachers` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 11. PAYMENTS & FINANCIAL CLEARANCE TABLE
-- =============================================================================
CREATE TABLE `payments` (
  `id` VARCHAR(50) PRIMARY KEY, -- e.g. 'pay-1'
  `student_id` VARCHAR(50) NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `purpose` ENUM('Tuition', 'WASSCE Fees', 'Graduation', 'Uniforms', 'Textbooks', 'Sports Development') NOT NULL,
  `receipt_url` VARCHAR(512) NOT NULL, -- Link to bank transaction slip photo / scan
  `verified` BOOLEAN DEFAULT FALSE,
  `verified_by` VARCHAR(50) NULL, -- Associated Finance Staff
  `remarks` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `verified_at` TIMESTAMP NULL,
  FOREIGN KEY (`student_id`) REFERENCES `students` (`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`verified_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 12. CLUBS TABLE
-- =============================================================================
CREATE TABLE `clubs` (
  `id` VARCHAR(50) PRIMARY KEY, -- e.g. 'cl-1'
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT NOT NULL,
  `president_id` VARCHAR(50) NULL, -- Associated Student Leader
  `advisor_id` VARCHAR(50) NULL,   -- Associated Advisor Teacher
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`president_id`) REFERENCES `students` (`user_id`) ON DELETE SET NULL,
  FOREIGN KEY (`advisor_id`) REFERENCES `teachers` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 13. CLUB MEMBERSHIP JUNCTION TABLE
-- =============================================================================
CREATE TABLE `club_members` (
  `club_id` VARCHAR(50) NOT NULL,
  `student_id` VARCHAR(50) NOT NULL,
  `joined_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`club_id`, `student_id`),
  FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`student_id`) REFERENCES `students` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 14. EVENTS TABLE
-- =============================================================================
CREATE TABLE `events` (
  `id` VARCHAR(50) PRIMARY KEY, -- e.g. 'e-1'
  `title` VARCHAR(150) NOT NULL,
  `description` TEXT NOT NULL,
  `date` DATE NOT NULL,
  `type` ENUM('Academic', 'Faith', 'Sports', 'Club', 'Holiday') NOT NULL,
  `organizer_id` VARCHAR(50) NULL,
  `club_id` VARCHAR(50) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 15. LIBRARY RESOURCES TABLE
-- =============================================================================
CREATE TABLE `library_resources` (
  `id` VARCHAR(50) PRIMARY KEY, -- e.g. 'res-1'
  `title` VARCHAR(150) NOT NULL,
  `description` TEXT NOT NULL,
  `type` ENUM('Syllabus', 'Past Paper', 'E-Book', 'Note', 'Catholic Reader') NOT NULL,
  `file_url` VARCHAR(512) NOT NULL,
  `uploader_id` VARCHAR(50) NULL,
  `downloads_count` INT UNSIGNED DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`uploader_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 16. POSTS TABLE (COMMUNITY FEED & STUDENT LOUNGE)
-- =============================================================================
CREATE TABLE `posts` (
  `id` VARCHAR(50) PRIMARY KEY, -- e.g. 'p-1'
  `user_id` VARCHAR(50) NOT NULL,
  `author_name` VARCHAR(100) NOT NULL,
  `author_role` VARCHAR(50) NOT NULL,
  `content` TEXT NOT NULL,
  `anonymous` BOOLEAN DEFAULT FALSE,
  `section` ENUM('feed', 'lounge') NOT NULL DEFAULT 'feed',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 17. POST LIKES JUNCTION TABLE
-- =============================================================================
CREATE TABLE `post_likes` (
  `post_id` VARCHAR(50) NOT NULL,
  `user_id` VARCHAR(50) NOT NULL,
  `liked_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`post_id`, `user_id`),
  FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 18. POST COMMENTS TABLE
-- =============================================================================
CREATE TABLE `post_comments` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `post_id` VARCHAR(50) NOT NULL,
  `user_id` VARCHAR(50) NOT NULL,
  `author_name` VARCHAR(100) NOT NULL,
  `content` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 19. NOTIFICATIONS TABLE
-- =============================================================================
CREATE TABLE `notifications` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `is_read` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 20. SUGGESTIONS TABLE (ANONYMOUS SUGGESTION BOX)
-- =============================================================================
CREATE TABLE `suggestions` (
  `id` VARCHAR(50) PRIMARY KEY, -- e.g. 'sug-1'
  `title` VARCHAR(150) NOT NULL,
  `content` TEXT NOT NULL,
  `category` VARCHAR(50) NOT NULL, -- e.g. 'Facilities', 'Academic', 'Extracurricular'
  `status` ENUM('Submitted', 'Reviewed', 'In Progress', 'Addressed') DEFAULT 'Submitted',
  `date` DATE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 21. PRAYER REQUESTS TABLE (CATHOLIC CORNER DEVOTIONS)
-- =============================================================================
CREATE TABLE `prayer_requests` (
  `id` VARCHAR(50) PRIMARY KEY, -- e.g. 'pr-1'
  `name` VARCHAR(100) NOT NULL DEFAULT 'Anonymous',
  `intention` TEXT NOT NULL,
  `prayers_count` INT UNSIGNED DEFAULT 0,
  `date` DATE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 22. AUDIT LOGS TABLE (ADMINISTRATIVE TRACKING)
-- =============================================================================
CREATE TABLE `audit_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(50) NULL,
  `username` VARCHAR(50) NOT NULL,
  `role` VARCHAR(50) NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `details` TEXT NOT NULL,
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- INITIAL SEED DATA FOR TESTING & TESTING SIMULATIONS
-- =============================================================================

-- Seed default user roles
INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'Admin', 'Super administrator with full rights over system state'),
(2, 'Principal', 'Lead director overseeing institutional status, notices, and reports'),
(3, 'Vice Principal', 'academic coordinator registering courses, subjects, and tracking grades'),
(4, 'Dean of Student Affairs', 'disciplinary manager monitoring merits, sanctions, and security bulletins'),
(5, 'Finance Office', 'fees receiver and accountant verifying banking clearance slips'),
(6, 'Teachers', 'educators creating scoresheets and recording daily student attendance roll calls'),
(7, 'Staff', 'school support personnel tracking work tasks and facilities'),
(8, 'Student Leaders', 'senior prefects, club presidents, and auxiliary leaders'),
(9, 'Students', 'school members looking up grades, reports, downloading notes, and social feed'),
(10, 'Parents', 'guardians validating student grade performance and tuition receipts');

-- Seed system users (corresponds to default mock list for evaluating 10 role flows)
INSERT INTO `users` (`id`, `username`, `email`, `name`, `password_hash`, `role_name`, `role_id`) VALUES
('u-1', 'admin', 'admin@mhc.edu.lr', 'Super Admin Account', '$2b$10$YourBcryptHashPlaceholderGoesHere', 'Admin', 1),
('u-2', 'principal', 'principal@mhc.edu.lr', 'Sr. Mary Jane Watson FMA', '$2b$10$YourBcryptHashPlaceholderGoesHere', 'Principal', 2),
('u-3', 'vp', 'vp@mhc.edu.lr', 'Bro. Joseph Tamba', '$2b$10$YourBcryptHashPlaceholderGoesHere', 'Vice Principal', 3),
('u-4', 'dean', 'dean@mhc.edu.lr', 'Deacon Gabriel Moore', '$2b$10$YourBcryptHashPlaceholderGoesHere', 'Dean of Student Affairs', 4),
('u-5', 'finance', 'finance@mhc.edu.lr', 'Mrs. Theresa Kesselly', '$2b$10$YourBcryptHashPlaceholderGoesHere', 'Finance Office', 5),
('u-6', 'teacher', 'teacher@mhc.edu.lr', 'Mr. Emmanuel Kamara', '$2b$10$YourBcryptHashPlaceholderGoesHere', 'Teachers', 6),
('u-7', 'staff', 'staff@mhc.edu.lr', 'Mr. David Jallah', '$2b$10$YourBcryptHashPlaceholderGoesHere', 'Staff', 7),
('u-8', 'studentleader', 'studentleader@mhc.edu.lr', 'Princess Kollie', '$2b$10$YourBcryptHashPlaceholderGoesHere', 'Student Leaders', 8),
('u-9', 'student', 'student@mhc.edu.lr', 'Benedict Sackor', '$2b$10$YourBcryptHashPlaceholderGoesHere', 'Students', 9),
('u-10', 'parent', 'parent@mhc.edu.lr', 'Madam Alice Sackor', '$2b$10$YourBcryptHashPlaceholderGoesHere', 'Parents', 10);

-- Enable foreign key checks back
SET FOREIGN_KEY_CHECKS = 1;
