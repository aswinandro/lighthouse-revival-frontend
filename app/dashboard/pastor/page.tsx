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

export default function PastorDashboardPage() {
  const { selectedChurch } = useChurch()
  const [selectedReport, setSelectedReport] = useState<any>(null)

  const weeklyReports = [
    {
      id: "1",
      week: "Jan 21-27, 2024",
      tithe: 12500,
      offering: 3200,
      expenses: 8500,
      attendance: 892,
      status: "Submitted",
    },
    {
      id: "2",
      week: "Jan 14-20, 2024",
      tithe: 11800,
      offering: 2900,
      expenses: 7800,
      attendance: 856,
      status: "Approved",
    },
  ]

  const preachingAssignments = [
    {
      id: "1",
      week: "Jan 28 - Feb 3",
      topic: "The Power of Faith",
      scripture: "Hebrews 11:1-6",
      comments: "Focus on practical applications of faith in daily life",
      status: "Scheduled",
    },
    {
      id: "2",
      week: "Feb 4 - Feb 10",
      topic: "Walking in Love",
      scripture: "1 Corinthians 13",
      comments: "Emphasize love as the foundation of Christian life",
      status: "Scheduled",
    },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Pastor Dashboard</h1>
          <p className="text-muted-foreground">{selectedChurch?.name}</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Submit Weekly Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Weekly Church Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Week Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Week Start Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Week End Date</Label>
                  <Input type="date" />
                </div>
              </div>

              {/* Financial Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Financial Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Tithe Amount</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Offering Amount</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Special Offering</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Rent Expense</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Utilities Expense</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Ministry Expense</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Transportation Expense</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Other Expenses</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Expense Notes</Label>
                  <Textarea placeholder="Details about expenses" />
                </div>
              </div>

              {/* Attendance Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Attendance</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Sunday Service</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label>Midweek Service</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label>Prayer Meeting</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                </div>
              </div>

              {/* Ministry Activities */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Ministry Activities</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>New Converts</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label>Water Baptisms</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label>Home Visits</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label>Hospital Visits</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Additional Information</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Highlights of the Week</Label>
                    <Textarea placeholder="Share notable events and blessings" />
                  </div>
                  <div className="space-y-2">
                    <Label>Prayer Requests</Label>
                    <Textarea placeholder="Specific prayer needs" />
                  </div>
                  <div className="space-y-2">
                    <Label>Challenges</Label>
                    <Textarea placeholder="Any challenges or concerns" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Save as Draft</Button>
              <Button className="gap-2">
                <Send className="w-4 h-4" />
                Submit Report
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "This Week Income", value: "$15,700", icon: DollarSign, color: "bg-green-500" },
          { label: "This Week Expenses", value: "$8,500", icon: TrendingUp, color: "bg-red-500" },
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

      {/* Preaching Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Preaching Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {preachingAssignments.map((assignment) => (
              <Card key={assignment.id} className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{assignment.week}</span>
                        <Badge variant={assignment.status === "Completed" ? "default" : "secondary"}>
                          {assignment.status}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{assignment.topic}</h4>
                        <p className="text-sm text-muted-foreground">{assignment.scripture}</p>
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm">
                          <span className="font-medium">Instructions: </span>
                          {assignment.comments}
                        </p>
                      </div>
                    </div>
                    {assignment.status === "Scheduled" && (
                      <Button variant="outline" size="sm" className="ml-4 bg-transparent">
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Reports History */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Week</TableHead>
                <TableHead>Tithe</TableHead>
                <TableHead>Offering</TableHead>
                <TableHead>Expenses</TableHead>
                <TableHead>Net</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {weeklyReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.week}</TableCell>
                  <TableCell className="text-green-600">${report.tithe.toLocaleString()}</TableCell>
                  <TableCell className="text-green-600">${report.offering.toLocaleString()}</TableCell>
                  <TableCell className="text-red-600">${report.expenses.toLocaleString()}</TableCell>
                  <TableCell className="font-bold">
                    ${(report.tithe + report.offering - report.expenses).toLocaleString()}
                  </TableCell>
                  <TableCell>{report.attendance}</TableCell>
                  <TableCell>
                    <Badge variant={report.status === "Approved" ? "default" : "secondary"}>{report.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
