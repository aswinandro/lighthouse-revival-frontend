import { getToken } from "../utils";

const BASE_URL = "http://localhost:5000";

export async function fetchDashboardOverview() {
  const token = getToken();
  if (!token) {
    console.warn('No token found, redirecting to login');
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("No token found. Redirecting to login.");
  }
  console.log('Frontend: Sending token', token);
  const res = await fetch(`${BASE_URL}/api/dashboard/overview`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Session expired. Redirecting to login.");
  }
  if (!res.ok) throw new Error("Failed to fetch dashboard overview");
  return res.json();
}


export async function fetchAttendanceTrends() {
  const token = getToken();
  if (!token) {
    console.warn('No token found, redirecting to login');
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("No token found. Redirecting to login.");
  }
  const res = await fetch(`${BASE_URL}/api/dashboard/attendance-trends`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Session expired. Redirecting to login.");
  }
  if (!res.ok) throw new Error("Failed to fetch attendance trends");
  return res.json();
}
