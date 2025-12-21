"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar, Clock, MapPin, Users, Plus, Edit, Trash2, Eye } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { getToken } from "@/lib/utils"
import { useEffect } from "react"

import { useChurch } from "@/components/providers/church-context"

export function EventsManagement() {
  const { selectedChurch, userRole } = useChurch()
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    endDate: "",
    time: "",
    location: "",
    category: "Service",
    maxAttendees: "100",
    organizer: ""
  })

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const token = getToken()
      if (!token) return

      const params = selectedChurch?.id && selectedChurch.id !== 'all'
        ? { churchId: selectedChurch.id }
        : {}

      const data: any = await apiClient.getEvents(token)
      // Filter by church on frontend if needed, though backend should handle it if passed params
      let filtered = data.data || []
      if (selectedChurch?.id && selectedChurch.id !== 'all') {
        filtered = filtered.filter((e: any) => e.church_id === selectedChurch.id)
      }
      setEvents(filtered)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [selectedChurch])

  const handleCreateEvent = async () => {
    try {
      const token = getToken()
      if (!token) return

      const payload = {
        ...formData,
        maxAttendees: parseInt(formData.maxAttendees) || 0,
        church_id: selectedChurch?.id === 'all' ? undefined : selectedChurch?.id
      }

      console.log("[EventsManagement] creating event with payload:", payload)
      await apiClient.createEvent(payload, token)
      setCreateDialogOpen(false)
      setFormData({
        title: "",
        description: "",
        date: "",
        endDate: "",
        time: "",
        location: "",
        category: "Service",
        maxAttendees: "100",
        organizer: ""
      })
      fetchEvents()
    } catch (e) {
      console.error(e)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Prayer":
        return "bg-purple-100 text-purple-800"
      case "Baptism":
        return "bg-blue-100 text-blue-800"
      case "Youth":
        return "bg-green-100 text-green-800"
      case "Outreach":
        return "bg-orange-100 text-orange-800"
      case "Worship":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-100 text-blue-800"
      case "Ongoing":
        return "bg-green-100 text-green-800"
      case "Completed":
        return "bg-gray-100 text-gray-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Events Management</h2>
          <p className="text-muted-foreground">Create and manage church events and activities</p>
        </div>
        {(userRole === "super_admin" || userRole === "church_pastor" || userRole === "church_leader") && (
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => setCreateDialogOpen(true)}>
                <Plus className="w-4 h-4" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input id="title" placeholder="Enter event title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter event description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Start Date</Label>
                  <Input id="date" type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" placeholder="e.g., 7:00 PM" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxAttendees">Max Attendees</Label>
                  <Input id="maxAttendees" type="number" placeholder="100" value={formData.maxAttendees} onChange={e => setFormData({ ...formData, maxAttendees: e.target.value })} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="Enter event location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" placeholder="e.g., Prayer, Youth, Outreach" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organizer">Organizer</Label>
                  <Input id="organizer" placeholder="Enter organizer name" value={formData.organizer} onChange={e => setFormData({ ...formData, organizer: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateEvent}>Create Event</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Event Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Events", value: events.length, icon: Calendar, color: "bg-primary" },
          {
            label: "Upcoming",
            value: events.filter((e) => e.status === "Upcoming").length,
            icon: Clock,
            color: "bg-blue-500",
          },
          {
            label: "Total Attendees",
            value: events.reduce((sum, e) => sum + e.attendees, 0),
            icon: Users,
            color: "bg-green-500",
          },
          {
            label: "This Month",
            value: events.filter((e) => new Date(e.date).getMonth() === new Date().getMonth()).length,
            icon: Calendar,
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

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                </div>
                <div className="flex gap-1">
                  <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {event.date}
                    {event.endDate !== event.date && ` - ${event.endDate}`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {event.attendees} / {event.maxAttendees} attendees
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Registration</span>
                  <span className="font-medium">{Math.round((event.attendees / event.maxAttendees) * 100)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  {(userRole === "super_admin" || userRole === "church_pastor" || userRole === "church_leader") && (
                    <>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="text-xs text-muted-foreground pt-2 border-t">Organized by {event.organizer}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
