"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Church {
  id: string
  name: string
  city: string
  country: string
  role: "super_admin" | "church_pastor" | "church_leader" | "church_believer"
}

interface ChurchContextType {
  selectedChurch: Church | null
  churches: Church[]
  setSelectedChurch: (church: Church) => void
  userRole: string
  isLoading: boolean
}

const ChurchContext = createContext<ChurchContextType | undefined>(undefined)

export function ChurchProvider({ children }: { children: React.ReactNode }) {
  const [selectedChurch, setSelectedChurch] = useState<Church | null>(null)
  const [churches, setChurches] = useState<Church[]>([])
  const [userRole, setUserRole] = useState<string>("church_believer")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadChurches = async () => {
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

        const fetchedChurches = await import("@/lib/services/church-service").then(m => m.fetchChurches())
        setChurches(fetchedChurches)
        const selected = await import("@/lib/services/church-service").then(m => m.fetchSelectedChurch(fetchedChurches))

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
        setIsLoading(false)
      }
    }
    loadChurches()
  }, [])

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

  return (
    <ChurchContext.Provider value={{ selectedChurch, churches, setSelectedChurch, userRole, isLoading }}>
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
