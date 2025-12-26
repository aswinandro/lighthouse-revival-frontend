"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DollarSign, TrendingUp, Users, Eye, CheckCircle, XCircle, FileText, Plus } from "lucide-react"

import { useChurch } from "@/components/providers/church-context"
import { apiClient } from "@/lib/api-client"
import { getToken } from "@/lib/utils"
import { useEffect, useState } from "react"
import { WeeklyReportForm } from "./weekly-report-form"

export function WeeklyReportsManagement() {
  const { userRole, selectedChurch } = useChurch()
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [feedback, setFeedback] = useState("")

  const fetchReports = async () => {
    setLoading(true)
    try {
      const token = getToken()
      if (!token) return
      const churchId = selectedChurch?.id === 'all' ? undefined : selectedChurch?.id
      const res: any = await apiClient.getWeeklyReports(token, { churchId })
      setReports(res.data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [selectedChurch])

  const handleReview = async (reportId: string, status: 'Approved' | 'Rejected') => {
    setReviewLoading(true)
    try {
      const token = getToken()
      if (!token) return
      await apiClient.reviewWeeklyReport(reportId, { status, feedback }, token)
      setFeedback("")
      fetchReports()
    } catch (e) {
      console.error(e)
      alert("Failed to review report")
    } finally {
      setReviewLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'Rejected': return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'Submitted': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

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

        {userRole === "church_pastor" && (
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 px-6">
                <Plus className="w-4 h-4" />
                Submit New Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] lg:max-w-7xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">Weekly Church Report Entry</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <WeeklyReportForm
                  onSuccess={() => {
                    setCreateDialogOpen(false)
                    fetchReports()
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Income",
            value: `AED ${reports.reduce((sum, r) => sum + (Number(r.total_amount) || 0), 0).toLocaleString()}`,
            icon: DollarSign,
            color: "bg-green-500",
          },
          {
            label: "Total Expenses",
            value: `AED ${reports.reduce((sum, r) => sum + (Number(r.total_expenses) || 0), 0).toLocaleString()}`,
            icon: TrendingUp,
            color: "bg-red-500",
          },
          {
            label: "Net Balance",
            value: `AED ${reports.reduce((sum, r) => sum + (Number(r.net_balance) || 0), 0).toLocaleString()}`,
            icon: DollarSign,
            color: "bg-blue-500",
          },
          {
            label: "Total Attendance",
            value: reports.reduce((sum, r) => sum + (r.total_attendance || 0), 0).toLocaleString(),
            icon: Users,
            color: "bg-purple-500",
          },
        ].map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Card key={index} className="shadow-sm">
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
      <Card className="shadow-sm border-none bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Reports History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {userRole === "super_admin" && <TableHead>Church</TableHead>}
                <TableHead>Pastor</TableHead>
                <TableHead>Week Start</TableHead>
                <TableHead>Income</TableHead>
                <TableHead>Expenses</TableHead>
                <TableHead>Net</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={userRole === "super_admin" ? 9 : 8} className="text-center py-8 text-muted-foreground">
                    No reports found.
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report) => (
                  <TableRow key={report.id} className="hover:bg-muted/30 transition-colors">
                    {userRole === "super_admin" && <TableCell className="font-medium">{report.church?.name || report.church}</TableCell>}
                    <TableCell>{report.pastor?.first_name ? `${report.pastor.first_name} ${report.pastor.last_name}` : report.pastor}</TableCell>
                    <TableCell>{new Date(report.report_week_start).toLocaleDateString()}</TableCell>
                    <TableCell className="text-green-600 font-semibold">AED {Number(report.total_amount).toLocaleString()}</TableCell>
                    <TableCell className="text-red-600 font-semibold">AED {Number(report.total_expenses).toLocaleString()}</TableCell>
                    <TableCell className="font-bold text-primary">AED {Number(report.net_balance).toLocaleString()}</TableCell>
                    <TableCell>{report.total_attendance}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[95vw] lg:max-w-6xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader className="mb-4">
                            <div className="flex justify-between items-center pr-8">
                              <DialogTitle className="text-2xl font-bold">
                                Weekly Report: {new Date(report.report_week_start).toLocaleDateString()} - {new Date(report.report_week_end).toLocaleDateString()}
                              </DialogTitle>
                              <Badge variant="outline" className={`${getStatusColor(report.status)} px-3 py-1 text-sm`}>
                                {report.status}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground">{report.church?.name} | Pastor {report.pastor?.first_name} {report.pastor?.last_name}</p>
                          </DialogHeader>

                          <div className="space-y-8 py-4">
                            {/* Summary Totals Row */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/40 border">
                              <div className="space-y-1">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Total Income</Label>
                                <p className="text-xl font-bold text-green-600">AED {Number(report.total_amount).toLocaleString()}</p>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Total Expenses</Label>
                                <p className="text-xl font-bold text-red-600">AED {Number(report.total_expenses).toLocaleString()}</p>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Net Balance</Label>
                                <p className="text-xl font-bold text-primary">AED {Number(report.net_balance).toLocaleString()}</p>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Total Attendance</Label>
                                <p className="text-xl font-bold">{report.total_attendance}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                              {/* Income Details */}
                              <div className="space-y-4">
                                <h4 className="font-bold text-lg text-green-700 flex items-center gap-2 border-b pb-1">
                                  <DollarSign className="w-5 h-5" /> Detailed Income
                                </h4>
                                <div className="space-y-3">
                                  {[
                                    { label: 'Tithes', val: report.tithe_amount },
                                    { label: 'General Offering', val: report.offering_amount },
                                    { label: 'Special Offering', val: report.special_offering_amount },
                                    { label: 'Donations', val: report.donations_amount },
                                    { label: 'Other Income', val: report.other_income },
                                  ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center py-1 border-b border-dashed border-muted">
                                      <span className="text-sm font-medium">{item.label}</span>
                                      <span className="font-semibold text-green-600">AED {Number(item.val || 0).toLocaleString()}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Expense Details */}
                              <div className="space-y-4">
                                <h4 className="font-bold text-lg text-red-700 flex items-center gap-2 border-b pb-1">
                                  <TrendingUp className="w-5 h-5" /> Detailed Expenses
                                </h4>
                                <div className="space-y-3">
                                  {[
                                    { label: 'Rent', val: report.rent_expense },
                                    { label: 'Utilities', val: report.utilities_expense },
                                    { label: 'Ministry', val: report.ministry_expense },
                                    { label: 'Transportation', val: report.transportation_expense },
                                    { label: 'Maintenance', val: report.maintenance_expense },
                                    { label: 'Staff', val: report.staff_expense },
                                    { label: 'Outreach', val: report.outreach_expense },
                                    { label: 'Other', val: report.other_expenses },
                                  ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center py-1 border-b border-dashed border-muted">
                                      <span className="text-sm font-medium">{item.label}</span>
                                      <span className="font-semibold text-red-600">AED {Number(item.val || 0).toLocaleString()}</span>
                                    </div>
                                  ))}
                                  {report.expense_notes && (
                                    <div className="p-3 rounded-lg bg-red-50/50 border border-red-100 mt-2">
                                      <p className="text-xs font-bold text-red-800 uppercase mb-1">Expense Notes</p>
                                      <p className="text-sm italic">"{report.expense_notes}"</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Attendance & Ministry stats */}
                              <div className="space-y-4">
                                <h4 className="font-bold text-lg text-blue-700 flex items-center gap-2 border-b pb-1">
                                  <Users className="w-5 h-5" /> Service & Ministry
                                </h4>
                                <div className="space-y-6">
                                  <div className="space-y-2">
                                    <p className="text-xs font-bold uppercase text-muted-foreground border-b pb-1 mb-2">Service Attendance</p>
                                    {[
                                      { label: 'Sunday', val: report.sunday_service_attendance },
                                      { label: 'Midweek', val: report.midweek_service_attendance },
                                      { label: 'Prayer Meeting', val: report.prayer_meeting_attendance },
                                      { label: 'Youth', val: report.youth_service_attendance },
                                      { label: 'Children', val: report.children_service_attendance },
                                    ].map((item, i) => (
                                      <div key={i} className="flex justify-between items-center py-1 border-b border-dashed border-muted">
                                        <span className="text-sm font-medium">{item.label}</span>
                                        <span className="font-semibold">{item.val || 0}</span>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="space-y-2">
                                    <p className="text-xs font-bold uppercase text-muted-foreground border-b pb-1 mb-2">Ministry Stats</p>
                                    {[
                                      { label: 'New Converts', val: report.new_converts },
                                      { label: 'New Members', val: report.new_members },
                                      { label: 'Water Baptisms', val: report.water_baptisms },
                                      { label: 'Spirit Baptisms', val: report.spirit_baptisms },
                                      { label: 'Home Visits', val: report.home_visits },
                                      { label: 'Hospital Visits', val: report.hospital_visits },
                                      { label: 'Counseling', val: report.counseling_sessions },
                                    ].map((item, i) => (
                                      <div key={i} className="flex justify-between items-center py-1 border-b border-dashed border-muted">
                                        <span className="text-sm font-medium">{item.label}</span>
                                        <span className="font-semibold">{item.val || 0}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Narratives Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl bg-primary/5 border border-primary/10">
                              <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-primary">Highlights</Label>
                                <div className="bg-white p-4 rounded-lg border text-sm min-h-[80px]">
                                  {report.highlights || "No highlights reported."}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-primary">Challenges</Label>
                                <div className="bg-white p-4 rounded-lg border text-sm min-h-[80px]">
                                  {report.challenges || "No challenges reported."}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-primary">Prayer Requests</Label>
                                <div className="bg-white p-4 rounded-lg border text-sm min-h-[80px]">
                                  {report.prayer_requests || "No prayer requests reported."}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-primary">Upcoming Events</Label>
                                <div className="bg-white p-4 rounded-lg border text-sm min-h-[80px]">
                                  {report.upcoming_events || "No upcoming events reported."}
                                </div>
                              </div>
                            </div>

                            {/* Feedback Section (Visible to everyone if feedback exists) */}
                            {report.super_admin_feedback && (
                              <div className="p-6 rounded-xl bg-orange-50/50 border border-orange-200">
                                <h4 className="font-bold text-orange-800 flex items-center gap-2 mb-2 uppercase text-sm">
                                  <FileText className="w-4 h-4" /> Super Admin Feedback
                                </h4>
                                <p className="text-sm italic text-orange-950">"{report.super_admin_feedback}"</p>
                                <div className="mt-4 flex gap-4 text-xs text-orange-700 font-medium">
                                  <span>Reviewed by: {report.reviewer?.first_name ? `${report.reviewer.first_name} ${report.reviewer.last_name}` : 'Super Admin'}</span>
                                  <span>Date: {report.reviewed_at ? new Date(report.reviewed_at).toLocaleDateString() : 'N/A'}</span>
                                </div>
                              </div>
                            )}

                            {/* Review Actions (Super Admin Only) */}
                            {userRole === "super_admin" && report.status === "Submitted" && (
                              <div className="space-y-4 pt-6 border-t">
                                <h3 className="font-bold text-xl flex items-center gap-2">
                                  <CheckCircle className="w-6 h-6 text-primary" /> Review This Report
                                </h3>
                                <div className="space-y-2">
                                  <Label className="font-semibold text-muted-foreground">Feedback for Pastor</Label>
                                  <Textarea
                                    placeholder="Add any instructions, feedback or questions for the pastor..."
                                    className="resize-none"
                                    rows={3}
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                  />
                                </div>
                                <div className="flex gap-4">
                                  <Button
                                    className="flex-1 h-12 gap-2 text-lg shadow-lg hover:shadow-green-500/20"
                                    onClick={() => handleReview(report.id, 'Approved')}
                                    disabled={reviewLoading}
                                  >
                                    <CheckCircle className="w-5 h-5" />
                                    Approve & Finalize
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="flex-1 h-12 gap-2 text-lg border-red-200 text-red-600 hover:bg-red-50 shadow-sm"
                                    onClick={() => handleReview(report.id, 'Rejected')}
                                    disabled={reviewLoading}
                                  >
                                    <XCircle className="w-5 h-5" />
                                    Reject & Request Changes
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
