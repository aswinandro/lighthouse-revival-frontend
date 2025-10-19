-- ============================================
-- LIGHTHOUSE REVIVAL CHURCH - SEED DATA
-- Comprehensive Sample Data for Testing
-- ============================================

-- Clear existing data (in correct order due to foreign keys)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE qr_attendance_records;
TRUNCATE TABLE qr_attendance_sessions;
TRUNCATE TABLE prayer_request_email_config;
TRUNCATE TABLE weekly_church_reports;
TRUNCATE TABLE preaching_schedules;
TRUNCATE TABLE ministry_members;
TRUNCATE TABLE ministries;
TRUNCATE TABLE event_registrations;
TRUNCATE TABLE events;
TRUNCATE TABLE course_enrollments;
TRUNCATE TABLE courses;
TRUNCATE TABLE attendance;
TRUNCATE TABLE prayer_requests;
TRUNCATE TABLE newcomers;
TRUNCATE TABLE members;
TRUNCATE TABLE user_church_roles;
TRUNCATE TABLE churches;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- USERS (Authentication)
-- ============================================
-- Password for all users: "password123" (hashed with bcrypt)
INSERT INTO users (id, email, password, first_name, last_name, phone, role, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'chiefpastor@lighthouse.org', '$2b$10$rKvVLZ8Z8Z8Z8Z8Z8Z8Z8OqKvVLZ8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8', 'John', 'Wesley', '+971501234567', 'super_admin', true),
('550e8400-e29b-41d4-a716-446655440002', 'pastor.abudhabi@lighthouse.org', '$2b$10$rKvVLZ8Z8Z8Z8Z8Z8Z8Z8OqKvVLZ8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8', 'David', 'Kumar', '+971501234568', 'church_pastor', true),
('550e8400-e29b-41d4-a716-446655440003', 'pastor.dubai@lighthouse.org', '$2b$10$rKvVLZ8Z8Z8Z8Z8Z8Z8Z8OqKvVLZ8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8', 'Samuel', 'Raj', '+971501234569', 'church_pastor', true),
('550e8400-e29b-41d4-a716-446655440004', 'leader.abudhabi@lighthouse.org', '$2b$10$rKvVLZ8Z8Z8Z8Z8Z8Z8Z8OqKvVLZ8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8', 'Mary', 'Thomas', '+971501234570', 'church_leader', true),
('550e8400-e29b-41d4-a716-446655440005', 'leader.dubai@lighthouse.org', '$2b$10$rKvVLZ8Z8Z8Z8Z8Z8Z8Z8OqKvVLZ8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8', 'Sarah', 'Joseph', '+971501234571', 'church_leader', true);

-- ============================================
-- CHURCHES
-- ============================================
INSERT INTO churches (id, name, address, city, state, country, phone, email, pastor_name, established_date, languages_offered, service_times, is_active) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Lighthouse Revival Church - Abu Dhabi', 'Mussafah Industrial Area', 'Abu Dhabi', 'Abu Dhabi', 'UAE', '+971501234567', 'abudhabi@lighthouse.org', 'Pastor David Kumar', '2015-01-15', 'English,Tamil,Hindi,Malayalam', 'Sunday 9:00 AM (English), 11:30 AM (Tamil), 2:00 PM (Hindi), 4:30 PM (Malayalam)', true),
('660e8400-e29b-41d4-a716-446655440002', 'Lighthouse Revival Church - Dubai', 'Jebel Ali Industrial Area', 'Dubai', 'Dubai', 'UAE', '+971501234568', 'dubai@lighthouse.org', 'Pastor Samuel Raj', '2018-03-20', 'English,Tamil,Malayalam', 'Sunday 9:00 AM (English), 11:30 AM (Tamil), 2:00 PM (Malayalam)', true),
('660e8400-e29b-41d4-a716-446655440003', 'Lighthouse Revival Church - Sharjah', 'Industrial Area 13', 'Sharjah', 'Sharjah', 'UAE', '+971501234569', 'sharjah@lighthouse.org', 'Pastor James Matthew', '2020-06-10', 'English,Tamil,Hindi', 'Sunday 9:00 AM (English), 11:30 AM (Tamil), 2:00 PM (Hindi)', true);

