"use client"


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CheckCircle, XCircle, Clock, Eye, MessageSquare, UserCheck } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { getToken } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Loader } from "@/components/ui/loader"
import { useToast } from "@/hooks/use-toast"

export function NewcomersManagement() {
  const [newcomers, setNewcomers] = useState<any[]>([])
  const [selectedNewcomer, setSelectedNewcomer] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const fetchNewcomers = async () => {
    setLoading(true)
    try {
      const token = getToken()
      if (!token) return
      const data: any = await apiClient.getNewcomers(token)
      setNewcomers(data.data || [])
    } catch (e) {
      console.error(e)
      toast({
        title: "Error",
        description: "Failed to load newcomers",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNewcomers()
  }, [])

  const handleStatusChange = async (newcomerId: string, newStatus: string) => {
    try {
      const token = getToken()
      if (!token) return
      await apiClient.updateNewcomer(newcomerId, { status: newStatus }, token)
      fetchNewcomers()
      toast({
        title: "Status Updated",
        description: `Newcomer status changed to ${newStatus}`,
      })
      if (selectedNewcomer && selectedNewcomer.id === newcomerId) {
        setSelectedNewcomer({ ...selectedNewcomer, status: newStatus })
      }
    } catch (e) {
      console.error(e)
      toast({
        title: "Update Failed",
        description: "Could not change newcomer status",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Follow-up":
        return "bg-blue-100 text-blue-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "Pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "Follow-up":
        return <MessageSquare className="w-4 h-4 text-blue-600" />
      case "Rejected":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }



  if (loading && newcomers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader size={80} />
        <p className="text-sm text-muted-foreground animate-pulse">Welcoming new voices...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Newcomers Management</h2>
          <p className="text-muted-foreground">Review and manage newcomer registrations</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-1">
            <Clock className="w-3 h-3" />
            {newcomers.filter((n) => n.status === "Pending").length} Pending
          </Badge>
          <Badge variant="outline" className="gap-1">
            <MessageSquare className="w-3 h-3" />
            {newcomers.filter((n) => n.status === "Follow-up").length} Follow-up
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Newcomers", value: newcomers.length, color: "bg-primary" },
          {
            label: "Pending Review",
            value: newcomers.filter((n) => n.status === "Pending").length,
            color: "bg-yellow-500",
          },
          { label: "Approved", value: newcomers.filter((n) => n.status === "Approved").length, color: "bg-green-500" },
          {
            label: "Need Follow-up",
            value: newcomers.filter((n) => n.status === "Follow-up").length,
            color: "bg-blue-500",
          },
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 ${stat.color} rounded-full flex items-center justify-center`}>
                  <UserCheck className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Newcomers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Newcomer Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Background</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Follow-up</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newcomers.map((newcomer) => (
                  <TableRow key={newcomer.id}>
                    <TableCell>
                      <div className="font-medium">{newcomer.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{newcomer.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{newcomer.country}</div>
                        <Badge variant="outline" className="text-xs">
                          {newcomer.language}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(newcomer.status)}
                        <Badge className={getStatusColor(newcomer.status)}>{newcomer.status}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{newcomer.submittedAt}</TableCell>
                    <TableCell className="text-sm">{newcomer.followUpDate}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedNewcomer(newcomer)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Newcomer Details</DialogTitle>
                            </DialogHeader>
                            {selectedNewcomer && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Name</label>
                                    <p className="text-sm text-muted-foreground">{selectedNewcomer.name}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Email</label>
                                    <p className="text-sm text-muted-foreground">{selectedNewcomer.email}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Country</label>
                                    <p className="text-sm text-muted-foreground">{selectedNewcomer.country}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Language</label>
                                    <p className="text-sm text-muted-foreground">{selectedNewcomer.language}</p>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Comments</label>
                                  <p className="text-sm text-muted-foreground mt-1">{selectedNewcomer.comments}</p>
                                </div>
                                <div className="flex gap-2 pt-4">
                                  <Button
                                    onClick={() => handleStatusChange(selectedNewcomer.id, "Approved")}
                                    className="flex-1"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Approve
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => handleStatusChange(selectedNewcomer.id, "Follow-up")}
                                    className="flex-1"
                                  >
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Follow-up
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleStatusChange(selectedNewcomer.id, "Rejected")}
                                    className="flex-1"
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
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
