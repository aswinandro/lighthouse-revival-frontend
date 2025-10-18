import { Church } from "@/components/providers/church-context"

export async function fetchChurches(): Promise<Church[]> {
  // TODO: Replace with actual API call
  return [
    {
      id: "1",
      name: "Lighthouse Revival Church International - Abu Dhabi",
      city: "Abu Dhabi",
      country: "UAE",
      role: "super_admin",
    },
    {
      id: "2",
      name: "Lighthouse Revival Church - Dubai",
      city: "Dubai",
      country: "UAE",
      role: "church_pastor",
    },
  ]
}

export async function fetchSelectedChurch(churches: Church[]): Promise<Church | null> {
  const savedChurchId = typeof window !== "undefined" ? localStorage.getItem("selectedChurchId") : null
  if (savedChurchId) {
    const savedChurch = churches.find((c) => c.id === savedChurchId)
    if (savedChurch) return savedChurch
  }
  return churches.length > 0 ? churches[0] : null
}
