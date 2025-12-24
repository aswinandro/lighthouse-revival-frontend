import { Church } from "@/components/providers/church-context"

export async function fetchChurches(): Promise<Church[]> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://lighthouse-backend.lighthousevercel.workers.dev/api"
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const res = await fetch(`${API_URL}/churches`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
    if (!res.ok) throw new Error("Failed to fetch churches")
    const data = await res.json()
    // Map backend data to Church type (add role if needed)
    return (data.data || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      city: c.city,
      country: c.country,
      role: c.user_role || c.role || "member", // use user_role from backend
    }))
  } catch (e) {
    return []
  }
}

export async function fetchSelectedChurch(churches: Church[]): Promise<Church | null> {
  const savedChurchId = typeof window !== "undefined" ? localStorage.getItem("selectedChurchId") : null
  if (savedChurchId) {
    const savedChurch = churches.find((c) => c.id === savedChurchId)
    if (savedChurch) return savedChurch
  }
  return churches.length > 0 ? churches[0] : null
}
