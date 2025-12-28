"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Users, BookOpen, Calendar, Clock, MessageSquare, Award } from "lucide-react"
import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { getToken } from "@/lib/utils"
import { Alert } from "@/components/ui/alert"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { Loader } from "@/components/ui/loader"

export function MemberOverview() {
    const [user, setUser] = useState<any>(null)
    const [member, setMember] = useState<any>(null)
    const [attendance, setAttendance] = useState<any[]>([])
    const [courses, setCourses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const storedUser = localStorage.getItem("user")
                if (storedUser) setUser(JSON.parse(storedUser))

                const token = getToken()
                if (!token) return

                // 1. Get Member Profile
                const profileRes = await apiClient.getMyMemberProfile(token) as any
                const memberData = profileRes.data
                setMember(memberData)

                if (memberData) {
                    // 2. Get Personal Attendance
                    const attendanceRes = await apiClient.getMemberAttendance(token, memberData.id) as any
                    setAttendance(attendanceRes.data || [])
                }

                // 3. Get Course Enrollments
                const coursesRes = await apiClient.getMyEnrollments(token) as any
                setCourses(coursesRes.data || [])

            } catch (e: any) {
                console.error(e)
                setError(e.message || "Failed to load overview data")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader size={80} />
                <p className="text-sm text-muted-foreground animate-pulse">Gathering your journey...</p>
            </div>
        )
    }

    const getGraphData = () => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const dataMap: { [key: string]: number } = {}

        // Initialize last 6 months
        const now = new Date()
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const label = months[d.getMonth()]
            dataMap[label] = 0
        }

        attendance.forEach(record => {
            if (record.present) {
                const d = new Date(record.service_date)
                const label = months[d.getMonth()]
                if (dataMap[label] !== undefined) {
                    dataMap[label]++
                }
            }
        })

        return Object.keys(dataMap).map(label => ({
            name: label,
            sessions: dataMap[label]
        }))
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    Welcome back, {member?.first_name || user?.first_name || user?.firstName || "Member"}!
                </h2>
                <p className="text-muted-foreground">
                    Here's what's happening with your church journey.
                </p>
            </div>

            {error && <Alert variant="destructive">{error}</Alert>}

            {!member && !loading && (
                <div className="w-full">
                    <Alert className="w-full py-6">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">Your account is not yet linked to a member record. Please contact your church administrator to link your profile.</span>
                        </div>
                    </Alert>
                </div>
            )}

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                        <BookOpen className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{courses.length}</div>
                        <p className="text-xs text-muted-foreground">Active learning</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Recent Attendance</CardTitle>
                        <Users className="h-4 w-4 text-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{attendance.filter(a => a.present).length} / {attendance.length}</div>
                        <p className="text-xs text-muted-foreground">Last {attendance.length} sessions</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Church Status</CardTitle>
                        <Award className="h-4 w-4 text-secondary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold capitalize">{member?.membership_status || "Registered"}</div>
                        <p className="text-xs text-muted-foreground">Membership Level</p>
                    </CardContent>
                </Card>
            </div>

            {/* Attendance Graph Section */}
            <Card className="col-span-full">
                <CardHeader>
                    <CardTitle>Attendance Trends</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getGraphData()}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#888888', fontSize: 12 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#888888', fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Bar dataKey="sessions" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Course Progress */}
                <Card>
                    <CardHeader>
                        <CardTitle>My Courses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {courses.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">No active courses yet.</p>
                            ) : (
                                courses.map((ce) => (
                                    <div key={ce.id} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">{ce.course_name}</p>
                                                <p className="text-xs text-muted-foreground">{ce.instructor_name || "Instructor"}</p>
                                            </div>
                                            <Badge variant={ce.status === "Active" ? "default" : "secondary"}>
                                                {ce.status}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Progress value={parseFloat(ce.attendance_percentage || "0")} className="h-2" />
                                            <span className="text-xs font-medium w-8">
                                                {Math.round(parseFloat(ce.attendance_percentage || "0"))}%
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                            <Button variant="outline" className="w-full mt-4 bg-transparent border-dashed">
                                Explore More Courses
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Attendance History */}
                <Card>
                    <CardHeader>
                        <CardTitle>Attendance History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {attendance.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">No attendance history available.</p>
                            ) : (
                                attendance.map((record) => (
                                    <div key={record.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${record.present ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                                                <Calendar className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{record.service_type}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(record.service_date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <Badge variant={record.present ? "default" : "destructive"}>
                                            {record.present ? "Present" : "Absent"}
                                        </Badge>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quick Help / Prayer */}
                <Card>
                    <CardHeader>
                        <CardTitle>Prayer & Support</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">Need prayer or assistance? We're here for you.</p>
                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="h-auto flex-col gap-2 py-4 bg-transparent">
                                <MessageSquare className="h-5 w-5" />
                                <span>Submit Prayer</span>
                            </Button>
                            <Button variant="outline" className="h-auto flex-col gap-2 py-4 bg-transparent">
                                <Users className="h-5 w-5" />
                                <span>Contact Deacon</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming for You */}
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { title: "Sunday Service", date: "Every Sunday", time: "12:30 PM" },
                                { title: "Bible Study", date: "Every Wednesday", time: "7:00 PM" },
                            ].map((event, i) => (
                                <div key={i} className="flex items-center justify-between p-2">
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-4 w-4 text-primary" />
                                        <div>
                                            <p className="text-sm font-medium">{event.title}</p>
                                            <p className="text-xs text-muted-foreground">{event.date} • {event.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
