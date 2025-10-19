# Database Migrations and Seeds

This directory contains MySQL database migrations and seed data for the Lighthouse Revival Church Management System.

## Directory Structure

\`\`\`
scripts/
├── migrations/          # Database schema migrations
│   └── 001-initial-schema.sql
├── seeds/              # Sample data for testing
│   └── 001-seed-initial-data.sql
└── README.md           # This file
\`\`\`

## Running Migrations

### Option 1: Using MySQL Command Line

\`\`\`bash
# Navigate to backend directory
cd backend

# Run migration
mysql -u your_username -p your_database < src/scripts/migrations/001-initial-schema.sql

# Run seed data
mysql -u your_username -p your_database < src/scripts/seeds/001-seed-initial-data.sql
\`\`\`

### Option 2: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your database
3. Open the migration file: `File > Open SQL Script`
4. Execute the script: `Query > Execute (All or Selection)`
5. Repeat for seed file

### Option 3: Using Node.js Script

\`\`\`bash
cd backend
npm run migrate
npm run seed
\`\`\`

## Migration Files

### 001-initial-schema.sql

Complete database schema including:

- **Core Tables**: users, churches, user_church_roles
- **Member Management**: members, newcomers
- **Attendance**: attendance, qr_attendance_sessions, qr_attendance_records
- **Education**: courses, course_enrollments
- **Events**: events, event_registrations
- **Prayer**: prayer_requests, prayer_request_email_config
- **Ministries**: ministries, ministry_members
- **Church Management**: preaching_schedules, weekly_church_reports

**Features:**
- UUID primary keys
- Foreign key constraints
- Indexes for performance
- ENUM types for status fields
- Generated columns for calculations
- Proper cascading deletes

## Seed Data

### 001-seed-initial-data.sql

Sample data for testing including:

- **3 Churches**: Abu Dhabi, Dubai, Sharjah
- **5 Users**: 1 Super Admin, 2 Church Pastors, 2 Church Leaders
- **10 Members**: Distributed across churches
- **4 Newcomers**: Recent visitors
- **Attendance Records**: Recent service attendance
- **3 Courses**: Active Bible studies
- **3 Events**: Past and upcoming events
- **3 Prayer Requests**: Various types
- **4 Ministries**: Worship, Youth, Prayer, Children
- **Preaching Schedules**: Current and upcoming
- **2 Weekly Reports**: Approved financial reports
- **Prayer Email Config**: Email routing setup
- **3 QR Sessions**: Active attendance sessions

**Test Credentials:**
- Email: `chiefpastor@lighthouse.org`
- Password: `password123`
- Role: Super Admin

## Database Schema Overview

### User Roles Hierarchy

1. **Super Admin (Chief Pastor)**
   - Full access to all churches
   - Create/manage churches
   - Assign roles
   - View consolidated reports

2. **Church Pastor**
   - Manage assigned church
   - Submit weekly reports
   - Create QR sessions
   - Manage members

3. **Church Leader**
   - Assist pastor
   - Manage ministries
   - Follow up newcomers

4. **Church Believer**
   - Regular member
   - View own data

### Key Features

#### Multi-Church Management
- Multiple churches under one system
- User-church role assignments
- Church-specific data isolation

#### Financial Tracking
- Weekly income (tithe, offerings, donations)
- Detailed expense categories
- Automatic calculations
- Approval workflow

#### QR Attendance System
- Generate QR codes for services
- Automatic member recognition
- Newcomer sign-up flow
- Real-time attendance tracking

#### Preaching Schedules
- Super admin assigns topics
- Pastor reports actual sermon
- Attendance tracking
- New converts recording

#### Comprehensive Reporting
- Individual church reports
- Consolidated multi-church reports
- Financial summaries
- Attendance analytics

## Important Notes

### Before Running Migrations

1. **Backup existing data** if running on production
2. **Update connection settings** in `.env` file
3. **Ensure MySQL version** 8.0 or higher
4. **Check user permissions** for CREATE, DROP, ALTER

### After Running Migrations

1. **Verify all tables created**: Run `SHOW TABLES;`
2. **Check foreign keys**: Run `SHOW CREATE TABLE table_name;`
3. **Test with seed data**: Verify data integrity
4. **Update application config**: Ensure connection works

### Password Hashing

The seed data includes bcrypt-hashed passwords. In production:
- Use proper bcrypt hashing (cost factor 10+)
- Never store plain text passwords
- Implement password reset functionality

### Security Considerations

1. **Change default passwords** immediately
2. **Use environment variables** for sensitive data
3. **Enable SSL** for database connections
4. **Implement rate limiting** on authentication
5. **Regular backups** of production data

## Troubleshooting

### Common Issues

**Error: Table already exists**
\`\`\`sql
-- Drop all tables first
SET FOREIGN_KEY_CHECKS = 0;
-- Drop tables in reverse order
SET FOREIGN_KEY_CHECKS = 1;
\`\`\`

**Error: Foreign key constraint fails**
- Ensure parent tables exist before child tables
- Check referenced IDs exist in parent tables
- Verify foreign key column types match

**Error: UUID() function not found**
- Requires MySQL 8.0+
- Alternative: Use `CHAR(36)` with application-generated UUIDs

**Error: Generated column syntax**
- Requires MySQL 5.7.6+
- Use `GENERATED ALWAYS AS (...) STORED`

## Maintenance

### Regular Tasks

1. **Backup Database**
   \`\`\`bash
   mysqldump -u username -p database_name > backup.sql
   \`\`\`

2. **Optimize Tables**
   \`\`\`sql
   OPTIMIZE TABLE table_name;
   \`\`\`

3. **Analyze Performance**
   \`\`\`sql
   EXPLAIN SELECT * FROM table_name WHERE condition;
   \`\`\`

4. **Update Statistics**
   \`\`\`sql
   ANALYZE TABLE table_name;
   \`\`\`

## Support

For issues or questions:
- Check application logs
- Review MySQL error logs
- Contact system administrator
- Refer to main README.md

## Version History

- **v1.0** (2024-01-20): Initial schema with all core features
  - Multi-church management
  - QR attendance system
  - Financial tracking
  - Preaching schedules
  - Comprehensive reporting
