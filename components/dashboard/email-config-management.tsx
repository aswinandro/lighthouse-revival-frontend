"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Mail, Plus, Edit, Trash2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { getToken } from "@/lib/utils"
import { useEffect, useState } from "react"
import { useChurch } from "@/components/providers/church-context"

export function EmailConfigManagement() {
  const [emailConfigs, setEmailConfigs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const { churches } = useChurch()
  const [formData, setFormData] = useState({
    churchId: "",
    leaderName: "",
    leaderEmail: "",
    role: "",
    priority: 1
  })

  const fetchConfigs = async () => {
    setLoading(true)
    try {
      const token = getToken()
      if (!token) return
      const data: any = await apiClient.getPrayerEmailConfigs(token)
      setEmailConfigs(data.data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConfigs()
  }, [])

  const handleCreateConfig = async () => {
    try {
      const token = getToken()
      if (!token) return
      await apiClient.createPrayerEmailConfig(formData, token)
      setCreateDialogOpen(false)
      fetchConfigs()
    } catch (e) {
      console.error(e)
    }
  }

  const handleDeleteConfig = async (id: string) => {
    if (!confirm("Are you sure you want to delete this configuration?")) return
    try {
      const token = getToken()
      if (!token) return
      await apiClient.deletePrayerEmailConfig(id, token)
      fetchConfigs()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Prayer Request Email Configuration</h2>
          <p className="text-muted-foreground">Configure email routing for prayer requests by church</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => setCreateDialogOpen(true)}>
              <Plus className="w-4 h-4" />
              Add Email Config
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Email Configuration</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Church</Label>
                <Select onValueChange={v => setFormData({ ...formData, churchId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select church" />
                  </SelectTrigger>
                  <SelectContent>
                    {churches.map(church => (
                      <SelectItem key={church.id} value={church.id}>{church.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Leader Name</Label>
                <Input placeholder="Enter leader name" value={formData.leaderName} onChange={e => setFormData({ ...formData, leaderName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Leader Email</Label>
                <Input type="email" placeholder="leader@church.ae" value={formData.leaderEmail} onChange={e => setFormData({ ...formData, leaderEmail: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Role/Position</Label>
                <Input placeholder="e.g., Prayer Coordinator" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Priority Order</Label>
                <Input type="number" placeholder="1" min="1" value={formData.priority} onChange={e => setFormData({ ...formData, priority: parseInt(e.target.value) })} />
                <p className="text-xs text-muted-foreground">
                  Lower numbers receive emails first (1 = highest priority)
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateConfig}>Add Configuration</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info Card */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold">How Email Routing Works</h4>
              <p className="text-sm text-muted-foreground mt-1">
                When a prayer request is submitted for a specific church, it will be automatically sent to the
                configured email addresses in priority order. You can assign multiple leaders per church to ensure
                prayer requests are handled promptly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Configurations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Email Configurations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Church</TableHead>
                <TableHead>Leader Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emailConfigs.map((config) => (
                <TableRow key={config.id}>
                  <TableCell className="font-medium">{config.church?.name || config.church_name || "Unknown"}</TableCell>
                  <TableCell>{config.leader_name || config.leaderName}</TableCell>
                  <TableCell>{config.leader_email || config.leaderEmail}</TableCell>
                  <TableCell>{config.role}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{config.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={config.isActive ? "default" : "secondary"}>
                      {config.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteConfig(config.id)}>
                        <Trash2 className="w-4 h-4" />
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
