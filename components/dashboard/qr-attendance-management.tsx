"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { QrCode, Users, Calendar, Clock } from "lucide-react"
import { useChurch } from "@/components/providers/church-context"
import { getToken } from "@/lib/utils"

export function QRAttendanceManagement() {
  const { selectedChurch } = useChurch()
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedSession, setSelectedSession] = useState<any>(null)
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([])
  const { toast } = useToast()

  const [newSession, setNewSession] = useState({
    sessionName: "",
    sessionDate: "",
    sessionTime: "",
    serviceType: "Sunday Service",
    language: "English",
    expiresAt: "",
  })

  useEffect(() => {
    if (selectedChurch) {
      loadSessions()
    }
  }, [selectedChurch])

  const loadSessions = async () => {
    setLoading(true)
    try {
      const token = getToken()
      if (!token || !selectedChurch) return
      const response = await apiClient.getQRSessions(selectedChurch.id, token, { isActive: true }) as any
      setSessions(response.data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load sessions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSession = async () => {
    if (!newSession.sessionName || !newSession.sessionDate || !newSession.sessionTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const token = getToken()
      if (!token || !selectedChurch) return
      await apiClient.createQRSession({ ...newSession, churchId: selectedChurch.id }, token)
      toast({
        title: "Success",
        description: "QR session created successfully",
      })
      setShowCreateDialog(false)
      loadSessions()
      setNewSession({
        sessionName: "",
        sessionDate: "",
        sessionTime: "",
        serviceType: "Sunday Service",
        language: "English",
        expiresAt: "",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create session",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleViewAttendance = async (session: any) => {
    setSelectedSession(session)
    setLoading(true)
    try {
      const token = getToken()
      if (!token) return
      const response = await apiClient.getSessionAttendance(session.id, token) as any
      setAttendanceRecords(response.data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load attendance",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeactivate = async (sessionId: string) => {
    if (!confirm("Are you sure you want to deactivate this session?")) return

    setLoading(true)
    try {
      const token = getToken()
      if (!token) return
      await apiClient.deactivateQRSession(sessionId, token)
      toast({
        title: "Success",
        description: "Session deactivated successfully",
      })
      loadSessions()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to deactivate session",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">QR Attendance Management</h2>
          <p className="text-muted-foreground">Create and manage QR code check-in sessions</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <QrCode className="mr-2 h-4 w-4" />
              Create QR Session
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New QR Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sessionName">Session Name *</Label>
                <Input
                  id="sessionName"
                  value={newSession.sessionName}
                  onChange={(e) => setNewSession({ ...newSession, sessionName: e.target.value })}
                  placeholder="Sunday Morning Service"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionDate">Date *</Label>
                  <Input
                    id="sessionDate"
                    type="date"
                    value={newSession.sessionDate}
                    onChange={(e) => setNewSession({ ...newSession, sessionDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTime">Time *</Label>
                  <Input
                    id="sessionTime"
                    type="time"
                    value={newSession.sessionTime}
                    onChange={(e) => setNewSession({ ...newSession, sessionTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serviceType">Service Type</Label>
                  <select
                    id="serviceType"
                    className="w-full p-2 border rounded-md"
                    value={newSession.serviceType}
                    onChange={(e) => setNewSession({ ...newSession, serviceType: e.target.value })}
                  >
                    <option value="Sunday Service">Sunday Service</option>
                    <option value="Prayer Meeting">Prayer Meeting</option>
                    <option value="Bible Study">Bible Study</option>
                    <option value="Youth Service">Youth Service</option>
                    <option value="Special Event">Special Event</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    className="w-full p-2 border rounded-md"
                    value={newSession.language}
                    onChange={(e) => setNewSession({ ...newSession, language: e.target.value })}
                  >
                    <option value="English">English</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Malayalam">Malayalam</option>
                    <option value="Urdu">Urdu</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiresAt">Expires At (Optional)</Label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={newSession.expiresAt}
                  onChange={(e) => setNewSession({ ...newSession, expiresAt: e.target.value })}
                />
              </div>

              <Button onClick={handleCreateSession} disabled={loading} className="w-full">
                {loading ? "Creating..." : "Create Session"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sessions.map((session) => (
          <Card key={session.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="truncate">{session.session_name}</span>
                <Badge variant={session.is_active ? "default" : "secondary"}>
                  {session.is_active ? "Active" : "Inactive"}
                </Badge>
              </CardTitle>
              <CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(session.session_date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4" />
                  {session.session_time}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <p>
                  <strong>Service:</strong> {session.service_type}
                </p>
                <p>
                  <strong>Language:</strong> {session.language}
                </p>
              </div>

              {session.qrCodeImage && (
                <div className="mt-4">
                  <img
                    src={session.qrCodeImage || "/placeholder.svg"}
                    alt="QR Code"
                    className="w-full max-w-[200px] mx-auto"
                  />
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => handleViewAttendance(session)} className="flex-1">
                  <Users className="mr-2 h-4 w-4" />
                  View Attendance
                </Button>
                {session.is_active && (
                  <Button variant="destructive" size="sm" onClick={() => handleDeactivate(session.id)}>
                    Deactivate
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedSession && (
        <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Attendance Records - {selectedSession.session_name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {attendanceRecords.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No attendance records yet</p>
              ) : (
                <div className="space-y-2">
                  {attendanceRecords.map((record) => (
                    <Card key={record.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">
                              {record.member_first_name || record.newcomer_first_name}{" "}
                              {record.member_last_name || record.newcomer_last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {record.member_phone || record.newcomer_phone}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {record.member_email || record.newcomer_email}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant={record.member_id ? "default" : "secondary"}>
                              {record.member_id ? "Member" : "Newcomer"}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(record.check_in_time).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
