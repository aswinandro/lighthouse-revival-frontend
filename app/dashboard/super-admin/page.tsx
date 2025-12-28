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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Plus, Users, DollarSign, TrendingUp, Eye, Edit, Trash2 } from "lucide-react"
import { PhoneInput } from "@/components/ui/phone-input"
import { useChurch } from "@/components/providers/church-context"
import { WeeklyReportsManagement } from "@/components/dashboard/weekly-reports-management"
import { ChurchesManagement } from "@/components/dashboard/churches-management"
import { PreachingSchedulesManagement } from "@/components/dashboard/preaching-schedules-management";
import MembersManagement from "@/components/dashboard/members-management"
import { QRAttendanceManagement } from "@/components/dashboard/qr-attendance-management"

export default function SuperAdminPage() {
  const { churches } = useChurch()
  const [selectedView, setSelectedView] = useState<"churches" | "schedules" | "reports" | "users" | "qr">("churches")

  const churchStats = [
    { id: "1", name: "Abu Dhabi Church", members: 1247, income: 45000, expenses: 32000, attendance: 892 },
    { id: "2", name: "Dubai Church", members: 856, income: 38000, expenses: 28000, attendance: 654 },
    { id: "3", name: "Sharjah Church", members: 432, income: 22000, expenses: 18000, attendance: 321 },
  ]
  // ... existing preachingSchedules ...
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage all churches and operations</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Church
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Church</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="churchName">Church Name</Label>
                  <Input id="churchName" placeholder="Enter church name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="City" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" placeholder="Country" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" placeholder="Full address" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <PhoneInput
                      id="phone"
                      value={""} // Since it's currently unmanaged in this dialog
                      onChange={() => { }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="church@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pastor">Lead Pastor</Label>
                  <Input id="pastor" placeholder="Pastor name" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Create Church</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* View Selector */}
      <div className="flex gap-2 border-b overflow-x-auto pb-2">
        {[
          { id: "churches", label: "Churches" },
          { id: "schedules", label: "Preaching Schedules" },
          { id: "reports", label: "Financial Reports" },
          { id: "users", label: "User Management" },
          { id: "qr", label: "QR Attendance" },
        ].map((view) => (
          <Button
            key={view.id}
            variant={selectedView === view.id ? "default" : "ghost"}
            onClick={() => setSelectedView(view.id as any)}
          >
            {view.label}
          </Button>
        ))}
      </div>

      {/* Churches Overview */}
      {selectedView === "churches" && (
        <ChurchesManagement />
      )}

      {/* Preaching Schedules */}
      {selectedView === "schedules" && (
        <PreachingSchedulesManagement />
      )}

      {/* Financial Reports */}
      {selectedView === "reports" && (
        <WeeklyReportsManagement />
      )}

      {/* User/Member Management */}
      {selectedView === "users" && (
        <MembersManagement />
      )}

      {/* QR Code Management */}
      {selectedView === "qr" && (
        <QRAttendanceManagement />
      )}
    </div>
  )
}
