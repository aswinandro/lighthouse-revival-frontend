"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BookOpen, Users, Award, Clock, Plus, Eye } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { getToken } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { useChurch } from "@/components/providers/church-context"

export function CoursesManagement() {
  const { selectedChurch } = useChurch()
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    instructor: "",
    startDate: "",
    status: "Upcoming"
  })

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const token = getToken()
      if (!token) return
      const data: any = await apiClient.getCourses(token)

      let filtered = data.data || []
      if (selectedChurch?.id && selectedChurch.id !== 'all') {
        filtered = filtered.filter((c: any) => c.church_id === selectedChurch.id)
      }
      setCourses(filtered)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [selectedChurch])

  const handleCreateCourse = async () => {
    try {
      const token = getToken()
      if (!token) return

      const payload = {
        ...formData,
        church_id: selectedChurch?.id === 'all' ? undefined : selectedChurch?.id
      }

      console.log("[CoursesManagement] creating course with payload:", payload)
      await apiClient.createCourse(payload, token)
      setCreateDialogOpen(false)
      setFormData({
        title: "",
        description: "",
        duration: "",
        instructor: "",
        startDate: "",
        status: "Upcoming"
      })
      fetchCourses()
    } catch (e) {
      console.error(e)
    }
  }

  // Mock students for now as getting all enrollments requires multiple calls
  const students = [
    {
      name: "John Doe",
      course: "Father's House Bible Study",
      progress: 75,
      status: "Pursuing",
      startDate: "2024-01-01",
      expectedCompletion: "2024-02-26",
    },
    // ... keep mock students
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Upcoming":
      case "Planning":
        return "bg-yellow-100 text-yellow-800"
      case "Completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500"
    if (progress >= 60) return "bg-yellow-500"
    return "bg-blue-500"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Courses Management</h2>
          <p className="text-muted-foreground">Manage church courses and track student progress</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => setCreateDialogOpen(true)}>
              <Plus className="w-4 h-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input id="title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" placeholder="e.g. 8 weeks" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor</Label>
                <Input id="instructor" value={formData.instructor} onChange={e => setFormData({ ...formData, instructor: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
              </div>
            </div>
            <Button onClick={handleCreateCourse}>Create Course</Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Courses", value: courses.length, icon: BookOpen, color: "bg-primary" },
          {
            label: "Active Courses",
            value: courses.filter((c) => c.status === "Active").length,
            icon: Clock,
            color: "bg-green-500",
          },
          {
            label: "Total Students",
            value: courses.reduce((sum, c) => sum + (c.enrolled || 0), 0),
            icon: Users,
            color: "bg-blue-500",
          },
          {
            label: "Completed",
            value: courses.reduce((sum, c) => sum + (c.completed || 0), 0),
            icon: Award,
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

      {/* Courses Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Course Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
                    </div>
                    <Badge className={getStatusColor(course.status)}>{course.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Duration:</span>
                      <p className="font-medium">{course.duration}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Instructor:</span>
                      <p className="font-medium">{course.instructor}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Enrolled:</span>
                      <p className="font-medium">{course.enrolled || 0} students</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Completed:</span>
                      <p className="font-medium">{course.completed || 0} students</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Completion Rate</span>
                      <span className="font-medium">{course.enrolled ? Math.round((course.completed / course.enrolled) * 100) : 0}%</span>
                    </div>
                    <Progress value={course.enrolled ? (course.completed / course.enrolled) * 100 : 0} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Next Session:</span>
                      <span className="ml-1 font-medium">{course.nextSession}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Student Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Student Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Expected Completion</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.course}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={student.progress} className="w-20 h-2" />
                      <span className="text-sm font-medium">{student.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={student.status === "Completed" ? "default" : "secondary"}>{student.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{student.startDate}</TableCell>
                  <TableCell className="text-sm">{student.expectedCompletion}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
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
