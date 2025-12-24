// API Client for communicating with Express backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface RequestOptions extends RequestInit {
  token?: string
}

export interface AuthResponse {
  status: string;
  data: {
    user: any;
    token: string;
  };
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {

    const { token, ...fetchOptions } = options

    // Use Record<string, string> for headers to avoid TS7053 error
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(fetchOptions.headers as Record<string, string> | undefined),
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...fetchOptions,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`,
      }))
      const msg = (error && typeof error === 'object' && error.message)
        ? error.message
        : `HTTP error! status: ${response.status}`;
      throw new Error(msg)
    }

    return response.json()
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    emirate?: string;
    city?: string;
    country?: string;
    churchId?: string;
  }) {
    return this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getCurrentUser(token: string) {
    return this.request("/auth/me", { token })
  }

  // Members endpoints
  async getMembers(token: string, params?: { churchId?: string; status?: string; language?: string; search?: string }) {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : ""
    return this.request(`/members${queryString}`, { token })
  }

  async getMembersByChurch(churchId: string, token: string) {
    return this.request(`/members/church/${churchId}`, { token })
  }

  async getMember(id: string, token: string) {
    return this.request(`/members/${id}`, { token })
  }

  async createMember(data: any, token: string) {
    return this.request("/members", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    })
  }

  async updateMember(id: string, data: any, token: string) {
    return this.request(`/members/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    })
  }

  async deleteMember(id: string, token: string) {
    return this.request(`/members/${id}`, {
      method: "DELETE",
      token,
    })
  }

  // Newcomers endpoints
  async getNewcomers(token: string) {
    return this.request("/newcomers", { token })
  }

  async createNewcomer(data: any, token: string) {
    return this.request("/newcomers", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    })
  }

  async updateNewcomer(id: string, data: any, token: string) {
    return this.request(`/newcomers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    })
  }

  async deleteNewcomer(id: string, token: string) {
    return this.request(`/newcomers/${id}`, {
      method: "DELETE",
      token,
    })
  }

  // Attendance endpoints
  async getAttendance(token: string, params?: { startDate?: string; endDate?: string }) {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : ""
    return this.request(`/attendance${queryString}`, { token })
  }

  async getAttendanceStats(token: string, params?: { startDate?: string; endDate?: string; churchId?: string }) {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : ""
    return this.request(`/attendance/stats${queryString}`, { token })
  }

  async recordAttendance(data: any, token: string) {
    return this.request("/attendance", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    })
  }

  // Prayer Requests endpoints
  async getPrayerRequests(token: string, params?: any) {
    let url = "/prayer-requests"
    if (params) {
      const queryString = new URLSearchParams(params).toString()
      url += `?${queryString}`
    }
    return this.request(url, { token })
  }

  async createPrayerRequest(data: any, token: string) {
    return this.request("/prayer-requests", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    })
  }


  async updatePrayerRequest(id: string, data: any, token: string) {
    return this.request(`/prayer-requests/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    })
  }

  async submitPublicPrayerRequest(data: any) {
    return this.request("/prayer-requests/public", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Events endpoints
  async getEvents(token: string) {
    return this.request("/events", { token })
  }

  async createEvent(data: any, token: string) {
    return this.request("/events", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    })
  }

  async updateEvent(id: string, data: any, token: string) {
    return this.request(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    })
  }

  async deleteEvent(id: string, token: string) {
    return this.request(`/events/${id}`, {
      method: "DELETE",
      token,
    })
  }

  async getEventRegistrations(id: string, token: string) {
    return this.request(`/events/${id}/registrations`, { token })
  }

  async registerForEvent(id: string, data: any, token: string) {
    return this.request(`/events/${id}/register`, {
      method: "POST",
      body: JSON.stringify(data),
      token,
    })
  }

  // Courses endpoints
  async getCourses(token: string) {
    return this.request("/courses", { token })
  }

  async createCourse(data: any, token: string) {
    return this.request("/courses", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    })
  }

  async updateCourse(id: string, data: any, token: string) {
    return this.request(`/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    })
  }

  async getCourseEnrollments(id: string, token: string) {
    return this.request(`/courses/${id}/enrollments`, { token })
  }

  async enrollMember(id: string, data: { memberId: string }, token: string) {
    return this.request(`/courses/${id}/enroll`, {
      method: "POST",
      body: JSON.stringify(data),
      token,
    })
  }

  // Ministries endpoints
  async getMinistries(token: string) {
    return this.request("/ministries", { token })
  }

  async createMinistry(data: any, token: string) {
    return this.request("/ministries", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    })
  }

  async updateMinistry(id: string, data: any, token: string) {
    return this.request(`/ministries/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    })
  }

  async getMinistryMembers(id: string, token: string) {
    return this.request(`/ministries/${id}/members`, { token })
  }

  async addMinistryMember(id: string, data: { memberId: string; role: string }, token: string) {
    return this.request(`/ministries/${id}/members`, {
      method: "POST",
      body: JSON.stringify(data),
      token,
    })
  }

  // Dashboard endpoints
  async getDashboardOverview(token: string, churchId?: string) {
    const url = churchId ? `/dashboard/overview?churchId=${churchId}` : "/dashboard/overview"
    return this.request(url, { token })
  }

  async getAttendanceTrends(token: string, churchId?: string) {
    const url = churchId ? `/dashboard/attendance-trends?churchId=${churchId}` : "/dashboard/attendance-trends"
    return this.request(url, { token })
  }

  async getLanguageDistribution(token: string, churchId?: string) {
    const url = churchId ? `/dashboard/language-distribution?churchId=${churchId}` : "/dashboard/language-distribution"
    return this.request(url, { token })
  }

  async getRecentActivity(token: string, churchId?: string) {
    const url = churchId ? `/dashboard/recent-activity?churchId=${churchId}` : "/dashboard/recent-activity"
    return this.request(url, { token })
  }

  // Churches endpoints
  async getChurches(token: string) {
    return this.request("/churches", { token })
  }

  async getPublicChurches(): Promise<any[]> {
    const res: any = await this.request("/churches/public/list")
    return res.data || res
  }

  async getChurch(id: string, token: string) {
    return this.request(`/churches/${id}`, { token })
  }

  async createChurch(data: any, token: string) {
    return this.request("/churches", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    })
  }

  async updateChurch(id: string, data: any, token: string) {
    return this.request(`/churches/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    })
  }

  async deleteChurch(id: string, token: string) {
    return this.request(`/churches/${id}`, {
      method: "DELETE",
      token,
    })
  }

  async assignUserToChurch(churchId: string, data: { userId: string; role: string }, token: string) {
    return this.request(`/churches/${churchId}/users`, {
      method: "POST",
      body: JSON.stringify(data),
      token,
    })
  }

  async unassignUserFromChurch(churchId: string, userId: string, token: string) {
    return this.request(`/churches/${churchId}/users`, {
      method: "DELETE",
      body: JSON.stringify({ userId }),
      token,
    })
  }

  async getChurchMembers(churchId: string, token: string) {
    return this.request(`/churches/${churchId}/members`, { token })
  }

  async getChurchUsers(churchId: string, token: string) {
    return this.request(`/churches/${churchId}/users`, { token })
  }

  async getChurchReports(churchId: string, token: string) {
    return this.request(`/churches/${churchId}/reports`, { token })
  }

  // Preaching Schedules endpoints
  async getPreachingSchedules(token: string, params?: { churchId?: string; startDate?: string; endDate?: string }) {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : ""
    return this.request(`/preaching-schedules${queryString}`, { token })
  }

  async getPreachingSchedule(id: string, token: string) {
    return this.request(`/preaching-schedules/${id}`, { token })
  }

  async createPreachingSchedule(data: any, token: string) {
    return this.request("/preaching-schedules", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    })
  }

  async updatePreachingSchedule(id: string, data: any, token: string) {
    return this.request(`/preaching-schedules/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    })
  }

  async deletePreachingSchedule(id: string, token: string) {
    return this.request(`/preaching-schedules/${id}`, {
      method: "DELETE",
      token,
    })
  }

  async submitPreachingReport(id: string, data: { actualTopic: string; notes: string }, token: string) {
    return this.request(`/preaching-schedules/${id}/submit-report`, {
      method: "POST",
      body: JSON.stringify(data),
      token,
    })
  }

  // Weekly Reports endpoints (Financial tracking, tithes, expenses)
  async getWeeklyReports(
    token: string,
    params?: { churchId?: string; pastorId?: string; status?: string; startDate?: string; endDate?: string },
  ) {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : ""
    return this.request(`/weekly-reports${queryString}`, { token })
  }

  async getWeeklyReport(id: string, token: string) {
    return this.request(`/weekly-reports/${id}`, { token })
  }

  async createWeeklyReport(data: any, token: string) {
    return this.request("/weekly-reports", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    })
  }

  async updateWeeklyReport(id: string, data: any, token: string) {
    return this.request(`/weekly-reports/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    })
  }

  async submitWeeklyReport(id: string, token: string) {
    return this.request(`/weekly-reports/${id}/submit`, {
      method: "POST",
      token,
    })
  }

  async reviewWeeklyReport(id: string, data: { status: string; feedback?: string }, token: string) {
    return this.request(`/weekly-reports/${id}/review`, {
      method: "POST",
      body: JSON.stringify(data),
      token,
    })
  }

  async getFinancialSummary(token: string, params?: { churchId?: string; startDate?: string; endDate?: string }) {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : ""
    return this.request(`/weekly-reports/summary${queryString}`, { token })
  }

  // Prayer Email Config endpoints
  async getPrayerEmailConfigs(token: string, churchId?: string) {
    const queryString = churchId ? `?churchId=${churchId}` : ""
    return this.request(`/prayer-email-config${queryString}`, { token })
  }

  async createPrayerEmailConfig(data: any, token: string) {
    return this.request("/prayer-email-config", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    })
  }

  async updatePrayerEmailConfig(id: string, data: any, token: string) {
    return this.request(`/prayer-email-config/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    })
  }

  async deletePrayerEmailConfig(id: string, token: string) {
    return this.request(`/prayer-email-config/${id}`, {
      method: "DELETE",
      token,
    })
  }

  // QR Attendance endpoints
  async createQRSession(data: any, token: string) {
    return this.request("/qr-attendance/sessions", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    })
  }

  async getQRSessions(
    churchId: string,
    token: string,
    params?: { isActive?: boolean; startDate?: string; endDate?: string },
  ) {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : ""
    return this.request(`/qr-attendance/sessions/${churchId}${queryString}`, { token })
  }

  async scanQRCode(data: { qrCode: string; phone?: string; email?: string }) {
    return this.request("/qr-attendance/scan", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async quickSignUp(data: any) {
    return this.request("/qr-attendance/quick-signup", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getSessionAttendance(sessionId: string, token: string) {
    return this.request(`/qr-attendance/sessions/${sessionId}/attendance`, { token })
  }

  async deactivateQRSession(sessionId: string, token: string) {
    return this.request(`/qr-attendance/sessions/${sessionId}/deactivate`, {
      method: "PATCH",
      token,
    })
  }

  async getMemberAttendanceHistory(memberId: string, token: string, params?: { startDate?: string; endDate?: string }) {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : ""
    return this.request(`/qr-attendance/members/${memberId}/history${queryString}`, { token })
  }

  async getMyEnrollments(token: string) {
    return this.request("/courses/my-enrollments", { token })
  }

  async getMemberAttendance(token: string, memberId: string) {
    return this.request(`/attendance?memberId=${memberId}`, { token })
  }

  async getMyMemberProfile(token: string) {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.email) return { data: null }

    const result: any = await this.request(`/members?search=${user.email}`, { token })
    return { data: result.data?.[0] || null }
  }

  // Users endpoints
  async getUsers(token: string, params?: { role?: string; churchId?: string }) {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : ""
    return this.request(`/users${queryString}`, { token })
  }

  async getQRSessionPublicInfo(sessionId: string) {
    return this.request(`/qr-attendance/sessions/public/${sessionId}`)
  }

  async getLatestActiveSession(churchId?: string) {
    const queryString = churchId ? `?churchId=${churchId}` : ""
    return this.request(`/qr-attendance/sessions/active/latest${queryString}`)
  }
}

export const apiClient = new ApiClient(API_URL)
