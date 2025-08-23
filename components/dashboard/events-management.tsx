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

export function EventsManagement() {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Fasting Prayer",
      description: "Three-day fasting and prayer event",
      date: "2024-08-01",
      endDate: "2024-08-03",
      time: "Online",
      location: "Zoom Platform",
      category: "Prayer",
      attendees: 150,
      maxAttendees: 200,
      status: "Upcoming",
      organizer: "Pastor Michael",
    },
    {
      id: 2,
      title: "Water Baptism Service",
      description: "Special baptism service for new believers",
      date: "2024-07-27",
      endDate: "2024-07-27",
      time: "5:00 PM",
      location: "G2 Hall at Brethren Church Center",
      category: "Baptism",
      attendees: 89,
      maxAttendees: 100,
      status: "Upcoming",
      organizer: "Elder Mary",
    },
    {
      id: 3,
      title: "Youth Ministry Meeting",
      description: "Monthly youth gathering and fellowship",
      date: "2024-07-30",
      endDate: "2024-07-30",
      time: "7:00 PM",
      location: "Youth Hall",
      category: "Youth",
      attendees: 45,
      maxAttendees: 60,
      status: "Upcoming",
      organizer: "Youth Pastor David",
    },
    {
      id: 4,
      title: "Community Outreach",
      description: "Food distribution to local community",
      date: "2024-07-20",
      endDate: "2024-07-20",
      time: "9:00 AM",
      location: "Community Center",
      category: "Outreach",
      attendees: 75,
      maxAttendees: 80,
      status: "Completed",
      organizer: "Elder John",
    },
  ])

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
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
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
                <Input id="title" placeholder="Enter event title" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter event description" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Start Date</Label>
                <Input id="date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" placeholder="e.g., 7:00 PM" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAttendees">Max Attendees</Label>
                <Input id="maxAttendees" type="number" placeholder="100" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Enter event location" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" placeholder="e.g., Prayer, Youth, Outreach" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organizer">Organizer</Label>
                <Input id="organizer" placeholder="Enter organizer name" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Create Event</Button>
            </div>
          </DialogContent>
        </Dialog>
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
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
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
