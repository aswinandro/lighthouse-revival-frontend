"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Church, Users, Music, BookOpen, Heart, UserPlus, MapPin, Calendar, Plus } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { getToken } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function MinistriesManagement() {
  const [ministries, setMinistries] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    leader: "",
    category: "",
    meetingDay: "",
    meetingTime: "",
    location: "",
    status: "Active"
  })

  const fetchMinistries = async () => {
    setLoading(true)
    try {
      const token = getToken()
      if (!token) return
      const data: any = await apiClient.getMinistries(token)
      setMinistries(data.data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMinistries()
  }, [])

  const handleCreateMinistry = async () => {
    try {
      const token = getToken()
      if (!token) return
      await apiClient.createMinistry(formData, token)
      setCreateDialogOpen(false)
      fetchMinistries()
    } catch (e) {
      console.error(e)
    }
  }

  const deployments = [
    {
      member: "John Doe",
      ministry: "Choir Ministry",
      role: "Vocalist",
      dateAssigned: "2024-01-15",
      status: "Active",
      missionField: "English Service",
    },
    {
      member: "Sarah Wilson",
      ministry: "Teaching Ministry",
      role: "Bible Study Leader",
      dateAssigned: "2023-12-01",
      status: "Active",
      missionField: "Tamil Service",
    },
    {
      member: "Michael Johnson",
      ministry: "Outreach Ministry",
      role: "Team Leader",
      dateAssigned: "2024-01-08",
      status: "Active",
      missionField: "Community Outreach",
    },
    {
      member: "Priya Sharma",
      ministry: "Prayer Ministry",
      role: "Intercessor",
      dateAssigned: "2024-01-20",
      status: "Training",
      missionField: "Hindi Service",
    },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Worship":
        return "bg-purple-100 text-purple-800"
      case "Teaching":
        return "bg-blue-100 text-blue-800"
      case "Outreach":
        return "bg-green-100 text-green-800"
      case "Prayer":
        return "bg-orange-100 text-orange-800"
      case "Youth":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Training":
        return "bg-yellow-100 text-yellow-800"
      case "Inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Ministries Management</h2>
          <p className="text-muted-foreground">Manage church ministries and member deployments</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => setCreateDialogOpen(true)}>
              <Plus className="w-4 h-4" />
              Add Ministry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Ministry</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Ministry Name</Label>
                <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={v => setFormData({ ...formData, category: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Worship">Worship</SelectItem>
                    <SelectItem value="Teaching">Teaching</SelectItem>
                    <SelectItem value="Outreach">Outreach</SelectItem>
                    <SelectItem value="Prayer">Prayer</SelectItem>
                    <SelectItem value="Youth">Youth</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="leader">Leader</Label>
                <Input id="leader" value={formData.leader} onChange={e => setFormData({ ...formData, leader: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meetingDay">Meeting Day</Label>
                <Select onValueChange={v => setFormData({ ...formData, meetingDay: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sunday">Sunday</SelectItem>
                    <SelectItem value="Monday">Monday</SelectItem>
                    <SelectItem value="Tuesday">Tuesday</SelectItem>
                    <SelectItem value="Wednesday">Wednesday</SelectItem>
                    <SelectItem value="Thursday">Thursday</SelectItem>
                    <SelectItem value="Friday">Friday</SelectItem>
                    <SelectItem value="Saturday">Saturday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meetingTime">Meeting Time</Label>
                <Input id="meetingTime" placeholder="e.g. 7:00 PM" value={formData.meetingTime} onChange={e => setFormData({ ...formData, meetingTime: e.target.value })} />
              </div>
            </div>
            <Button onClick={handleCreateMinistry}>Create Ministry</Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Ministry Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Ministries", value: ministries.length, icon: Church, color: "bg-primary" },
          {
            label: "Active Members",
            value: ministries.reduce((sum, m) => sum + (m.members || 0), 0),
            icon: Users,
            color: "bg-green-500",
          },
          {
            label: "Active Deployments",
            value: deployments.filter((d) => d.status === "Active").length,
            icon: UserPlus,
            color: "bg-blue-500",
          },
          {
            label: "In Training",
            value: deployments.filter((d) => d.status === "Training").length,
            icon: BookOpen,
            color: "bg-yellow-500",
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

      {/* Ministries Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Ministry Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ministries.map((ministry) => {
              const IconComponent = Church // Default icon for now
              return (
                <Card key={ministry.id} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{ministry.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{ministry.description}</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className={getCategoryColor(ministry.category)}>{ministry.category}</Badge>
                      <Badge className={getStatusColor(ministry.status)}>{ministry.status}</Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{ministry.members || 0} members</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {ministry.meetingDay}s at {ministry.meetingTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{ministry.location}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm">
                        <span className="text-muted-foreground">Leader:</span>
                        <span className="ml-1 font-medium">{ministry.leader}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Member Deployments */}
      <Card>
        <CardHeader>
          <CardTitle>Member Deployments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Ministry</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Mission Field</TableHead>
                <TableHead>Date Assigned</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deployments.map((deployment, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{deployment.member}</TableCell>
                  <TableCell>{deployment.ministry}</TableCell>
                  <TableCell>{deployment.role}</TableCell>
                  <TableCell>{deployment.missionField}</TableCell>
                  <TableCell className="text-sm">{deployment.dateAssigned}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(deployment.status)}>{deployment.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive bg-transparent">
                        Remove
                      </Button>
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
