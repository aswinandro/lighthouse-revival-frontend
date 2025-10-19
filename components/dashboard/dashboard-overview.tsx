"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/providers/language-provider"

import { Users, UserPlus, Calendar, MessageSquare, TrendingUp, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { fetchDashboardOverview, fetchAttendanceTrends } from "@/lib/services/dashboard-service"
import { Alert } from "@/components/ui/alert"


export function DashboardOverview() {
  const { isRTL } = useLanguage()

  const [stats, setStats] = useState<any[] | null>(null)
  const [trends, setTrends] = useState<any[] | null>(null)
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetchDashboardOverview(),
      fetchAttendanceTrends(),
    ])
      .then(([overview, attendanceTrends]) => {
        // Map API data to UI stat cards
        setStats([
          {
            title: "Total Members",
            value: overview.totalMembers?.toLocaleString?.() ?? overview.totalMembers ?? "-",
            change: overview.membersChange ?? "",
            changeType: overview.membersChangeType ?? "positive",
            icon: Users,
            color: "bg-primary",
          },
          {
            title: "New Members",
            value: overview.newMembers?.toLocaleString?.() ?? overview.newMembers ?? "-",
            change: overview.newMembersChange ?? "",
            changeType: overview.newMembersChangeType ?? "positive",
            icon: UserPlus,
            color: "bg-accent",
          },
          {
            title: "This Week Attendance",
            value: overview.thisWeekAttendance?.toLocaleString?.() ?? overview.thisWeekAttendance ?? "-",
            change: overview.attendanceChange ?? "",
            changeType: overview.attendanceChangeType ?? "positive",
            icon: TrendingUp,
            color: "bg-secondary",
          },
          {
            title: "Prayer Requests",
            value: overview.prayerRequests?.toLocaleString?.() ?? overview.prayerRequests ?? "-",
            change: overview.prayerRequestsChange ?? "",
            changeType: overview.prayerRequestsChangeType ?? "positive",
            icon: MessageSquare,
            color: "bg-muted",
          },
        ])
        setTrends(attendanceTrends)
        setError("")
      })
      .catch((e) => {
        setError(e.message || "Failed to load dashboard data")
      })
      .finally(() => setLoading(false))
  }, [])

  const recentActivities = [
    {
      type: "member",
      message: "John Doe joined Tamil service",
      time: "2 hours ago",
      icon: UserPlus,
    },
    {
      type: "attendance",
      message: "English service attendance: 234 members",
      time: "1 day ago",
      icon: Users,
    },
    {
      type: "prayer",
      message: "New prayer request from Sarah Wilson",
      time: "3 hours ago",
      icon: MessageSquare,
    },
    {
      type: "event",
      message: "Water Baptism Service scheduled",
      time: "5 hours ago",
      icon: Calendar,
    },
  ]

  const upcomingEvents = [
    {
      title: "Fasting Prayer",
      date: "Aug 1-3, 2024",
      time: "Online",
      attendees: 150,
    },
    {
      title: "Water Baptism Service",
      date: "July 27, 2024",
      time: "5:00 PM",
      attendees: 89,
    },
    {
      title: "Youth Ministry Meeting",
      date: "July 30, 2024",
      time: "7:00 PM",
      attendees: 45,
    },
  ]


  return (
    <div className="space-y-6">
      {error && <Alert variant="destructive">{error}</Alert>}
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse h-32" />
            ))
          : stats?.map((stat) => {
              const IconComponent = stat.icon
              return (
                <Card key={stat.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                    <div className={`w-10 h-10 ${stat.color} rounded-full flex items-center justify-center`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="flex items-center gap-1 text-sm">
                      <Badge variant={stat.changeType === "positive" ? "default" : "destructive"} className="text-xs px-1">
                        {stat.change}
                      </Badge>
                      <span className="text-muted-foreground">from last month</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                const IconComponent = activity.icon
                return (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <IconComponent className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Events</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.time}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">{event.attendees} attending</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col gap-2">
              <UserPlus className="w-6 h-6" />
              Add New Member
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
              <Calendar className="w-6 h-6" />
              Create Event
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
              <MessageSquare className="w-6 h-6" />
              View Prayer Requests
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Service Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { service: "English Service", time: "12:30pm - 2:30pm", day: "Sunday", attendees: 234 },
          { service: "Tamil Service", time: "3:00pm - 5:00pm", day: "Sunday", attendees: 189 },
          { service: "Hindi Service", time: "4:30pm - 6:00pm", day: "Saturday", attendees: 156 },
          { service: "Malayalam Service", time: "3:00pm - 5:00pm", day: "Sunday", attendees: 203 },
        ].map((service, index) => (
          <Card key={index} className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{service.service}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {service.time}
              </div>
              <Badge variant="secondary">{service.day}</Badge>
              <div className="text-2xl font-bold text-primary">{service.attendees}</div>
              <p className="text-xs text-muted-foreground">Last attendance</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