-- ============================================
-- USER-CHURCH ROLES
-- ============================================
INSERT INTO user_church_roles (id, user_id, church_id, role, assigned_by, is_active) VALUES
-- Super Admin has access to all churches
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'super_admin', NULL, true),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 'super_admin', NULL, true),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', 'super_admin', NULL, true),
-- Church Pastors
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'church_pastor', '550e8400-e29b-41d4-a716-446655440001', true),
('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'church_pastor', '550e8400-e29b-41d4-a716-446655440001', true),
-- Church Leaders
('770e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440001', 'church_leader', '550e8400-e29b-41d4-a716-446655440002', true),
('770e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440002', 'church_leader', '550e8400-e29b-41d4-a716-446655440003', true);

-- ============================================
-- MEMBERS
-- ============================================
INSERT INTO members (id, first_name, last_name, email, phone, date_of_birth, gender, city, country, membership_status, membership_date, preferred_language, church_id, qr_code, phone_verified) VALUES
-- Abu Dhabi Church Members
('880e8400-e29b-41d4-a716-446655440001', 'Rajesh', 'Kumar', 'rajesh.kumar@email.com', '+971501111001', '1985-05-15', 'Male', 'Abu Dhabi', 'UAE', 'Active', '2020-01-10', 'Tamil', '660e8400-e29b-41d4-a716-446655440001', 'QR-ABD-001', true),
('880e8400-e29b-41d4-a716-446655440002', 'Priya', 'Sharma', 'priya.sharma@email.com', '+971501111002', '1990-08-22', 'Female', 'Abu Dhabi', 'UAE', 'Active', '2020-03-15', 'Hindi', '660e8400-e29b-41d4-a716-446655440001', 'QR-ABD-002', true),
('880e8400-e29b-41d4-a716-446655440003', 'Thomas', 'George', 'thomas.george@email.com', '+971501111003', '1982-12-10', 'Male', 'Abu Dhabi', 'UAE', 'Elder', '2015-06-20', 'Malayalam', '660e8400-e29b-41d4-a716-446655440001', 'QR-ABD-003', true),
('880e8400-e29b-41d4-a716-446655440004', 'Anita', 'Joseph', 'anita.joseph@email.com', '+971501111004', '1988-03-18', 'Female', 'Abu Dhabi', 'UAE', 'Active', '2019-09-05', 'English', '660e8400-e29b-41d4-a716-446655440001', 'QR-ABD-004', true),
('880e8400-e29b-41d4-a716-446655440005', 'Suresh', 'Babu', 'suresh.babu@email.com', '+971501111005', '1975-11-30', 'Male', 'Abu Dhabi', 'UAE', 'Lifetime', '2015-01-15', 'Tamil', '660e8400-e29b-41d4-a716-446655440001', 'QR-ABD-005', true),
-- Dubai Church Members
('880e8400-e29b-41d4-a716-446655440006', 'John', 'Peter', 'john.peter@email.com', '+971502222001', '1987-07-25', 'Male', 'Dubai', 'UAE', 'Active', '2021-02-14', 'English', '660e8400-e29b-41d4-a716-446655440002', 'QR-DXB-001', true),
('880e8400-e29b-41d4-a716-446655440007', 'Grace', 'Matthew', 'grace.matthew@email.com', '+971502222002', '1992-04-12', 'Female', 'Dubai', 'UAE', 'Active', '2021-05-20', 'Malayalam', '660e8400-e29b-41d4-a716-446655440002', 'QR-DXB-002', true),
('880e8400-e29b-41d4-a716-446655440008', 'Vijay', 'Rajan', 'vijay.rajan@email.com', '+971502222003', '1983-09-08', 'Male', 'Dubai', 'UAE', 'Elder', '2018-03-20', 'Tamil', '660e8400-e29b-41d4-a716-446655440002', 'QR-DXB-003', true),
('880e8400-e29b-41d4-a716-446655440009', 'Esther', 'Samuel', 'esther.samuel@email.com', '+971502222004', '1995-01-28', 'Female', 'Dubai', 'UAE', 'Active', '2022-01-10', 'English', '660e8400-e29b-41d4-a716-446655440002', 'QR-DXB-004', true),
('880e8400-e29b-41d4-a716-446655440010', 'Daniel', 'Abraham', 'daniel.abraham@email.com', '+971502222005', '1980-06-15', 'Male', 'Dubai', 'UAE', 'Deacon', '2019-08-12', 'Malayalam', '660e8400-e29b-41d4-a716-446655440002', 'QR-DXB-005', true);

-- ============================================
-- NEWCOMERS
-- ============================================
INSERT INTO newcomers (id, first_name, last_name, email, phone, visit_date, preferred_language, how_did_you_hear, follow_up_status, church_id) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'Amit', 'Patel', 'amit.patel@email.com', '+971503333001', '2024-01-07', 'Hindi', 'Friend Invitation', 'Contacted', '660e8400-e29b-41d4-a716-446655440001'),
('990e8400-e29b-41d4-a716-446655440002', 'Lisa', 'Thomas', 'lisa.thomas@email.com', '+971503333002', '2024-01-14', 'English', 'Social Media', 'Scheduled', '660e8400-e29b-41d4-a716-446655440001'),
('990e8400-e29b-41d4-a716-446655440003', 'Ravi', 'Krishnan', 'ravi.krishnan@email.com', '+971504444001', '2024-01-10', 'Tamil', 'Walk-in', 'Pending', '660e8400-e29b-41d4-a716-446655440002'),
('990e8400-e29b-41d4-a716-446655440004', 'Maria', 'Francis', 'maria.francis@email.com', '+971504444002', '2024-01-15', 'Malayalam', 'Friend Invitation', 'Contacted', '660e8400-e29b-41d4-a716-446655440002');

