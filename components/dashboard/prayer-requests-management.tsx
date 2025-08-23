"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Eye, Heart, Clock, CheckCircle, Mail, Phone } from "lucide-react"

export function PrayerRequestsManagement() {
  const [selectedRequest, setSelectedRequest] = useState<any>(null)

  const prayerRequests = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+971-50-123-4567",
      category: "Health",
      priority: "High",
      status: "New",
      subject: "Healing for my mother",
      message: "Please pray for my mother who is undergoing surgery next week. We trust in God's healing power.",
      submittedAt: "2024-01-22 10:30 AM",
      assignedTo: "Pastor Michael",
      followUpDate: "2024-01-25",
    },
    {
      id: 2,
      name: "David Wilson",
      email: "david@example.com",
      phone: "+971-55-987-6543",
      category: "Family",
      priority: "Medium",
      status: "In Progress",
      subject: "Marriage restoration",
      message: "Requesting prayers for reconciliation with my spouse. We are going through difficult times.",
      submittedAt: "2024-01-20 02:15 PM",
      assignedTo: "Elder Mary",
      followUpDate: "2024-01-27",
    },
    {
      id: 3,
      name: "Anonymous",
      email: "anonymous@request.com",
      phone: "Not provided",
      category: "Financial",
      priority: "Medium",
      status: "New",
      subject: "Job opportunity",
      message: "Please pray for a job opportunity. I have been unemployed for 3 months and need God's provision.",
      submittedAt: "2024-01-21 08:45 AM",
      assignedTo: "Unassigned",
      followUpDate: "2024-01-24",
    },
    {
      id: 4,
      name: "Maria Santos",
      email: "maria@example.com",
      phone: "+971-52-456-7890",
      category: "Spiritual",
      priority: "Low",
      status: "Completed",
      subject: "Spiritual growth",
      message: "Pray for my spiritual growth and deeper relationship with God.",
      submittedAt: "2024-01-18 06:20 PM",
      assignedTo: "Pastor Michael",
      followUpDate: "2024-01-21",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Follow-up":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Health":
        return <Heart className="w-4 h-4" />
      case "Family":
        return <MessageSquare className="w-4 h-4" />
      case "Financial":
        return <Clock className="w-4 h-4" />
      case "Spiritual":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Prayer Requests</h2>
          <p className="text-muted-foreground">Manage and respond to prayer requests from the community</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-1">
            <MessageSquare className="w-3 h-3" />
            {prayerRequests.filter((r) => r.status === "New").length} New
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Clock className="w-3 h-3" />
            {prayerRequests.filter((r) => r.status === "In Progress").length} In Progress
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Requests", value: prayerRequests.length, color: "bg-primary", icon: MessageSquare },
          {
            label: "New Requests",
            value: prayerRequests.filter((r) => r.status === "New").length,
            color: "bg-blue-500",
            icon: Clock,
          },
          {
            label: "In Progress",
            value: prayerRequests.filter((r) => r.status === "In Progress").length,
            color: "bg-yellow-500",
            icon: MessageSquare,
          },
          {
            label: "Completed",
            value: prayerRequests.filter((r) => r.status === "Completed").length,
            color: "bg-green-500",
            icon: CheckCircle,
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

      {/* Prayer Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Prayer Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Requester</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prayerRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.name}</div>
                        <div className="text-sm text-muted-foreground">{request.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(request.category)}
                        <span className="text-sm">{request.category}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">{request.subject}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(request.priority)}>{request.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{request.assignedTo}</TableCell>
                    <TableCell className="text-sm">{request.submittedAt}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(request)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Prayer Request Details</DialogTitle>
                          </DialogHeader>
                          {selectedRequest && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Name</label>
                                  <p className="text-sm text-muted-foreground">{selectedRequest.name}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Email</label>
                                  <p className="text-sm text-muted-foreground">{selectedRequest.email}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Phone</label>
                                  <p className="text-sm text-muted-foreground">{selectedRequest.phone}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Category</label>
                                  <p className="text-sm text-muted-foreground">{selectedRequest.category}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Priority</label>
                                  <Badge className={getPriorityColor(selectedRequest.priority)}>
                                    {selectedRequest.priority}
                                  </Badge>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Status</label>
                                  <Badge className={getStatusColor(selectedRequest.status)}>
                                    {selectedRequest.status}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Subject</label>
                                <p className="text-sm text-muted-foreground mt-1">{selectedRequest.subject}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Prayer Request</label>
                                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                  {selectedRequest.message}
                                </p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Assigned To</label>
                                  <Select defaultValue={selectedRequest.assignedTo}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Pastor Michael">Pastor Michael</SelectItem>
                                      <SelectItem value="Elder Mary">Elder Mary</SelectItem>
                                      <SelectItem value="Elder John">Elder John</SelectItem>
                                      <SelectItem value="Unassigned">Unassigned</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Status</label>
                                  <Select defaultValue={selectedRequest.status}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="New">New</SelectItem>
                                      <SelectItem value="In Progress">In Progress</SelectItem>
                                      <SelectItem value="Follow-up">Follow-up</SelectItem>
                                      <SelectItem value="Completed">Completed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Response Notes</label>
                                <Textarea
                                  placeholder="Add notes about follow-up actions or prayer responses..."
                                  className="mt-1"
                                />
                              </div>
                              <div className="flex gap-2 pt-4">
                                <Button className="flex-1">
                                  <Mail className="w-4 h-4 mr-2" />
                                  Send Response
                                </Button>
                                <Button variant="outline" className="flex-1 bg-transparent">
                                  <Phone className="w-4 h-4 mr-2" />
                                  Schedule Call
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
