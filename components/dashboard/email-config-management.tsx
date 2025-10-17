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

export function EmailConfigManagement() {
  const emailConfigs = [
    {
      id: "1",
      church: "Abu Dhabi Church",
      leaderName: "Elder Mary",
      leaderEmail: "mary@church.ae",
      role: "Prayer Coordinator",
      priority: 1,
      isActive: true,
    },
    {
      id: "2",
      church: "Abu Dhabi Church",
      leaderName: "Elder John",
      leaderEmail: "john@church.ae",
      role: "Assistant Pastor",
      priority: 2,
      isActive: true,
    },
    {
      id: "3",
      church: "Dubai Church",
      leaderName: "Elder Sarah",
      leaderEmail: "sarah@church.ae",
      role: "Prayer Leader",
      priority: 1,
      isActive: true,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Prayer Request Email Configuration</h2>
          <p className="text-muted-foreground">Configure email routing for prayer requests by church</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
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
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select church" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Abu Dhabi Church</SelectItem>
                    <SelectItem value="2">Dubai Church</SelectItem>
                    <SelectItem value="3">Sharjah Church</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Leader Name</Label>
                <Input placeholder="Enter leader name" />
              </div>
              <div className="space-y-2">
                <Label>Leader Email</Label>
                <Input type="email" placeholder="leader@church.ae" />
              </div>
              <div className="space-y-2">
                <Label>Role/Position</Label>
                <Input placeholder="e.g., Prayer Coordinator" />
              </div>
              <div className="space-y-2">
                <Label>Priority Order</Label>
                <Input type="number" placeholder="1" min="1" />
                <p className="text-xs text-muted-foreground">
                  Lower numbers receive emails first (1 = highest priority)
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Add Configuration</Button>
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
                  <TableCell className="font-medium">{config.church}</TableCell>
                  <TableCell>{config.leaderName}</TableCell>
                  <TableCell>{config.leaderEmail}</TableCell>
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
                      <Button variant="ghost" size="sm" className="text-destructive">
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
