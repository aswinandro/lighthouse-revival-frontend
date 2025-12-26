"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, TrendingUp, Users, Calendar, Plus, FileText, Send } from "lucide-react"
import { useChurch } from "@/components/providers/church-context"

import { WeeklyReportsManagement } from "@/components/dashboard/weekly-reports-management"

export default function PastorDashboardPage() {
  const { selectedChurch } = useChurch()

  const preachingAssignments = [
    {
      id: "1",
      week: "Jan 28 - Feb 3",
      topic: "The Power of Faith",
      scripture: "Hebrews 11:1-6",
      comments: "Focus on practical applications of faith in daily life",
      status: "Scheduled",
    }
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Pastor Dashboard</h1>
          <p className="text-muted-foreground">{selectedChurch?.name}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "This Week Income", value: "AED 15,700", icon: DollarSign, color: "bg-green-500" },
          { label: "This Week Expenses", value: "AED 8,500", icon: TrendingUp, color: "bg-red-500" },
          { label: "Total Attendance", value: "892", icon: Users, color: "bg-blue-500" },
          { label: "Pending Reports", value: "1", icon: FileText, color: "bg-yellow-500" },
        ].map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 ${stat.color} rounded-full flex items-center justify-center`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Weekly Reports Management - Handles Create and View */}
      <WeeklyReportsManagement />

      {/* Preaching Assignments */}
// ... rest of file ...
    </div>
  )
}
