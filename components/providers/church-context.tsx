"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { usePathname } from "next/navigation"

export interface Church {
  id: string
  name: string
  city: string
  country: string
  role: "super_admin" | "church_pastor" | "church_leader" | "member"
}

interface ChurchContextType {
  selectedChurch: Church | null
  churches: Church[]
  setSelectedChurch: (church: Church) => void
  userRole: string
  isLoading: boolean
  refresh: () => Promise<void>
}

const ChurchContext = createContext<ChurchContextType | undefined>(undefined)

export function ChurchProvider({ children }: { children: React.ReactNode }) {
  const [selectedChurch, setSelectedChurch] = useState<Church | null>(null)
  const [churches, setChurches] = useState<Church[]>([])
  const [userRole, setUserRole] = useState<string>("member")
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const lastPathname = useRef<string | null>(null)

  const loadChurches = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true)
    try {
      // Check user's global role from localStorage
      const storedUser = typeof window !== 'undefined' ? localStorage.getItem("user") : null
      let globalRole = "user" // default fallback

      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          if (userData.role) {
            globalRole = userData.role
          }
        } catch (e) {
          console.error("Failed to parse user data:", e)
        }
      }

      const { fetchChurches, fetchSelectedChurch } = await import("@/lib/services/church-service")
      const fetchedChurches = await fetchChurches()
      setChurches(fetchedChurches)

      const savedChurchId = typeof window !== "undefined" ? localStorage.getItem("selectedChurchId") : null
      let selected: Church | null = null

      if (savedChurchId === "all" && globalRole === "super_admin") {
        selected = { id: "all", name: "All Churches", city: "Global", country: "Global", role: "super_admin" }
      } else {
        selected = await fetchSelectedChurch(fetchedChurches)
      }

      if (selected) {
        setSelectedChurch(selected)
        // super_admin always takes priority, otherwise use church-specific role if available, or global role as fallback
        let roleToUse = globalRole
        if (globalRole === "super_admin") {
          roleToUse = "super_admin"
        } else if (selected.role) {
          roleToUse = selected.role
        }
        setUserRole(roleToUse)
      } else {
        // No church selected - use global role
        setUserRole(globalRole)
      }
    } catch (error) {
      console.error("Failed to load churches:", error)
    } finally {
      if (!isSilent) setIsLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    loadChurches()
  }, [loadChurches])

  // Watch for navigation to dashboard from outside
  useEffect(() => {
    const isDashboard = pathname?.startsWith("/dashboard")
    const wasNotDashboard = !lastPathname.current?.startsWith("/dashboard")

    if (isDashboard && wasNotDashboard) {
      console.log("Navigated to dashboard, refreshing church context...")
      loadChurches(true) // Silent refresh
    }
    lastPathname.current = pathname
  }, [pathname, loadChurches])

  useEffect(() => {
    if (selectedChurch) {
      localStorage.setItem("selectedChurchId", selectedChurch.id)

      // Check user's global role
      const storedUser = typeof window !== 'undefined' ? localStorage.getItem("user") : null
      let globalRole = "user" // default

      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          if (userData.role) {
            globalRole = userData.role
          }
        } catch (e) {
          console.error("Failed to parse user data:", e)
        }
      }

      // super_admin always takes priority, otherwise use church-specific role if available, or global role as fallback
      let roleToUse = globalRole
      if (globalRole === "super_admin") {
        roleToUse = "super_admin"
      } else if (selectedChurch.role) {
        roleToUse = selectedChurch.role
      }
      setUserRole(roleToUse)
    }
  }, [selectedChurch])

  const refresh = async () => {
    await loadChurches()
  }

  return (
    <ChurchContext.Provider value={{ selectedChurch, churches, setSelectedChurch, userRole, isLoading, refresh }}>
      {children}
    </ChurchContext.Provider>
  )
}

export function useChurch() {
  const context = useContext(ChurchContext)
  if (context === undefined) {
    throw new Error("useChurch must be used within a ChurchProvider")
  }
  return context
}
