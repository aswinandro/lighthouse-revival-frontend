"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Eye, CheckCircle } from "lucide-react"
import { useChurch } from "@/components/providers/church-context"


import React, { useEffect, useState } from "react"

export default function PreachingSchedulesManagement() {
  const { userRole, selectedChurch, churches } = useChurch()
  const [schedules, setSchedules] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  // Assign Topic dialog state
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [assignLoading, setAssignLoading] = useState(false)
  const [assignSuccess, setAssignSuccess] = useState(false)
  const [assignError, setAssignError] = useState("")
  const [form, setForm] = useState({
    church_id: "",
    assigned_pastor_id: "",
    week_start_date: "",
    week_end_date: "",
    assigned_topic: "",
    assigned_scripture: "",
    super_admin_comments: "",
  })

  // Pastors for selected church (fetch from /api/users for real user IDs)
  const [pastors, setPastors] = useState<{ id: string, name: string }[]>([])
  useEffect(() => {
    async function fetchPastors() {
      setPastors([])
      if (!form.church_id) return
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
        // Use the correct role value for user_church_roles
        const url = `${baseUrl}/api/users?role=church_pastor&churchId=${form.church_id}`
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        })
        if (!response.ok) throw new Error("Failed to fetch pastors")
        const data = await response.json()
        // Expecting array of users with id and name
        const usersRaw = Array.isArray(data) ? data : (data.users ?? data.data ?? [])
        setPastors(usersRaw.map((u: any) => ({
          id: String(u.id),
          name: u.name || (u.first_name && u.last_name ? `${u.first_name} ${u.last_name}` : u.first_name || u.last_name || ""),
        })))
      } catch {
        setPastors([])
      }
    }
    fetchPastors()
  }, [form.church_id])

  // Fetch schedules
  const fetchSchedules = async () => {
    setLoading(true)
    setError("")
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
      let url = `${baseUrl}/api/preaching-schedules`
      if (userRole !== "super_admin" && selectedChurch?.id) {
        url += `?churchId=${selectedChurch.id}`
      }
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      if (!response.ok) throw new Error("Failed to fetch schedules")
      const data = await response.json()
      const mapped = (data.data ?? []).map((s: any) => ({
        id: s.id,
        church: s.church_name,
        pastor: s.pastor_name || "",
        week: s.week_start_date && s.week_end_date ? `${new Date(s.week_start_date).toLocaleDateString()} - ${new Date(s.week_end_date).toLocaleDateString()}` : "",
        topic: s.assigned_topic,
        scripture: s.assigned_scripture,
        comments: s.super_admin_comments,
        actualTopic: s.actual_topic_preached,
        pastorNotes: s.pastor_notes,
        attendance: s.attendance_count,
        status: s.status,
      }))
      setSchedules(mapped)
    } catch (e) {
      setError((e as any).message || "Failed to load schedules")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchedules()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole, selectedChurch])

  // Assign Topic handler
  const handleAssignTopic = async () => {
    setAssignLoading(true)
    setAssignError("")
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
      const response = await fetch(`${baseUrl}/api/preaching-schedules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      })
      if (!response.ok) throw new Error("Failed to assign topic")
      setAssignSuccess(true)
      setAssignDialogOpen(false)
      setForm({
        church_id: "",
        assigned_pastor_id: "",
        week_start_date: "",
        week_end_date: "",
        assigned_topic: "",
        assigned_scripture: "",
        super_admin_comments: "",
      })
      fetchSchedules()
    } catch (e) {
      setAssignError((e as any).message || "Failed to assign topic")
    } finally {
      setAssignLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Preaching Schedules</h2>
          <p className="text-muted-foreground">
            {userRole === "super_admin" ? "Assign topics to pastors" : "View your preaching assignments"}
          </p>
        </div>
        {userRole === "super_admin" && (
          <>
            <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" onClick={() => setAssignDialogOpen(true)}>
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
                    <Select
                      value={form.church_id}
                      onValueChange={val => setForm(f => ({ ...f, church_id: val, assigned_pastor_id: "" }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select church" />
                      </SelectTrigger>
                      <SelectContent>
                        {churches.map((church) => (
                          <SelectItem key={church.id} value={church.id}>{church.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Pastor</Label>
                    <Select
                      value={form.assigned_pastor_id}
                      onValueChange={val => setForm(f => ({ ...f, assigned_pastor_id: val }))}
                      disabled={!form.church_id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={form.church_id ? (pastors.length ? "Select pastor" : "No pastors found") : "Select church first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {pastors.map((pastor) => (
                          <SelectItem key={pastor.id} value={pastor.id}>{pastor.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Week Start</Label>
                      <Input
                        type="date"
                        value={form.week_start_date}
                        onChange={e => setForm(f => ({ ...f, week_start_date: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Week End</Label>
                      <Input
                        type="date"
                        value={form.week_end_date}
                        onChange={e => setForm(f => ({ ...f, week_end_date: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Topic</Label>
                    <Input
                      placeholder="Enter preaching topic"
                      value={form.assigned_topic}
                      onChange={e => setForm(f => ({ ...f, assigned_topic: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Scripture Reference</Label>
                    <Input
                      placeholder="e.g., John 3:16-21"
                      value={form.assigned_scripture}
                      onChange={e => setForm(f => ({ ...f, assigned_scripture: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Comments/Instructions</Label>
                    <Textarea
                      placeholder="Additional notes for the pastor"
                      value={form.super_admin_comments}
                      onChange={e => setForm(f => ({ ...f, super_admin_comments: e.target.value }))}
                    />
                  </div>
                  {assignError && <div className="text-red-500 text-sm">{assignError}</div>}
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setAssignDialogOpen(false)} disabled={assignLoading}>Cancel</Button>
                  <Button onClick={handleAssignTopic} disabled={assignLoading}>
                    {assignLoading ? "Assigning..." : "Assign Topic"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            {assignSuccess && (
              <div className="fixed top-4 right-4 z-50">
                <div className="bg-green-600 text-white px-4 py-2 rounded shadow">Successfully assigned topic!</div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Schedules Table */}
      <Card>
        <CardHeader>
          <CardTitle>Preaching Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {userRole === "super_admin" && <TableHead>Church</TableHead>}
                <TableHead>Pastor</TableHead>
                <TableHead>Week</TableHead>
                <TableHead>Assigned Topic</TableHead>
                <TableHead>Scripture</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  {userRole === "super_admin" && <TableCell className="font-medium">{schedule.church}</TableCell>}
                  <TableCell>{schedule.pastor}</TableCell>
                  <TableCell>{schedule.week}</TableCell>
                  <TableCell>{schedule.topic}</TableCell>
                  <TableCell className="text-sm">{schedule.scripture}</TableCell>
                  <TableCell>
                    <Badge variant={schedule.status === "Completed" ? "default" : "secondary"}>{schedule.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Preaching Schedule Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">Week</Label>
                                <p className="text-sm text-muted-foreground">{schedule.week}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Status</Label>
                                <Badge variant={schedule.status === "Completed" ? "default" : "secondary"}>
                                  {schedule.status}
                                </Badge>
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Assigned Topic</Label>
                              <p className="text-sm text-muted-foreground mt-1">{schedule.topic}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Scripture</Label>
                              <p className="text-sm text-muted-foreground mt-1">{schedule.scripture}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Instructions from Super Admin</Label>
                              <p className="text-sm text-muted-foreground mt-1">{schedule.comments}</p>
                            </div>
                            {schedule.status === "Completed" && (
                              <>
                                <div>
                                  <Label className="text-sm font-medium">Actual Topic Preached</Label>
                                  <p className="text-sm text-muted-foreground mt-1">{schedule.actualTopic}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Pastor's Notes</Label>
                                  <p className="text-sm text-muted-foreground mt-1">{schedule.pastorNotes}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Attendance</Label>
                                  <p className="text-sm text-muted-foreground mt-1">{schedule.attendance} people</p>
                                </div>
                              </>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      {userRole === "church_pastor" && schedule.status === "Scheduled" && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Complete
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Complete Preaching Report</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label>Actual Topic Preached</Label>
                                <Input placeholder="What did you actually preach?" defaultValue={schedule.topic} />
                              </div>
                              <div className="space-y-2">
                                <Label>Attendance Count</Label>
                                <Input type="number" placeholder="Number of attendees" />
                              </div>
                              <div className="space-y-2">
                                <Label>Pastor's Notes</Label>
                                <Textarea placeholder="Share how the service went, testimonies, etc." rows={5} />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline">Cancel</Button>
                              <Button>Submit Report</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
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
