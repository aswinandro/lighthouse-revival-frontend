"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DollarSign, TrendingUp, Users, Eye, CheckCircle, XCircle } from "lucide-react"

import { useChurch } from "@/components/providers/church-context"
import { apiClient } from "@/lib/api-client"
import { getToken } from "@/lib/utils"
import { useEffect, useState } from "react"

export function WeeklyReportsManagement() {
  const { userRole } = useChurch()
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchReports = async () => {
    setLoading(true)
    try {
      const token = getToken()
      if (!token) return
      const data: any = await apiClient.getWeeklyReports(token)
      setReports(data.data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Weekly Reports</h2>
          <p className="text-muted-foreground">
            {userRole === "super_admin" ? "Review and approve weekly church reports" : "View your submitted reports"}
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Income",
            value: `$${reports.reduce((sum, r) => sum + (r.totalIncome || 0), 0).toLocaleString()}`,
            icon: DollarSign,
            color: "bg-green-500",
          },
          {
            label: "Total Expenses",
            value: `$${reports.reduce((sum, r) => sum + (r.expenses || 0), 0).toLocaleString()}`,
            icon: TrendingUp,
            color: "bg-red-500",
          },
          {
            label: "Net Balance",
            value: `$${reports.reduce((sum, r) => sum + (r.netBalance || 0), 0).toLocaleString()}`,
            icon: DollarSign,
            color: "bg-blue-500",
          },
          {
            label: "Total Attendance",
            value: reports.reduce((sum, r) => sum + (r.attendance || 0), 0).toLocaleString(),
            icon: Users,
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

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Church Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {userRole === "super_admin" && <TableHead>Church</TableHead>}
                <TableHead>Pastor</TableHead>
                <TableHead>Week</TableHead>
                <TableHead>Income</TableHead>
                <TableHead>Expenses</TableHead>
                <TableHead>Net</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  {userRole === "super_admin" && <TableCell className="font-medium">{report.church}</TableCell>}
                  <TableCell>{report.pastor}</TableCell>
                  <TableCell>{report.week}</TableCell>
                  <TableCell className="text-green-600 font-medium">${(report.totalIncome || 0).toLocaleString()}</TableCell>
                  <TableCell className="text-red-600 font-medium">${(report.expenses || 0).toLocaleString()}</TableCell>
                  <TableCell className="font-bold">${(report.netBalance || 0).toLocaleString()}</TableCell>
                  <TableCell>{report.attendance}</TableCell>
                  <TableCell>
                    <Badge variant={report.status === "Approved" ? "default" : "secondary"}>{report.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Weekly Report Details - {report.week}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6 py-4">
                            {/* Financial Summary */}
                            <div className="space-y-3">
                              <h3 className="font-semibold text-lg">Financial Summary</h3>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <Label className="text-sm text-muted-foreground">Tithe</Label>
                                  <p className="text-lg font-medium text-green-600">${(report.tithe || 0).toLocaleString()}</p>
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-sm text-muted-foreground">Offering</Label>
                                  <p className="text-lg font-medium text-green-600">
                                    ${(report.offering || 0).toLocaleString()}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-sm text-muted-foreground">Special Offering</Label>
                                  <p className="text-lg font-medium text-green-600">
                                    ${(report.specialOffering || 0).toLocaleString()}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-sm text-muted-foreground">Total Income</Label>
                                  <p className="text-xl font-bold text-green-600">
                                    ${(report.totalIncome || 0).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="pt-2 border-t">
                                <div className="space-y-1">
                                  <Label className="text-sm text-muted-foreground">Total Expenses</Label>
                                  <p className="text-xl font-bold text-red-600">${(report.expenses || 0).toLocaleString()}</p>
                                </div>
                              </div>
                              <div className="pt-2 border-t">
                                <div className="space-y-1">
                                  <Label className="text-sm text-muted-foreground">Net Balance</Label>
                                  <p className="text-2xl font-bold text-primary">
                                    ${(report.netBalance || 0).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Ministry Activities */}
                            <div className="space-y-3">
                              <h3 className="font-semibold text-lg">Ministry Activities</h3>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                  <Label className="text-sm text-muted-foreground">Attendance</Label>
                                  <p className="text-lg font-medium">{report.attendance}</p>
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-sm text-muted-foreground">New Converts</Label>
                                  <p className="text-lg font-medium">{report.newConverts}</p>
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-sm text-muted-foreground">Baptisms</Label>
                                  <p className="text-lg font-medium">{report.baptisms}</p>
                                </div>
                              </div>
                            </div>

                            {/* Review Actions (Super Admin Only) */}
                            {userRole === "super_admin" && report.status === "Submitted" && (
                              <div className="space-y-3 pt-4 border-t">
                                <h3 className="font-semibold text-lg">Review Report</h3>
                                <div className="space-y-2">
                                  <Label>Feedback</Label>
                                  <Textarea placeholder="Add feedback for the pastor..." rows={3} />
                                </div>
                                <div className="flex gap-2">
                                  <Button className="flex-1 gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    Approve Report
                                  </Button>
                                  <Button variant="destructive" className="flex-1 gap-2">
                                    <XCircle className="w-4 h-4" />
                                    Request Changes
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
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
