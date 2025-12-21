import { apiClient } from "../api-client";
import { getToken } from "../utils";

export async function fetchDashboardOverview() {
  const token = getToken();
  if (!token) {
    console.warn('No token found, redirecting to login');
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("No token found. Redirecting to login.");
  }

  try {
    return await apiClient.getDashboardOverview(token);
  } catch (error: any) {
    if (error.message.includes("401")) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      throw new Error("Session expired. Redirecting to login.");
    }
    throw error;
  }
}

export async function fetchAttendanceTrends() {
  const token = getToken();
  if (!token) {
    console.warn('No token found, redirecting to login');
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("No token found. Redirecting to login.");
  }

  try {
    return await apiClient.getAttendanceTrends(token);
  } catch (error: any) {
    if (error.message.includes("401")) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      throw new Error("Session expired. Redirecting to login.");
    }
    throw error;
  }
}
