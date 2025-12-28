"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Eye, Heart, Clock, CheckCircle, Mail, Phone, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { apiClient } from "@/lib/api-client"
import { getToken } from "@/lib/utils"
import { Loader } from "@/components/ui/loader"
import { useToast } from "@/hooks/use-toast"
import { useChurch } from "@/components/providers/church-context"

export function PrayerRequestsManagement() {
  const { selectedChurch, userRole } = useChurch()
  const [prayerRequests, setPrayerRequests] = useState<any[]>([])
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [newRequestOpen, setNewRequestOpen] = useState(false)
  const [members, setMembers] = useState<any[]>([])
  const [newRequest, setNewRequest] = useState({
    subject: "",
    category: "Spiritual",
    priority: "Medium",
    message: ""
  })

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const token = getToken()
      if (!token) return

      const params = selectedChurch?.id && selectedChurch.id !== 'all'
        ? { churchId: selectedChurch.id }
        : {}

      const data: any = await apiClient.getPrayerRequests(token, params)
      setPrayerRequests(data.data || [])
    } catch (e) {
      console.error(e)
      toast({
        title: "Error",
        description: "Failed to load prayer requests",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchMembers = async () => {
    try {
      const token = getToken()
      if (!token || !selectedChurch?.id || selectedChurch.id === 'all') return
      const data: any = await apiClient.getMembersByChurch(selectedChurch.id, token)
      setMembers(data.data || [])
    } catch (e) {
      console.error("Failed to fetch members:", e)
    }
  }

  useEffect(() => {
    fetchRequests()
    if (userRole === 'super_admin' || userRole === 'church_pastor') {
      fetchMembers()
    }
  }, [selectedChurch])

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const token = getToken()
      if (!token) return
      await apiClient.updatePrayerRequest(id, { status }, token)
      toast({
        title: "Status Updated",
        description: `Request status changed to ${status}`,
      })
      fetchRequests()
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest({ ...selectedRequest, status })
      }
    } catch (e) {
      console.error(e)
      toast({
        title: "Update Failed",
        description: "Could not change request status",
        variant: "destructive",
      })
    }
  }

  const handleAssign = async (id: string, assignedTo: string) => {
    try {
      const token = getToken()
      if (!token) return
      await apiClient.updatePrayerRequest(id, { assignedTo }, token)
      toast({
        title: "Assigned",
        description: "Prayer request assigned successfully",
      })
      fetchRequests()
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest({ ...selectedRequest, assignedTo })
      }
    } catch (e) {
      console.error(e)
      toast({
        title: "Assignment Failed",
        description: "Could not assign prayer request",
        variant: "destructive",
      })
    }
  }

  const handleCreateRequest = async () => {
    setLoading(true)
    try {
      const token = getToken()
      if (!token) return

      const user = JSON.parse(localStorage.getItem("user") || "{}")
      const payload = {
        ...newRequest,
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'Anonymous',
        email: user.email,
        phone: user.phone || "",
        church_id: selectedChurch?.id === 'all' ? undefined : selectedChurch?.id
      }

      await apiClient.createPrayerRequest(payload, token)
      setNewRequestOpen(false)
      setNewRequest({
        subject: "",
        category: "Spiritual",
        priority: "Medium",
        message: ""
      })
      toast({
        title: "Success",
        description: "Prayer request submitted. We are praying for you!",
      })
      fetchRequests()
    } catch (e) {
      console.error(e)
      toast({
        title: "Submission Failed",
        description: "Could not submit prayer request",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

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

  const isAdmin = userRole === 'super_admin' || userRole === 'church_pastor'

  if (loading && prayerRequests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader size={80} />
        <p className="text-sm text-muted-foreground animate-pulse">Lifting up requests to Heaven...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Prayer Requests</h2>
          <p className="text-muted-foreground">
            {isAdmin ? 'Manage and respond to prayer requests from the community' : 'Submit and view your prayer requests'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Dialog open={newRequestOpen} onOpenChange={setNewRequestOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit Prayer Request</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    placeholder="e.g., Healing for family member"
                    value={newRequest.subject}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRequest({ ...newRequest, subject: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select
                      value={newRequest.category}
                      onValueChange={v => setNewRequest({ ...newRequest, category: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Health">Health</SelectItem>
                        <SelectItem value="Family">Family</SelectItem>
                        <SelectItem value="Financial">Financial</SelectItem>
                        <SelectItem value="Spiritual">Spiritual</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <Select
                      value={newRequest.priority}
                      onValueChange={v => setNewRequest({ ...newRequest, priority: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prayer Request</label>
                  <Textarea
                    placeholder="Describe your prayer request details..."
                    className="min-h-[100px]"
                    value={newRequest.message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewRequest({ ...newRequest, message: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setNewRequestOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateRequest} disabled={loading}>{loading ? "Submitting..." : "Submit Request"}</Button>
              </div>
            </DialogContent>
          </Dialog>
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
                  {isAdmin && <TableHead>Assigned To</TableHead>}
                  <TableHead>Submitted At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prayerRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 8 : 7} className="text-center py-8 text-muted-foreground">
                      No prayer requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  prayerRequests.map((request) => (
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
                      {isAdmin && <TableCell className="text-sm">{request.assignedTo}</TableCell>}
                      <TableCell className="text-sm">{new Date(request.created_at || request.submittedAt).toLocaleDateString()}</TableCell>
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
                                {isAdmin && (
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">Assigned To</label>
                                      <Select
                                        value={selectedRequest.assignedTo}
                                        onValueChange={(value) => handleAssign(selectedRequest.id, value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Unassigned">Unassigned</SelectItem>
                                          {members.map(member => (
                                            <SelectItem key={member.id} value={member.first_name + ' ' + member.last_name}>
                                              {member.first_name} {member.last_name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Status</label>
                                      <Select
                                        value={selectedRequest.status}
                                        onValueChange={(value) => handleUpdateStatus(selectedRequest.id, value)}
                                      >
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
                                )}
                                {isAdmin && (
                                  <>
                                    <div className="flex gap-2 pt-4">
                                      <Button className="flex-1">
                                        <Mail className="w-4 h-4 mr-2" />
                                        Send Message
                                      </Button>
                                      <Button variant="outline" className="flex-1 bg-transparent">
                                        <Phone className="w-4 h-4 mr-2" />
                                        Call Member
                                      </Button>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
