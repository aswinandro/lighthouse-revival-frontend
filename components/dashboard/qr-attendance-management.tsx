"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QrCode, Calendar, Clock, Users } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { cn, getToken } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useChurch } from "@/components/providers/church-context"

export function QRAttendanceManagement() {
    const { selectedChurch, userRole } = useChurch()
    const [loading, setLoading] = useState(false)
    const [sessions, setSessions] = useState<any[]>([])
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [selectedSession, setSelectedSession] = useState<any>(null)
    const [attendanceRecords, setAttendanceRecords] = useState<any[]>([])
    const { toast } = useToast()

    const [newSession, setNewSession] = useState({
        sessionName: "",
        sessionDate: "",
        sessionTime: "",
        serviceType: "Sunday_Service",
        language: "English",
        expiresAt: "",
    })

    useEffect(() => {
        if (selectedChurch && userRole !== "member" && userRole !== "user") {
            loadSessions()
        }
    }, [selectedChurch, userRole])

    const loadSessions = async () => {
        try {
            const token = getToken()
            if (!token || !selectedChurch || selectedChurch.id === 'all') return
            const response = await apiClient.getQRSessions(selectedChurch.id, token, { isActive: true }) as any
            setSessions(response.data || [])
        } catch (error: any) {
            console.error("Failed to load sessions", error)
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
            if (!token || !selectedChurch || selectedChurch.id === 'all') {
                toast({
                    title: "Error",
                    description: "Please select a specific church first",
                    variant: "destructive",
                })
                return
            }
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
                serviceType: "Sunday_Service",
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

    if (userRole === "member" || userRole === "user") return null

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-card/30 p-4 rounded-xl border border-border/50">
                <div>
                    <h3 className="text-lg font-bold">QR Attendance</h3>
                    <p className="text-sm text-muted-foreground text-balance">Generate codes for quick check-in</p>
                </div>
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="gap-2 bg-primary/5 border-primary/20 hover:bg-primary/10">
                            <QrCode className="w-4 h-4" />
                            Generate QR
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Create New QR Session</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="sessionName">Session Name *</Label>
                                <Input
                                    id="sessionName"
                                    value={newSession.sessionName}
                                    onChange={(e) => setNewSession({ ...newSession, sessionName: e.target.value })}
                                    placeholder="Sunday Morning Service"
                                    className="bg-background/50"
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
                                        className="bg-background/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="sessionTime">Time *</Label>
                                    <Input
                                        id="sessionTime"
                                        type="time"
                                        value={newSession.sessionTime}
                                        onChange={(e) => setNewSession({ ...newSession, sessionTime: e.target.value })}
                                        className="bg-background/50"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="serviceType">Service Type</Label>
                                    <Select
                                        value={newSession.serviceType}
                                        onValueChange={(value) => setNewSession({ ...newSession, serviceType: value })}
                                    >
                                        <SelectTrigger id="serviceType" className="bg-background/50">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Sunday_Service">Sunday Service</SelectItem>
                                            <SelectItem value="Midweek_Service">Midweek Service</SelectItem>
                                            <SelectItem value="Prayer_Meeting">Prayer Meeting</SelectItem>
                                            <SelectItem value="Special_Event">Special Event</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="language">Language</Label>
                                    <Select
                                        value={newSession.language}
                                        onValueChange={(value) => setNewSession({ ...newSession, language: value })}
                                    >
                                        <SelectTrigger id="language" className="bg-background/50">
                                            <SelectValue placeholder="Select language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="English">English</SelectItem>
                                            <SelectItem value="Tamil">Tamil</SelectItem>
                                            <SelectItem value="Hindi">Hindi</SelectItem>
                                            <SelectItem value="Malayalam">Malayalam</SelectItem>
                                            <SelectItem value="Urdu">Urdu</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="expiresAt">Expires At (Optional)</Label>
                                <Input
                                    id="expiresAt"
                                    type="datetime-local"
                                    value={newSession.expiresAt}
                                    onChange={(e) => setNewSession({ ...newSession, expiresAt: e.target.value })}
                                    className="bg-background/50"
                                />
                            </div>

                            <Button onClick={handleCreateSession} disabled={loading} className="w-full mt-2 py-6 text-lg font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                                {loading ? "Creating..." : "Create Session"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Active QR Sessions */}
            {sessions.length > 0 && (
                <div className="space-y-6 pt-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <QrCode className="w-4 h-4 text-primary" />
                            </div>
                            Active QR Sessions
                        </h3>
                        <Badge variant="outline" className="text-muted-foreground uppercase tracking-wider text-[10px]">
                            Live Sessions
                        </Badge>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {sessions.map((session) => (
                            <Card key={session.id} className="group overflow-hidden border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-300">
                                <CardHeader className="pb-3 border-b border-border/50 bg-muted/30">
                                    <CardTitle className="flex items-center justify-between text-base">
                                        <span className="truncate font-bold tracking-tight">{session.session_name}</span>
                                        <Badge variant={session.is_active ? "default" : "secondary"} className={cn(
                                            "text-[10px] h-5 px-2 font-bold uppercase tracking-tight",
                                            session.is_active ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20" : ""
                                        )}>
                                            {session.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="p-6 space-y-4">
                                        <div className="flex items-center justify-center p-4 bg-white/5 rounded-xl border border-white/5 group-hover:bg-white/10 transition-colors">
                                            {session.qrCodeImage && (
                                                <div className="relative w-40 h-40 group-hover:scale-105 transition-transform duration-500">
                                                    <img
                                                        src={session.qrCodeImage}
                                                        alt="QR Code"
                                                        className="w-full h-full rounded-lg mix-blend-screen opacity-90 group-hover:opacity-100"
                                                    />
                                                    <div className="absolute inset-0 bg-primary/5 rounded-lg -z-10 group-hover:bg-primary/20 transition-colors" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-xs">
                                            <div className="space-y-1 p-2 rounded-lg bg-muted/50 border border-border/50">
                                                <p className="text-muted-foreground font-medium uppercase tracking-tighter text-[10px]">Date</p>
                                                <div className="flex items-center gap-2 text-foreground font-semibold">
                                                    <Calendar className="h-3 w-3 text-primary" />
                                                    {new Date(session.session_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </div>
                                            </div>
                                            <div className="space-y-1 p-2 rounded-lg bg-muted/50 border border-border/50">
                                                <p className="text-muted-foreground font-medium uppercase tracking-tighter text-[10px]">Time</p>
                                                <div className="flex items-center gap-2 text-foreground font-semibold">
                                                    <Clock className="h-3 w-3 text-primary" />
                                                    {session.session_time}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleViewAttendance(session)} className="flex-1 text-xs h-9 bg-muted/30 hover:bg-muted/80 border-border/50">
                                                View Details
                                            </Button>
                                            {session.is_active && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeactivate(session.id)}
                                                    className="text-xs h-9 text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20"
                                                >
                                                    Stop
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Attendance Records Dialog */}
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
