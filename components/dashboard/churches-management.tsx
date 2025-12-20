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
import { Building2, Plus, Users, DollarSign, TrendingUp, Eye, Edit, UserPlus, XCircle } from "lucide-react"

import React, { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { getToken } from "@/lib/utils"

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
  const [allSystemUsers, setAllSystemUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Form states
  const [churchForm, setChurchForm] = useState({
    name: "",
    city: "",
    country: "",
    address: "",
    phone: "",
    email: ""
  })

  const [assignmentForm, setAssignmentForm] = useState({
    userId: "",
    churchId: "", // Track which church we're assigning to
    role: "church_pastor"
  })

  // Dialog states
  const [isAddChurchOpen, setIsAddChurchOpen] = useState(false)
  const [isAssignUserOpen, setIsAssignUserOpen] = useState(false)
  const [selectedChurchForUsers, setSelectedChurchForUsers] = useState<string>("")

  // Fetch all churches
  async function loadChurches() {
    setLoading(true)
    setError("")
    try {
      const token = getToken()
      if (!token) throw new Error("No token found")

      const data: any = await apiClient.getChurches(token)
      setChurches(data.data || [])
    } catch (e) {
      console.error(e)
      setError("Failed to load churches")
    } finally {
      setLoading(false)
    }
  }

  // Fetch all users for selected church (for now, fetch for first church)
  async function loadUsers(churchId: string) {
    try {
      if (!churchId) return setUsers([])
      const token = getToken()
      if (!token) throw new Error("No token found")

      const data: any = await apiClient.getChurchUsers(churchId, token)
      setUsers(data.data || [])
    } catch (e) {
      console.error(e)
      // Don't set error here as it might be common if no users yet
    }
  }

  // Fetch all system users for assignment dropdown
  async function loadAllSystemUsers() {
    try {
      const token = getToken()
      if (!token) return
      const data: any = await apiClient.getUsers(token)
      setAllSystemUsers(data.data || [])
    } catch (e) {
      console.error(e)
    }
  }

  const formatRole = (role: string) => {
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  useEffect(() => {
    loadChurches()
    loadAllSystemUsers()
  }, [])

  useEffect(() => {
    if (churches.length > 0 && !selectedChurchForUsers) {
      setSelectedChurchForUsers(churches[0].id)
    }
  }, [churches])

  useEffect(() => {
    if (selectedChurchForUsers) {
      loadUsers(selectedChurchForUsers)
    }
  }, [selectedChurchForUsers])

  const handleAddChurch = async () => {
    try {
      const token = getToken()
      if (!token) return
      await apiClient.createChurch(churchForm, token)
      setIsAddChurchOpen(false)
      setChurchForm({
        name: "",
        city: "",
        country: "",
        address: "",
        phone: "",
        email: ""
      })
      loadChurches()
    } catch (e) {
      console.error(e)
      setError("Failed to create church")
    }
  }

  const handleAssignUser = async () => {
    try {
      const token = getToken()
      if (!token) return
      if (!assignmentForm.userId || !assignmentForm.churchId) {
        setError("Please select both a user and a church")
        return
      }
      await apiClient.assignUserToChurch(assignmentForm.churchId, {
        userId: assignmentForm.userId,
        role: assignmentForm.role
      }, token)
      setIsAssignUserOpen(false)
      loadUsers(assignmentForm.churchId)
    } catch (e) {
      console.error(e)
      setError("Failed to assign user")
    }
  }

  const handleDeleteChurch = async (id: string) => {
    if (!confirm("Are you sure you want to delete this church? This will remove all associated data.")) return
    try {
      const token = getToken()
      if (!token) return
      await apiClient.deleteChurch(id, token)
      loadChurches()
    } catch (e) {
      console.error(e)
      setError("Failed to delete church")
    }
  }

  const handleUnassignUser = async (userId: string, churchName: string) => {
    if (!confirm(`Are you sure you want to remove this user from ${churchName}?`)) return
    try {
      const token = getToken()
      if (!token) return
      const church = churches.find(c => c.name === churchName)
      if (!church) return

      await apiClient.unassignUserFromChurch(church.id, userId, token)
      loadUsers(church.id)
    } catch (e) {
      console.error(e)
      setError("Failed to unassign user")
    }
  }

  // Edit Church states
  const [editingChurch, setEditingChurch] = useState<Church | null>(null)
  const [isEditChurchOpen, setIsEditChurchOpen] = useState(false)

  const handleEditChurch = async () => {
    if (!editingChurch) return
    try {
      const token = getToken()
      if (!token) return
      // Map frontend fields back to backend if necessary
      const updateData = {
        name: editingChurch.name,
        city: editingChurch.city,
        country: editingChurch.country,
        address: (editingChurch as any).address,
        phone: (editingChurch as any).phone,
        email: (editingChurch as any).email
      }
      await apiClient.updateChurch(editingChurch.id, updateData, token)
      setIsEditChurchOpen(false)
      loadChurches()
    } catch (e) {
      console.error(e)
      setError("Failed to update church")
    }
  }

  // View Church states
  const [viewingChurch, setViewingChurch] = useState<any>(null)
  const [isViewChurchOpen, setIsViewChurchOpen] = useState(false)

  // Edit Assignment states
  const [editingAssignment, setEditingAssignment] = useState<User | null>(null)
  const [isEditAssignmentOpen, setIsEditAssignmentOpen] = useState(false)
  const [editRoleForm, setEditRoleForm] = useState("church_pastor")

  const handleUpdateAssignment = async () => {
    if (!editingAssignment || !selectedChurchForUsers) return
    try {
      const token = getToken()
      if (!token) return
      await apiClient.assignUserToChurch(selectedChurchForUsers, {
        userId: editingAssignment.id,
        role: editRoleForm
      }, token)
      setIsEditAssignmentOpen(false)
      loadUsers(selectedChurchForUsers)
    } catch (e) {
      console.error(e)
      setError("Failed to update assignment")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Churches Management</h2>
          <p className="text-muted-foreground">Manage all churches and assign users</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddChurchOpen} onOpenChange={setIsAddChurchOpen}>
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
                  <Input
                    id="churchName"
                    placeholder="Enter church name"
                    value={churchForm.name}
                    onChange={(e) => setChurchForm({ ...churchForm, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      value={churchForm.city}
                      onChange={(e) => setChurchForm({ ...churchForm, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="Country"
                      value={churchForm.country}
                      onChange={(e) => setChurchForm({ ...churchForm, country: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Full address"
                    value={churchForm.address}
                    onChange={(e) => setChurchForm({ ...churchForm, address: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="+971-XX-XXX-XXXX"
                      value={churchForm.phone}
                      onChange={(e) => setChurchForm({ ...churchForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="church@example.com"
                      value={churchForm.email}
                      onChange={(e) => setChurchForm({ ...churchForm, email: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddChurchOpen(false)}>Cancel</Button>
                <Button onClick={handleAddChurch}>Create Church</Button>
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
                      <Button variant="ghost" size="sm" onClick={() => {
                        setViewingChurch(church)
                        setIsViewChurchOpen(true)
                      }}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setEditingChurch(church)
                        setIsEditChurchOpen(true)
                      }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDeleteChurch(church.id)}>
                        <XCircle className="w-4 h-4" />
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
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <CardTitle>User Assignments</CardTitle>
            <Select value={selectedChurchForUsers} onValueChange={setSelectedChurchForUsers}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by church" />
              </SelectTrigger>
              <SelectContent>
                {churches.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isAssignUserOpen} onOpenChange={setIsAssignUserOpen}>
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
                  <Label>User</Label>
                  <Select onValueChange={(val) => setAssignmentForm({ ...assignmentForm, userId: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      {allSystemUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.first_name} {user.last_name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Church</Label>
                  <Select onValueChange={(val) => setAssignmentForm({ ...assignmentForm, churchId: val })}>
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
                  <Select onValueChange={(val) => setAssignmentForm({ ...assignmentForm, role: val })} value={assignmentForm.role}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="church_pastor">Church Pastor</SelectItem>
                      <SelectItem value="church_leader">Church Leader</SelectItem>
                      <SelectItem value="church_believer">Church Believer</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAssignUserOpen(false)}>Cancel</Button>
                <Button onClick={handleAssignUser}>Assign User</Button>
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
                    <Badge variant="outline" className="capitalize bg-primary/10 text-primary border-primary/20">
                      {formatRole(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => {
                        setEditingAssignment(user)
                        setEditRoleForm(user.role)
                        setIsEditAssignmentOpen(true)
                      }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleUnassignUser(user.id, user.church)}>
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Edit Church Dialog */}
      <Dialog open={isEditChurchOpen} onOpenChange={setIsEditChurchOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Church</DialogTitle>
          </DialogHeader>
          {editingChurch && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editChurchName">Church Name</Label>
                <Input
                  id="editChurchName"
                  value={editingChurch.name}
                  onChange={(e) => setEditingChurch({ ...editingChurch, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editCity">City</Label>
                  <Input
                    id="editCity"
                    value={editingChurch.city || ""}
                    onChange={(e) => setEditingChurch({ ...editingChurch, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editCountry">Country</Label>
                  <Input
                    id="editCountry"
                    value={editingChurch.country || ""}
                    onChange={(e) => setEditingChurch({ ...editingChurch, country: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editAddress">Address</Label>
                <Textarea
                  id="editAddress"
                  value={(editingChurch as any).address || ""}
                  onChange={(e) => setEditingChurch({ ...editingChurch, address: e.target.value } as any)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editPhone">Phone</Label>
                  <Input
                    id="editPhone"
                    value={(editingChurch as any).phone || ""}
                    onChange={(e) => setEditingChurch({ ...editingChurch, phone: e.target.value } as any)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editEmail">Email</Label>
                  <Input
                    id="editEmail"
                    value={(editingChurch as any).email || ""}
                    onChange={(e) => setEditingChurch({ ...editingChurch, email: e.target.value } as any)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 text-primary-foreground">
                <Button variant="outline" className="text-foreground" onClick={() => setIsEditChurchOpen(false)}>Cancel</Button>
                <Button onClick={handleEditChurch}>Update Church</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Edit Assignment Dialog */}
      <Dialog open={isEditAssignmentOpen} onOpenChange={setIsEditAssignmentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">User</p>
              <p className="text-sm text-muted-foreground">{editingAssignment?.name} ({editingAssignment?.email})</p>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={editRoleForm} onValueChange={setEditRoleForm}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="church_pastor">Church Pastor</SelectItem>
                  <SelectItem value="church_leader">Church Leader</SelectItem>
                  <SelectItem value="church_believer">Church Believer</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditAssignmentOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateAssignment}>Update Role</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Church Details Dialog */}
      <Dialog open={isViewChurchOpen} onOpenChange={setIsViewChurchOpen}>
        <DialogContent className="max-w-2xl bg-slate-900 border-slate-800 text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Church Details</DialogTitle>
          </DialogHeader>
          {viewingChurch && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <Label className="text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">Church Name</Label>
                  <p className="text-lg font-bold text-white">{viewingChurch.name}</p>
                </div>
                <div className="space-y-1 text-right sm:text-left">
                  <Label className="text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">Status</Label>
                  <div>
                    <Badge className={viewingChurch.status === 'Active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-slate-700 text-slate-400 border-slate-600'}>
                      {viewingChurch.status}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">Location</Label>
                  <p className="text-slate-300">{viewingChurch.city}, {viewingChurch.country}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">Email</Label>
                  <p className="text-slate-300">{viewingChurch.email || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">Phone</Label>
                  <p className="text-slate-300">{viewingChurch.phone || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">Members</Label>
                  <p className="text-slate-300">{viewingChurch.members || 0}</p>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-800">
                <Label className="text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">Address</Label>
                <p className="text-sm text-slate-400 leading-relaxed">{viewingChurch.address || 'No address provided'}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                  <p className="text-[10px] text-green-400/70 font-bold uppercase tracking-tight">Total Income</p>
                  <p className="text-lg font-black text-green-400">${(viewingChurch.income || 0).toLocaleString()}</p>
                </div>
                <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                  <p className="text-[10px] text-red-400/70 font-bold uppercase tracking-tight">Total Expenses</p>
                  <p className="text-lg font-black text-red-400">${(viewingChurch.expenses || 0).toLocaleString()}</p>
                </div>
                <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                  <p className="text-[10px] text-indigo-400/70 font-bold uppercase tracking-tight">Net Profit</p>
                  <p className="text-lg font-black text-indigo-400">
                    ${((viewingChurch.income || 0) - (viewingChurch.expenses || 0)).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end pt-2">
            <Button variant="outline" className="border-slate-700 hover:bg-slate-800" onClick={() => setIsViewChurchOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
