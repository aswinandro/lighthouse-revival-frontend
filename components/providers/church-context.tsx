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
        const fetchedChurches = await import("@/lib/services/church-service").then(m => m.fetchChurches())
        setChurches(fetchedChurches)
        const selected = await import("@/lib/services/church-service").then(m => m.fetchSelectedChurch(fetchedChurches))
        if (selected) {
          setSelectedChurch(selected)
          setUserRole(selected.role)
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
      setUserRole(selectedChurch.role)
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
