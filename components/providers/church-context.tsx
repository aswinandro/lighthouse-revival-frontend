"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface Church {
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load user's churches and role from API or localStorage
    const loadChurches = async () => {
      try {
        // Mock data - replace with actual API call
        const mockChurches: Church[] = [
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

        setChurches(mockChurches)

        // Load saved church from localStorage
        const savedChurchId = localStorage.getItem("selectedChurchId")
        if (savedChurchId) {
          const savedChurch = mockChurches.find((c) => c.id === savedChurchId)
          if (savedChurch) {
            setSelectedChurch(savedChurch)
            setUserRole(savedChurch.role)
          }
        } else if (mockChurches.length > 0) {
          setSelectedChurch(mockChurches[0])
          setUserRole(mockChurches[0].role)
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
    if (mounted && selectedChurch) {
      localStorage.setItem("selectedChurchId", selectedChurch.id)
      setUserRole(selectedChurch.role)
    }
  }, [selectedChurch, mounted])

  if (!mounted) {
    return <div>{children}</div>
  }

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
