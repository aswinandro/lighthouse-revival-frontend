"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Eye, CheckCircle } from "lucide-react"
import { useChurch } from "@/components/providers/church-context"

export function PreachingSchedulesManagement() {
  const { userRole, selectedChurch } = useChurch()

  const schedules = [
    {
      id: "1",
      church: "Abu Dhabi Church",
      pastor: "Pastor Michael",
      week: "Jan 28 - Feb 3, 2024",
      topic: "The Power of Faith",
      scripture: "Hebrews 11:1-6",
      comments: "Focus on practical applications of faith in daily life",
      actualTopic: "",
      pastorNotes: "",
      attendance: null,
      status: "Scheduled",
    },
    {
      id: "2",
      church: "Dubai Church",
      pastor: "Pastor David",
      week: "Jan 28 - Feb 3, 2024",
      topic: "Walking in Love",
      scripture: "1 Corinthians 13",
      comments: "Emphasize love as the foundation of Christian life",
      actualTopic: "Walking in Love - Practical Steps",
      pastorNotes: "Great response from congregation, many testimonies shared",
      attendance: 654,
      status: "Completed",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Preaching Schedules</h2>
          <p className="text-muted-foreground">
            {userRole === "super_admin" ? "Assign topics to pastors" : "View your preaching assignments"}
          </p>
        </div>
        {userRole === "super_admin" && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Assign Topic
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Preaching Topic</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Church</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select church" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Abu Dhabi Church</SelectItem>
                      <SelectItem value="2">Dubai Church</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Pastor</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pastor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Pastor Michael</SelectItem>
                      <SelectItem value="2">Pastor David</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Week Start</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Week End</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Topic</Label>
                  <Input placeholder="Enter preaching topic" />
                </div>
                <div className="space-y-2">
                  <Label>Scripture Reference</Label>
                  <Input placeholder="e.g., John 3:16-21" />
                </div>
                <div className="space-y-2">
                  <Label>Comments/Instructions</Label>
                  <Textarea placeholder="Additional notes for the pastor" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Assign Topic</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Schedules Table */}
      <Card>
        <CardHeader>
          <CardTitle>Preaching Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {userRole === "super_admin" && <TableHead>Church</TableHead>}
                <TableHead>Pastor</TableHead>
                <TableHead>Week</TableHead>
                <TableHead>Assigned Topic</TableHead>
                <TableHead>Scripture</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  {userRole === "super_admin" && <TableCell className="font-medium">{schedule.church}</TableCell>}
                  <TableCell>{schedule.pastor}</TableCell>
                  <TableCell>{schedule.week}</TableCell>
                  <TableCell>{schedule.topic}</TableCell>
                  <TableCell className="text-sm">{schedule.scripture}</TableCell>
                  <TableCell>
                    <Badge variant={schedule.status === "Completed" ? "default" : "secondary"}>{schedule.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Preaching Schedule Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">Week</Label>
                                <p className="text-sm text-muted-foreground">{schedule.week}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Status</Label>
                                <Badge variant={schedule.status === "Completed" ? "default" : "secondary"}>
                                  {schedule.status}
                                </Badge>
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Assigned Topic</Label>
                              <p className="text-sm text-muted-foreground mt-1">{schedule.topic}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Scripture</Label>
                              <p className="text-sm text-muted-foreground mt-1">{schedule.scripture}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Instructions from Super Admin</Label>
                              <p className="text-sm text-muted-foreground mt-1">{schedule.comments}</p>
                            </div>
                            {schedule.status === "Completed" && (
                              <>
                                <div>
                                  <Label className="text-sm font-medium">Actual Topic Preached</Label>
                                  <p className="text-sm text-muted-foreground mt-1">{schedule.actualTopic}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Pastor's Notes</Label>
                                  <p className="text-sm text-muted-foreground mt-1">{schedule.pastorNotes}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Attendance</Label>
                                  <p className="text-sm text-muted-foreground mt-1">{schedule.attendance} people</p>
                                </div>
                              </>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      {userRole === "church_pastor" && schedule.status === "Scheduled" && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Complete
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Complete Preaching Report</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label>Actual Topic Preached</Label>
                                <Input placeholder="What did you actually preach?" defaultValue={schedule.topic} />
                              </div>
                              <div className="space-y-2">
                                <Label>Attendance Count</Label>
                                <Input type="number" placeholder="Number of attendees" />
                              </div>
                              <div className="space-y-2">
                                <Label>Pastor's Notes</Label>
                                <Textarea placeholder="Share how the service went, testimonies, etc." rows={5} />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline">Cancel</Button>
                              <Button>Submit Report</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
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
