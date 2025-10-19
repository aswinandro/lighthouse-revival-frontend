"use client";

import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import MembersManagement from "@/components/dashboard/members-management";
import { NewcomersManagement } from "@/components/dashboard/newcomers-management";
import { AttendanceManagement } from "@/components/dashboard/attendance-management";
import { CoursesManagement } from "@/components/dashboard/courses-management";
import { EventsManagement } from "@/components/dashboard/events-management";
import { PrayerRequestsManagement } from "@/components/dashboard/prayer-requests-management";
import { MinistriesManagement } from "@/components/dashboard/ministries-management";
import { ChurchesManagement } from "@/components/dashboard/churches-management";
import { PreachingSchedulesManagement } from "@/components/dashboard/preaching-schedules-management";
import { WeeklyReportsManagement } from "@/components/dashboard/weekly-reports-management";
import { EmailConfigManagement } from "@/components/dashboard/email-config-management";

// Export a mapping of tab IDs to components
export const dashboardTabComponents = {
  overview: DashboardOverview,
  members: MembersManagement,
  newcomers: NewcomersManagement,
  attendance: AttendanceManagement,
  courses: CoursesManagement,
  events: EventsManagement,
  prayers: PrayerRequestsManagement,
  ministries: MinistriesManagement,
  churches: ChurchesManagement,
  schedules: PreachingSchedulesManagement,
  reports: WeeklyReportsManagement,
  "email-config": EmailConfigManagement,
};

// This page is rendered by the layout, so we return null here
export default function DashboardPage() {
  return null;
}
