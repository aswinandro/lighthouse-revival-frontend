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
import { Building2, Plus, Users, DollarSign, TrendingUp, Eye, Edit, UserPlus } from "lucide-react"

import React, { useEffect, useState } from "react"

type Church = {
  id: string
  name: string
  city?: string
  country?: string
  members?: number
  income?: number
  expenses?: number
  attendance?: number
  status?: string
}

type User = {
  id: string
  name: string
  email: string
  church: string
  role: string
}

export function ChurchesManagement() {
  const [churches, setChurches] = useState<Church[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Fetch all churches
  async function loadChurches() {
    setLoading(true)
    setError("")
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:5000/api/churches", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      if (!res.ok) throw new Error("Failed to fetch churches")
      const data = await res.json()
      setChurches(data.data || [])
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError("Failed to load churches")
      }
    } finally {
      setLoading(false)
    }
  }

  // Fetch all users for selected church (for now, fetch for first church)
  async function loadUsers(churchId: string) {
    setLoading(true)
    setError("")
    try {
      if (!churchId) return setUsers([])
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:5000/api/churches/${churchId}/users`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      if (!res.ok) throw new Error("Failed to fetch users")
      const data = await res.json()
      setUsers(data.data || [])
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError("Failed to load users")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadChurches()
  }, [])

  useEffect(() => {
    if (churches.length > 0) {
      if (churches[0]?.id) {
        loadUsers(churches[0].id)
      }
    }
  }, [churches])

  // TODO: Implement add, update, delete, assign user handlers

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Churches Management</h2>
          <p className="text-muted-foreground">Manage all churches and assign users</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Church
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Church</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="churchName">Church Name</Label>
                  <Input id="churchName" placeholder="Enter church name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="City" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" placeholder="Country" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" placeholder="Full address" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="+971-XX-XXX-XXXX" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="church@example.com" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Create Church</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Consolidated Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Churches", value: churches.length, icon: Building2, color: "bg-primary" },
          {
            label: "Total Members",
            value: churches.reduce((sum, c) => sum + (c.members ?? 0), 0).toLocaleString(),
            icon: Users,
            color: "bg-green-500",
          },
          {
            label: "Total Income",
            value: `$${churches.reduce((sum, c) => sum + (c.income ?? 0), 0).toLocaleString()}`,
            icon: DollarSign,
            color: "bg-blue-500",
          },
          {
            label: "Total Attendance",
            value: churches.reduce((sum, c) => sum + (c.attendance ?? 0), 0).toLocaleString(),
            icon: TrendingUp,
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

      {/* Churches Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Churches</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Church Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Income</TableHead>
                <TableHead>Expenses</TableHead>
                <TableHead>Net</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {churches.map((church) => (
                <TableRow key={church.id}>
                  <TableCell className="font-medium">{church.name}</TableCell>
                  <TableCell>
                    {church.city}, {church.country}
                  </TableCell>
                  <TableCell>{church.members}</TableCell>
                  <TableCell>{church.attendance}</TableCell>
                  <TableCell className="text-green-600">${(church.income ?? 0).toLocaleString()}</TableCell>
                  <TableCell className="text-red-600">${(church.expenses ?? 0).toLocaleString()}</TableCell>
                  <TableCell className="font-bold">${((church.income ?? 0) - (church.expenses ?? 0)).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="default">{church.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Assignments</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <UserPlus className="w-4 h-4" />
                Assign User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign User to Church</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>User Email</Label>
                  <Input placeholder="user@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Church</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select church" />
                    </SelectTrigger>
                    <SelectContent>
                      {churches.map((church) => (
                        <SelectItem key={church.id} value={church.id}>
                          {church.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="super_admin">Super Admin (Chief Pastor)</SelectItem>
                      <SelectItem value="church_pastor">Church Pastor</SelectItem>
                      <SelectItem value="church_leader">Church Leader</SelectItem>
                      <SelectItem value="church_believer">Church Believer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Assign User</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Church</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.church}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role.replace("_", " ")}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
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
