"use client"

import React, { useState } from "react"
import { useChurch } from "@/components/providers/church-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Edit, Trash2, Mail, Phone, MapPin } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { getToken } from "@/lib/utils"
import { PhoneInput } from "@/components/ui/phone-input"
import { Loader } from "@/components/ui/loader"
import { useToast } from "@/hooks/use-toast"

// Define Member type
// Define Member type
export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  emirate?: string;
  country?: string;
  preferred_service?: string;
  church_id: string;
  joined_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export default function MembersManagement() {
  const { selectedChurch, isLoading: isChurchLoading } = useChurch();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (isChurchLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader size={80} />
        <p className="text-sm text-muted-foreground animate-pulse">Gathering the community...</p>
      </div>
    )
  }
  const [error, setError] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "Male",
    membership_status: "Active",
    preferred_language: "English",
    city: "",
    country: "",
    notes: ""
  });

  // Fetch members from backend REST API
  async function loadMembers() {
    setLoading(true);
    setError("");
    try {
      const churchId = selectedChurch?.id === 'all' ? undefined : selectedChurch?.id;
      const token = getToken();
      if (!token) throw new Error("No token found");

      const data: any = await apiClient.getMembers(token, { churchId });
      let membersRaw: any[] = Array.isArray(data) ? data : (data.members ?? data.data ?? []);
      // Local filtering for other criteria can remain here if needed, 
      // but server-side church filtering is now handled.
      // Map backend fields to frontend Member type
      let membersArray: Member[] = membersRaw.map((m) => ({
        id: String(m.id),
        name: m.first_name && m.last_name ? `${m.first_name} ${m.last_name}` : m.first_name || m.last_name || m.name || "",
        email: m.email || "",
        phone: m.phone || "",
        role: m.membership_status || "",
        status: m.membership_status || "",
        emirate: m.city || "",
        country: m.country || "",
        preferred_service: m.preferred_language || "",
        church_id: String(m.church_id || ""),
        joined_at: m.membership_date ? (typeof m.membership_date === "string" ? m.membership_date.split("T")[0] : m.membership_date) : "",
        notes: m.notes || "",
        created_at: m.created_at || "",
        updated_at: m.updated_at || "",
      }));
      setMembers(membersArray);
    } catch (e) {
      const errorMsg = typeof e === "object" && e && "message" in e ? (e as any).message : String(e);
      setError(errorMsg || "Failed to load members");
      toast({
        title: "Error",
        description: errorMsg || "Failed to load members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  // Initial load
  React.useEffect(() => {
    loadMembers();
  }, [selectedChurch]);

  if (loading && members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader size={80} />
        <p className="text-sm text-muted-foreground animate-pulse">Gathering the community...</p>
      </div>
    )
  }

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      gender: "Male",
      membership_status: "Active",
      preferred_language: "English",
      city: "",
      country: "",
      notes: ""
    });
  };

  // Add, update, delete handlers
  async function handleAddMember() {
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      if (!token) throw new Error("No token found");

      const payload = {
        ...formData,
        church_id: selectedChurch?.id === 'all' ? undefined : selectedChurch?.id
      };

      await apiClient.createMember(payload, token);
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Member added successfully",
      });
      await loadMembers();
    } catch (e) {
      const errorMsg = typeof e === "object" && e && "message" in e ? (e as any).message : String(e);
      setError(errorMsg || "Failed to add member");
      toast({
        title: "Error",
        description: errorMsg || "Failed to add member",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteMember(id: Member["id"]) {
    if (!confirm("Are you sure you want to delete this member?")) return;
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      if (!token) throw new Error("No token found");
      await apiClient.deleteMember(id, token);
      toast({
        title: "Deleted",
        description: "Member removed from records",
      });
      await loadMembers();
    } catch (e) {
      const errorMsg = typeof e === "object" && e && "message" in e ? (e as any).message : String(e);
      setError(errorMsg || "Failed to delete member");
      toast({
        title: "Error",
        description: errorMsg || "Failed to delete member",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateMember() {
    if (!editingMember) return;
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      if (!token) throw new Error("No token found");
      await apiClient.updateMember(editingMember.id, formData, token);
      setIsEditDialogOpen(false);
      setEditingMember(null);
      resetForm();
      toast({
        title: "Success",
        description: "Member details updated",
      });
      await loadMembers();
    } catch (e) {
      const errorMsg = typeof e === "object" && e && "message" in e ? (e as any).message : String(e);
      setError(errorMsg || "Failed to update member");
      toast({
        title: "Error",
        description: errorMsg || "Failed to update member",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const openEditDialog = (member: Member) => {
    // We need to fetch original data or find it in members list
    // Backend returns first_name, last_name etc. but frontend Member has name
    // Finding raw member to populate form
    const rawMember = members.find(m => m.id === member.id);
    if (rawMember) {
      const nameParts = rawMember.name.split(' ');
      setFormData({
        first_name: nameParts[0] || "",
        last_name: nameParts.slice(1).join(' ') || "",
        email: rawMember.email || "",
        phone: rawMember.phone || "",
        gender: "Male",
        membership_status: rawMember.status || "Active",
        preferred_language: rawMember.preferred_service || "English",
        city: rawMember.emirate || "",
        country: rawMember.country || "",
        notes: rawMember.notes || ""
      });
      setEditingMember(member);
      setIsEditDialogOpen(true);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Pastor":
        return "bg-primary text-primary-foreground"
      case "Elder":
        return "bg-accent text-accent-foreground"
      case "Lifetime":
        return "bg-secondary text-secondary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || member.role === filterRole;
    const matchesStatus = filterStatus === "all" || member.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Members Management</h2>
          <p className="text-muted-foreground">Manage your church members and their roles</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Member</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <PhoneInput
                  id="phone"
                  value={formData.phone}
                  onChange={(val) => setFormData({ ...formData, phone: val })}
                  placeholder="50 123 4567"
                />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={formData.gender} onValueChange={(val) => setFormData({ ...formData, gender: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={formData.preferred_language} onValueChange={(val) => setFormData({ ...formData, preferred_language: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Tamil">Tamil</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="Malayalam">Malayalam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Role / Status</Label>
                <Select value={formData.membership_status} onValueChange={(val) => setFormData({ ...formData, membership_status: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active Member</SelectItem>
                    <SelectItem value="Elder">Elder</SelectItem>
                    <SelectItem value="Pastor">Pastor</SelectItem>
                    <SelectItem value="Lifetime">Lifetime Member</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Dubai"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional info..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddMember} disabled={loading}>
                {loading ? "Adding..." : "Add Member"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => { setIsEditDialogOpen(open); if (!open) setEditingMember(null); }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Member</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit_first_name">First Name</Label>
                <Input
                  id="edit_first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_last_name">Last Name</Label>
                <Input
                  id="edit_last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_email">Email</Label>
                <Input
                  id="edit_email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_phone">Phone</Label>
                <PhoneInput
                  id="edit_phone"
                  value={formData.phone}
                  onChange={(val) => setFormData({ ...formData, phone: val })}
                />
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={formData.preferred_language} onValueChange={(val) => setFormData({ ...formData, preferred_language: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Tamil">Tamil</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="Malayalam">Malayalam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Role / Status</Label>
                <Select value={formData.membership_status} onValueChange={(val) => setFormData({ ...formData, membership_status: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active Member</SelectItem>
                    <SelectItem value="Elder">Elder</SelectItem>
                    <SelectItem value="Pastor">Pastor</SelectItem>
                    <SelectItem value="Lifetime">Lifetime Member</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_city">City</Label>
                <Input
                  id="edit_city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit_notes">Notes</Label>
                <Textarea
                  id="edit_notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateMember} disabled={loading}>
                {loading ? "Updating..." : "Update Member"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {error && <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">{error}</div>}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Elder">Elder</SelectItem>
                <SelectItem value="Pastor">Pastor</SelectItem>
                <SelectItem value="Lifetime">Lifetime</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Transferred">Transferred</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Members ({filteredMembers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.country}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3" />
                          {member.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="w-3 h-3" />
                          {member.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(member.role)}>{member.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="w-3 h-3" />
                        {member.emirate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{member.preferred_service}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{member.joined_at}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(member)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteMember(member.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
  );
}
