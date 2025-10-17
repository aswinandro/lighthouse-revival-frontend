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
import { Building2, Plus, Users, DollarSign, TrendingUp, Eye, Edit } from "lucide-react"
import { useChurch } from "@/components/providers/church-context"

export default function SuperAdminPage() {
  const { churches } = useChurch()
  const [selectedView, setSelectedView] = useState<"churches" | "schedules" | "reports" | "users">("churches")

  const churchStats = [
    { id: "1", name: "Abu Dhabi Church", members: 1247, income: 45000, expenses: 32000, attendance: 892 },
    { id: "2", name: "Dubai Church", members: 856, income: 38000, expenses: 28000, attendance: 654 },
    { id: "3", name: "Sharjah Church", members: 432, income: 22000, expenses: 18000, attendance: 321 },
  ]

  const preachingSchedules = [
    {
      id: "1",
      church: "Abu Dhabi Church",
      pastor: "Pastor Michael",
      week: "Jan 28 - Feb 3",
      topic: "The Power of Faith",
      scripture: "Hebrews 11:1-6",
      status: "Scheduled",
    },
    {
      id: "2",
      church: "Dubai Church",
      pastor: "Pastor David",
      week: "Jan 28 - Feb 3",
      topic: "Walking in Love",
      scripture: "1 Corinthians 13",
      status: "Completed",
    },
  ]

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
                    <Input id="phone" placeholder="+971-XX-XXX-XXXX" />
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
      <div className="flex gap-2 border-b">
        {[
          { id: "churches", label: "Churches" },
          { id: "schedules", label: "Preaching Schedules" },
          { id: "reports", label: "Financial Reports" },
          { id: "users", label: "User Management" },
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
        <>
          {/* Consolidated Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                label: "Total Churches",
                value: churchStats.length,
                icon: Building2,
                color: "bg-primary",
              },
              {
                label: "Total Members",
                value: churchStats.reduce((sum, c) => sum + c.members, 0).toLocaleString(),
                icon: Users,
                color: "bg-green-500",
              },
              {
                label: "Total Income",
                value: `$${churchStats.reduce((sum, c) => sum + c.income, 0).toLocaleString()}`,
                icon: DollarSign,
                color: "bg-blue-500",
              },
              {
                label: "Total Attendance",
                value: churchStats.reduce((sum, c) => sum + c.attendance, 0).toLocaleString(),
                icon: TrendingUp,
                color: "bg-purple-500",
              },
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

          {/* Church Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {churchStats.map((church) => (
              <Card key={church.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{church.name}</CardTitle>
                      <Badge variant="secondary" className="mt-2">
                        Active
                      </Badge>
                    </div>
                    <Building2 className="w-8 h-8 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Members</p>
                      <p className="text-xl font-bold">{church.members}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Attendance</p>
                      <p className="text-xl font-bold">{church.attendance}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Income</span>
                      <span className="font-medium text-green-600">${church.income.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Expenses</span>
                      <span className="font-medium text-red-600">${church.expenses.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t">
                      <span className="font-medium">Net Balance</span>
                      <span className="font-bold text-primary">
                        ${(church.income - church.expenses).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Edit className="w-4 h-4 mr-1" />
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Preaching Schedules */}
      {selectedView === "schedules" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Preaching Schedules</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Assign Topic
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign Preaching Topic</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Church</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select church" />
                      </SelectTrigger>
                      <SelectContent>
                        {churchStats.map((church) => (
                          <SelectItem key={church.id} value={church.id}>
                            {church.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Pastor</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pastor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Pastor Michael</SelectItem>
                        <SelectItem value="2">Pastor David</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Week Start</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Week End</Label>
                      <Input type="date" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Topic</Label>
                    <Input placeholder="Enter preaching topic" />
                  </div>
                  <div className="space-y-2">
                    <Label>Scripture Reference</Label>
                    <Input placeholder="e.g., John 3:16-21" />
                  </div>
                  <div className="space-y-2">
                    <Label>Comments/Instructions</Label>
                    <Textarea placeholder="Additional notes for the pastor" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Assign Topic</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Church</TableHead>
                  <TableHead>Pastor</TableHead>
                  <TableHead>Week</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>Scripture</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {preachingSchedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium">{schedule.church}</TableCell>
                    <TableCell>{schedule.pastor}</TableCell>
                    <TableCell>{schedule.week}</TableCell>
                    <TableCell>{schedule.topic}</TableCell>
                    <TableCell className="text-sm">{schedule.scripture}</TableCell>
                    <TableCell>
                      <Badge variant={schedule.status === "Completed" ? "default" : "secondary"}>
                        {schedule.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
