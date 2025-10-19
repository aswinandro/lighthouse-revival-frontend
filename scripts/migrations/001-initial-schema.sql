-- ============================================
-- LIGHTHOUSE REVIVAL CHURCH - INITIAL SCHEMA
-- MySQL Database Migration v1.0
-- ============================================

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS qr_attendance_records;
DROP TABLE IF EXISTS qr_attendance_sessions;
DROP TABLE IF EXISTS prayer_request_email_config;
DROP TABLE IF EXISTS weekly_church_reports;
DROP TABLE IF EXISTS preaching_schedules;
DROP TABLE IF EXISTS user_church_roles;
DROP TABLE IF EXISTS ministry_members;
DROP TABLE IF EXISTS ministries;
DROP TABLE IF EXISTS event_registrations;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS course_enrollments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS prayer_requests;
DROP TABLE IF EXISTS newcomers;
DROP TABLE IF EXISTS members;
DROP TABLE IF EXISTS churches;
DROP TABLE IF EXISTS users;

-- ============================================
-- CORE TABLES
-- ============================================

-- Users table for authentication
CREATE TABLE users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(50),
  role ENUM('super_admin', 'church_pastor', 'church_leader', 'church_believer', 'user') DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Churches table
CREATE TABLE churches (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'UAE',
  postal_code VARCHAR(20),
  phone VARCHAR(50),
  email VARCHAR(255),
  website VARCHAR(255),
  pastor_name VARCHAR(255),
  established_date DATE,
  languages_offered VARCHAR(255) DEFAULT 'English,Tamil,Hindi,Malayalam',
  service_times TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_churches_name (name),
  INDEX idx_churches_city (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- USER-CHURCH RELATIONSHIP
-- ============================================

CREATE TABLE user_church_roles (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  church_id CHAR(36) NOT NULL,
  role ENUM('super_admin', 'church_pastor', 'church_leader', 'church_believer') NOT NULL,
  assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_by CHAR(36),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_church (user_id, church_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_church_roles_user (user_id),
  INDEX idx_user_church_roles_church (church_id),
  INDEX idx_user_church_roles_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- MEMBERS & NEWCOMERS
-- ============================================

CREATE TABLE members (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50) NOT NULL,
  date_of_birth DATE,
  gender ENUM('Male', 'Female', 'Other'),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  membership_status ENUM('Active', 'Inactive', 'Lifetime', 'Elder', 'Pastor', 'Deacon') DEFAULT 'Active',
  membership_date DATE,
  preferred_language ENUM('English', 'Tamil', 'Hindi', 'Malayalam', 'Urdu') DEFAULT 'English',
  emergency_contact_name VARCHAR(200),
  emergency_contact_phone VARCHAR(50),
  emergency_contact_relationship VARCHAR(100),
  baptism_date DATE,
  baptism_location VARCHAR(255),
  marital_status ENUM('Single', 'Married', 'Divorced', 'Widowed'),
  occupation VARCHAR(255),
  skills TEXT,
  notes TEXT,
  qr_code VARCHAR(255) UNIQUE,
  phone_verified BOOLEAN DEFAULT false,
  church_id CHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE SET NULL,
  INDEX idx_members_email (email),
  INDEX idx_members_phone (phone),
  INDEX idx_members_church (church_id),
  INDEX idx_members_status (membership_status),
  INDEX idx_members_qr_code (qr_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE newcomers (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50) NOT NULL,
  visit_date DATE NOT NULL,
  preferred_language ENUM('English', 'Tamil', 'Hindi', 'Malayalam', 'Urdu') DEFAULT 'English',
  how_did_you_hear VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  age_group VARCHAR(50),
  interested_in_membership BOOLEAN DEFAULT false,
  prayer_request TEXT,
  follow_up_status ENUM('Pending', 'Contacted', 'Scheduled', 'Completed', 'Not Interested') DEFAULT 'Pending',
  follow_up_date DATE,
  assigned_to CHAR(36),
  notes TEXT,
  converted_to_member BOOLEAN DEFAULT false,
  member_id CHAR(36),
  church_id CHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_to) REFERENCES members(id) ON DELETE SET NULL,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL,
  FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE SET NULL,
  INDEX idx_newcomers_phone (phone),
  INDEX idx_newcomers_church (church_id),
  INDEX idx_newcomers_status (follow_up_status),
  INDEX idx_newcomers_visit_date (visit_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ATTENDANCE TRACKING
-- ============================================

CREATE TABLE attendance (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  member_id CHAR(36),
  service_date DATE NOT NULL,
  service_type ENUM('Sunday Service', 'Midweek Service', 'Prayer Meeting', 'Special Event') NOT NULL,
  language ENUM('English', 'Tamil', 'Hindi', 'Malayalam', 'Urdu'),
  present BOOLEAN DEFAULT true,
  notes TEXT,
  church_id CHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE SET NULL,
  INDEX idx_attendance_member (member_id),
  INDEX idx_attendance_date (service_date),
  INDEX idx_attendance_church (church_id),
  INDEX idx_attendance_type (service_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- QR ATTENDANCE SYSTEM
-- ============================================

CREATE TABLE qr_attendance_sessions (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  church_id CHAR(36) NOT NULL,
  session_name VARCHAR(255) NOT NULL,
  session_date DATE NOT NULL,
  session_time TIME NOT NULL,
  service_type ENUM('Sunday Service', 'Midweek Service', 'Prayer Meeting', 'Special Event') NOT NULL,
  language ENUM('English', 'Tamil', 'Hindi', 'Malayalam', 'Urdu'),
  qr_code VARCHAR(500) UNIQUE NOT NULL,
  qr_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP,
  total_attendance INTEGER DEFAULT 0,
  members_count INTEGER DEFAULT 0,
  newcomers_count INTEGER DEFAULT 0,
  created_by CHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_qr_sessions_church (church_id),
  INDEX idx_qr_sessions_date (session_date),
  INDEX idx_qr_sessions_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE qr_attendance_records (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  session_id CHAR(36) NOT NULL,
  member_id CHAR(36),
  newcomer_id CHAR(36),
  check_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  device_info TEXT,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES qr_attendance_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (newcomer_id) REFERENCES newcomers(id) ON DELETE CASCADE,
  INDEX idx_qr_records_session (session_id),
  INDEX idx_qr_records_member (member_id),
  INDEX idx_qr_records_newcomer (newcomer_id),
  UNIQUE KEY unique_member_session (session_id, member_id),
  UNIQUE KEY unique_newcomer_session (session_id, newcomer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- COURSES & EDUCATION
-- ============================================

CREATE TABLE courses (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  course_type ENUM('Bible Study', 'Leadership Training', 'Ministry Training', 'New Believers', 'Other') DEFAULT 'Bible Study',
  duration_weeks INTEGER,
  language ENUM('English', 'Tamil', 'Hindi', 'Malayalam', 'Urdu') DEFAULT 'English',
  instructor_id CHAR(36),
  start_date DATE,
  end_date DATE,
  meeting_day VARCHAR(50),
  meeting_time TIME,
  location VARCHAR(255),
  max_students INTEGER,
  status ENUM('Upcoming', 'Active', 'Completed', 'Cancelled') DEFAULT 'Upcoming',
  church_id CHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (instructor_id) REFERENCES members(id) ON DELETE SET NULL,
  FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE SET NULL,
  INDEX idx_courses_church (church_id),
  INDEX idx_courses_status (status),
  INDEX idx_courses_start_date (start_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE course_enrollments (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  course_id CHAR(36) NOT NULL,
  member_id CHAR(36) NOT NULL,
  enrollment_date DATE DEFAULT (CURRENT_DATE),
  completion_date DATE,
  status ENUM('Active', 'Completed', 'Dropped', 'On Hold') DEFAULT 'Active',
  attendance_percentage DECIMAL(5,2),
  grade VARCHAR(10),
  certificate_issued BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  INDEX idx_enrollments_course (course_id),
  INDEX idx_enrollments_member (member_id),
  UNIQUE KEY unique_course_member (course_id, member_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- EVENTS MANAGEMENT
-- ============================================

CREATE TABLE events (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  location VARCHAR(255),
  event_type ENUM('Service', 'Conference', 'Retreat', 'Outreach', 'Social', 'Training', 'Other') DEFAULT 'Service',
  language ENUM('English', 'Tamil', 'Hindi', 'Malayalam', 'Urdu', 'Multi-Language'),
  organizer_id CHAR(36),
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  registration_required BOOLEAN DEFAULT false,
  registration_deadline DATE,
  cost DECIMAL(10,2) DEFAULT 0,
  status ENUM('Upcoming', 'Ongoing', 'Completed', 'Cancelled') DEFAULT 'Upcoming',
  image_url TEXT,
  church_id CHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (organizer_id) REFERENCES members(id) ON DELETE SET NULL,
  FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE SET NULL,
  INDEX idx_events_date (event_date),
  INDEX idx_events_church (church_id),
  INDEX idx_events_status (status),
  INDEX idx_events_type (event_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE event_registrations (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  event_id CHAR(36) NOT NULL,
  member_id CHAR(36) NOT NULL,
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('Confirmed', 'Waitlist', 'Cancelled', 'Attended') DEFAULT 'Confirmed',
  payment_status ENUM('Pending', 'Paid', 'Refunded', 'Waived') DEFAULT 'Pending',
  amount_paid DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  INDEX idx_registrations_event (event_id),
  INDEX idx_registrations_member (member_id),
  UNIQUE KEY unique_event_member (event_id, member_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PRAYER REQUESTS
-- ============================================

CREATE TABLE prayer_requests (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  requester_name VARCHAR(200) NOT NULL,
  requester_email VARCHAR(255),
  requester_phone VARCHAR(50),
  request_text TEXT NOT NULL,
  request_type ENUM('Personal', 'Family', 'Health', 'Financial', 'Spiritual', 'Other') DEFAULT 'Personal',
  priority ENUM('Low', 'Medium', 'High', 'Urgent') DEFAULT 'Medium',
  status ENUM('Open', 'Praying', 'Answered', 'Closed') DEFAULT 'Open',
  is_anonymous BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false,
  assigned_to CHAR(36),
  answered_date DATE,
  testimony TEXT,
  notes TEXT,
  church_id CHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_to) REFERENCES members(id) ON DELETE SET NULL,
  FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE SET NULL,
  INDEX idx_prayer_requests_status (status),
  INDEX idx_prayer_requests_church (church_id),
  INDEX idx_prayer_requests_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE prayer_request_email_config (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  church_id CHAR(36) NOT NULL,
  leader_name VARCHAR(255) NOT NULL,
  leader_email VARCHAR(255) NOT NULL,
  leader_role VARCHAR(100),
  request_types TEXT,
  is_active BOOLEAN DEFAULT true,
  priority_order INTEGER DEFAULT 1,
  created_by CHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_prayer_email_config_church (church_id),
  INDEX idx_prayer_email_config_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- MINISTRIES
-- ============================================

CREATE TABLE ministries (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  ministry_type ENUM('Worship', 'Youth', 'Children', 'Outreach', 'Prayer', 'Media', 'Hospitality', 'Other') DEFAULT 'Other',
  leader_id CHAR(36),
  meeting_schedule VARCHAR(255),
  meeting_day VARCHAR(50),
  meeting_time TIME,
  location VARCHAR(255),
  status ENUM('Active', 'Inactive', 'On Hold') DEFAULT 'Active',
  member_count INTEGER DEFAULT 0,
  church_id CHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (leader_id) REFERENCES members(id) ON DELETE SET NULL,
  FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE SET NULL,
  INDEX idx_ministries_church (church_id),
  INDEX idx_ministries_status (status),
  INDEX idx_ministries_type (ministry_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ministry_members (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  ministry_id CHAR(36) NOT NULL,
  member_id CHAR(36) NOT NULL,
  role ENUM('Leader', 'Co-Leader', 'Member', 'Volunteer') DEFAULT 'Member',
  joined_date DATE DEFAULT (CURRENT_DATE),
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (ministry_id) REFERENCES ministries(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  INDEX idx_ministry_members_ministry (ministry_id),
  INDEX idx_ministry_members_member (member_id),
  UNIQUE KEY unique_ministry_member (ministry_id, member_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PREACHING SCHEDULES
-- ============================================

CREATE TABLE preaching_schedules (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  church_id CHAR(36) NOT NULL,
  assigned_pastor_id CHAR(36) NOT NULL,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  assigned_topic TEXT NOT NULL,
  assigned_scripture TEXT,
  sermon_series VARCHAR(255),
  super_admin_comments TEXT,
  actual_topic_preached TEXT,
  actual_scripture TEXT,
  pastor_notes TEXT,
  sermon_summary TEXT,
  attendance_count INTEGER,
  new_converts INTEGER DEFAULT 0,
  status ENUM('Scheduled', 'Completed', 'Cancelled', 'Rescheduled') DEFAULT 'Scheduled',
  assigned_by CHAR(36),
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_pastor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_preaching_schedules_church (church_id),
  INDEX idx_preaching_schedules_pastor (assigned_pastor_id),
  INDEX idx_preaching_schedules_week (week_start_date),
  INDEX idx_preaching_schedules_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- WEEKLY CHURCH REPORTS
-- ============================================

CREATE TABLE weekly_church_reports (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  church_id CHAR(36) NOT NULL,
  pastor_id CHAR(36) NOT NULL,
  report_week_start DATE NOT NULL,
  report_week_end DATE NOT NULL,
  
  -- Financial data
  tithe_amount DECIMAL(12, 2) DEFAULT 0,
  offering_amount DECIMAL(12, 2) DEFAULT 0,
  special_offering_amount DECIMAL(12, 2) DEFAULT 0,
  donations_amount DECIMAL(12, 2) DEFAULT 0,
  other_income DECIMAL(12, 2) DEFAULT 0,
  total_income DECIMAL(12, 2) GENERATED ALWAYS AS (
    tithe_amount + offering_amount + special_offering_amount + donations_amount + other_income
  ) STORED,
  
  -- Expenses
  rent_expense DECIMAL(12, 2) DEFAULT 0,
  utilities_expense DECIMAL(12, 2) DEFAULT 0,
  ministry_expense DECIMAL(12, 2) DEFAULT 0,
  transportation_expense DECIMAL(12, 2) DEFAULT 0,
  maintenance_expense DECIMAL(12, 2) DEFAULT 0,
  staff_expense DECIMAL(12, 2) DEFAULT 0,
  outreach_expense DECIMAL(12, 2) DEFAULT 0,
  other_expenses DECIMAL(12, 2) DEFAULT 0,
  expense_notes TEXT,
  total_expenses DECIMAL(12, 2) GENERATED ALWAYS AS (
    rent_expense + utilities_expense + ministry_expense + transportation_expense + 
    maintenance_expense + staff_expense + outreach_expense + other_expenses
  ) STORED,
  
  net_balance DECIMAL(12, 2) GENERATED ALWAYS AS (
    tithe_amount + offering_amount + special_offering_amount + donations_amount + other_income -
    (rent_expense + utilities_expense + ministry_expense + transportation_expense + 
     maintenance_expense + staff_expense + outreach_expense + other_expenses)
  ) STORED,
  
  -- Attendance data
  sunday_service_attendance INTEGER DEFAULT 0,
  midweek_service_attendance INTEGER DEFAULT 0,
  prayer_meeting_attendance INTEGER DEFAULT 0,
  youth_service_attendance INTEGER DEFAULT 0,
  children_service_attendance INTEGER DEFAULT 0,
  total_attendance INTEGER,
  
  -- Ministry activities
  new_converts INTEGER DEFAULT 0,
  water_baptisms INTEGER DEFAULT 0,
  spirit_baptisms INTEGER DEFAULT 0,
  home_visits INTEGER DEFAULT 0,
  hospital_visits INTEGER DEFAULT 0,
  counseling_sessions INTEGER DEFAULT 0,
  new_members INTEGER DEFAULT 0,
  
  -- Additional notes
  highlights TEXT,
  challenges TEXT,
  prayer_requests TEXT,
  upcoming_events TEXT,
  
  -- Status and approval
  status ENUM('Draft', 'Submitted', 'Reviewed', 'Approved', 'Rejected') DEFAULT 'Draft',
  submitted_at TIMESTAMP NULL,
  reviewed_by CHAR(36),
  reviewed_at TIMESTAMP NULL,
  super_admin_feedback TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE CASCADE,
  FOREIGN KEY (pastor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_weekly_reports_church (church_id),
  INDEX idx_weekly_reports_pastor (pastor_id),
  INDEX idx_weekly_reports_week (report_week_start),
  INDEX idx_weekly_reports_status (status),
  UNIQUE KEY unique_church_week (church_id, report_week_start)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