-- ============================================
-- ATTENDANCE RECORDS
-- ============================================
INSERT INTO attendance (id, member_id, service_date, service_type, language, present, church_id) VALUES
-- Abu Dhabi - Recent Sunday Services
('aa0e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '2024-01-14', 'Sunday Service', 'Tamil', true, '660e8400-e29b-41d4-a716-446655440001'),
('aa0e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', '2024-01-14', 'Sunday Service', 'Hindi', true, '660e8400-e29b-41d4-a716-446655440001'),
('aa0e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440003', '2024-01-14', 'Sunday Service', 'Malayalam', true, '660e8400-e29b-41d4-a716-446655440001'),
('aa0e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440004', '2024-01-14', 'Sunday Service', 'English', true, '660e8400-e29b-41d4-a716-446655440001'),
-- Dubai - Recent Sunday Services
('aa0e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440006', '2024-01-14', 'Sunday Service', 'English', true, '660e8400-e29b-41d4-a716-446655440002'),
('aa0e8400-e29b-41d4-a716-446655440006', '880e8400-e29b-41d4-a716-446655440007', '2024-01-14', 'Sunday Service', 'Malayalam', true, '660e8400-e29b-41d4-a716-446655440002'),
('aa0e8400-e29b-41d4-a716-446655440007', '880e8400-e29b-41d4-a716-446655440008', '2024-01-14', 'Sunday Service', 'Tamil', true, '660e8400-e29b-41d4-a716-446655440002');

-- ============================================
-- COURSES
-- ============================================
INSERT INTO courses (id, name, description, course_type, duration_weeks, language, instructor_id, start_date, end_date, status, church_id) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', 'Father''s House Bible Study', 'Comprehensive Bible study for new believers', 'Bible Study', 12, 'English', '880e8400-e29b-41d4-a716-446655440003', '2024-01-15', '2024-04-08', 'Active', '660e8400-e29b-41d4-a716-446655440001'),
('bb0e8400-e29b-41d4-a716-446655440002', 'Life in Christ', 'Foundational Christian living course', 'New Believers', 8, 'Tamil', '880e8400-e29b-41d4-a716-446655440001', '2024-02-01', '2024-03-25', 'Active', '660e8400-e29b-41d4-a716-446655440001'),
('bb0e8400-e29b-41d4-a716-446655440003', 'Leadership Training', 'Developing church leaders', 'Leadership Training', 16, 'English', '880e8400-e29b-41d4-a716-446655440008', '2024-01-20', '2024-05-12', 'Active', '660e8400-e29b-41d4-a716-446655440002');

-- ============================================
-- EVENTS
-- ============================================
INSERT INTO events (id, title, description, event_date, start_time, end_time, event_type, language, status, church_id) VALUES
('cc0e8400-e29b-41d4-a716-446655440001', 'New Year Revival Service', 'Special revival service to start the year', '2024-01-01', '18:00:00', '21:00:00', 'Service', 'Multi-Language', 'Completed', '660e8400-e29b-41d4-a716-446655440001'),
('cc0e8400-e29b-41d4-a716-446655440002', 'Youth Conference 2024', 'Annual youth conference with special speakers', '2024-02-15', '09:00:00', '17:00:00', 'Conference', 'English', 'Upcoming', '660e8400-e29b-41d4-a716-446655440001'),
('cc0e8400-e29b-41d4-a716-446655440003', 'Community Outreach', 'Reaching out to the local community', '2024-01-25', '14:00:00', '18:00:00', 'Outreach', 'Multi-Language', 'Upcoming', '660e8400-e29b-41d4-a716-446655440002');

-- ============================================
-- PRAYER REQUESTS
-- ============================================
INSERT INTO prayer_requests (id, requester_name, requester_email, requester_phone, request_text, request_type, priority, status, church_id) VALUES
('dd0e8400-e29b-41d4-a716-446655440001', 'Rajesh Kumar', 'rajesh.kumar@email.com', '+971501111001', 'Prayer for job opportunity', 'Financial', 'High', 'Praying', '660e8400-e29b-41d4-a716-446655440001'),
('dd0e8400-e29b-41d4-a716-446655440002', 'Anonymous', NULL, NULL, 'Healing for family member', 'Health', 'Urgent', 'Open', '660e8400-e29b-41d4-a716-446655440001'),
('dd0e8400-e29b-41d4-a716-446655440003', 'John Peter', 'john.peter@email.com', '+971502222001', 'Guidance for ministry direction', 'Spiritual', 'Medium', 'Praying', '660e8400-e29b-41d4-a716-446655440002');

-- ============================================
-- MINISTRIES
-- ============================================
INSERT INTO ministries (id, name, description, ministry_type, leader_id, status, church_id) VALUES
('ee0e8400-e29b-41d4-a716-446655440001', 'Worship Team', 'Leading worship services', 'Worship', '880e8400-e29b-41d4-a716-446655440003', 'Active', '660e8400-e29b-41d4-a716-446655440001'),
('ee0e8400-e29b-41d4-a716-446655440002', 'Youth Ministry', 'Ministry for young people', 'Youth', '880e8400-e29b-41d4-a716-446655440004', 'Active', '660e8400-e29b-41d4-a716-446655440001'),
('ee0e8400-e29b-41d4-a716-446655440003', 'Prayer Ministry', 'Intercessory prayer team', 'Prayer', '880e8400-e29b-41d4-a716-446655440007', 'Active', '660e8400-e29b-41d4-a716-446655440002'),
('ee0e8400-e29b-41d4-a716-446655440004', 'Children Ministry', 'Sunday school and children programs', 'Children', '880e8400-e29b-41d4-a716-446655440009', 'Active', '660e8400-e29b-41d4-a716-446655440002');

-- ============================================
-- PREACHING SCHEDULES
-- ============================================
INSERT INTO preaching_schedules (id, church_id, assigned_pastor_id, week_start_date, week_end_date, assigned_topic, assigned_scripture, super_admin_comments, status, assigned_by) VALUES
('ff0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '2024-01-21', '2024-01-27', 'The Power of Faith', 'Hebrews 11:1-6', 'Focus on practical applications of faith in daily life', 'Scheduled', '550e8400-e29b-41d4-a716-446655440001'),
('ff0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '2024-01-21', '2024-01-27', 'Walking in Love', '1 Corinthians 13', 'Emphasize love as the foundation of Christian life', 'Scheduled', '550e8400-e29b-41d4-a716-446655440001'),
('ff0e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '2024-01-14', '2024-01-20', 'New Beginnings', 'Isaiah 43:18-19', 'Encourage the congregation for the new year', 'Completed', '550e8400-e29b-41d4-a716-446655440001');

-- Update completed schedule with actual data
UPDATE preaching_schedules SET 
  actual_topic_preached = 'New Beginnings in Christ',
  actual_scripture = 'Isaiah 43:18-19, 2 Corinthians 5:17',
  pastor_notes = 'Great response from congregation. Many came forward for prayer.',
  attendance_count = 245,
  new_converts = 3,
  completed_at = '2024-01-14 12:00:00'
WHERE id = 'ff0e8400-e29b-41d4-a716-446655440003';

-- ============================================
-- WEEKLY CHURCH REPORTS
-- ============================================
INSERT INTO weekly_church_reports (
  id, church_id, pastor_id, report_week_start, report_week_end,
  tithe_amount, offering_amount, special_offering_amount,
  rent_expense, utilities_expense, ministry_expense, transportation_expense,
  sunday_service_attendance, midweek_service_attendance, prayer_meeting_attendance,
  new_converts, water_baptisms, home_visits, hospital_visits,
  highlights, status, submitted_at
) VALUES
('gg0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 
 '2024-01-07', '2024-01-13',
 15000.00, 8500.00, 3200.00,
 5000.00, 1200.00, 2500.00, 1800.00,
 245, 120, 85,
 3, 0, 12, 5,
 'Excellent week with good attendance. New Year revival brought many visitors.', 'Approved', '2024-01-14 10:00:00'),
('gg0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003',
 '2024-01-07', '2024-01-13',
 12500.00, 6800.00, 2100.00,
 4500.00, 1000.00, 1800.00, 1500.00,
 180, 95, 65,
 2, 1, 8, 3,
 'Good start to the year. Youth ministry showing strong growth.', 'Approved', '2024-01-14 11:00:00');

-- ============================================
-- PRAYER EMAIL CONFIGURATION
-- ============================================
INSERT INTO prayer_request_email_config (id, church_id, leader_name, leader_email, leader_role, is_active, priority_order, created_by) VALUES
('hh0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Pastor David Kumar', 'pastor.abudhabi@lighthouse.org', 'Senior Pastor', true, 1, '550e8400-e29b-41d4-a716-446655440001'),
('hh0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Mary Thomas', 'leader.abudhabi@lighthouse.org', 'Prayer Coordinator', true, 2, '550e8400-e29b-41d4-a716-446655440001'),
('hh0e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'Pastor Samuel Raj', 'pastor.dubai@lighthouse.org', 'Senior Pastor', true, 1, '550e8400-e29b-41d4-a716-446655440001'),
('hh0e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', 'Sarah Joseph', 'leader.dubai@lighthouse.org', 'Prayer Coordinator', true, 2, '550e8400-e29b-41d4-a716-446655440001');

-- ============================================
-- QR ATTENDANCE SESSIONS
-- ============================================
INSERT INTO qr_attendance_sessions (id, church_id, session_name, session_date, session_time, service_type, language, qr_code, is_active, created_by) VALUES
('ii0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Sunday Service - English', '2024-01-21', '09:00:00', 'Sunday Service', 'English', 'QR-SESSION-ABD-ENG-20240121', true, '550e8400-e29b-41d4-a716-446655440002'),
('ii0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Sunday Service - Tamil', '2024-01-21', '11:30:00', 'Sunday Service', 'Tamil', 'QR-SESSION-ABD-TAM-20240121', true, '550e8400-e29b-41d4-a716-446655440002'),
('ii0e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'Sunday Service - English', '2024-01-21', '09:00:00', 'Sunday Service', 'English', 'QR-SESSION-DXB-ENG-20240121', true, '550e8400-e29b-41d4-a716-446655440003');

-- ============================================
-- SEED DATA COMPLETE
-- ============================================
