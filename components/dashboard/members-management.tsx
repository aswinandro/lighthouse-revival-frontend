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
  const { selectedChurch } = useChurch();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch members from backend REST API
  async function loadMembers() {
    setLoading(true);
    setError("");
    try {
      const churchId = selectedChurch?.id;
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const url = "http://localhost:5000/api/members";
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch members");
      const data = await response.json();
      let membersRaw: any[] = Array.isArray(data) ? data : (data.members ?? data.data ?? []);
      // If a church is selected, filter by church; otherwise, show all (super admin)
      if (churchId && churchId !== "" && churchId !== "all") {
        membersRaw = membersRaw.filter((m) => String(m.church_id) === String(churchId));
      }
      // Map backend fields to frontend Member type
      let membersArray: Member[] = membersRaw.map((m) => ({
        id: String(m.id),
        name: m.first_name && m.last_name ? `${m.first_name} ${m.last_name}` : m.first_name || m.last_name || m.name || "",
        email: m.email,
        phone: m.phone,
        role: m.membership_status || m.role || "",
        status: m.membership_status || m.status || "",
        emirate: m.city || "",
        country: m.country || "",
        preferred_service: m.preferred_language || m.preferred_service || "",
        church_id: String(m.church_id),
        joined_at: m.membership_date ? (typeof m.membership_date === "string" ? m.membership_date.split("T")[0] : m.membership_date) : "",
        notes: m.notes || "",
        created_at: m.created_at || "",
        updated_at: m.updated_at || "",
      }));
      setMembers(membersArray);
    } catch (e) {
      const errorMsg = typeof e === "object" && e && "message" in e ? (e as any).message : String(e);
      setError(errorMsg || "Failed to load members");
    } finally {
      setLoading(false);
    }
  }

  // Initial load
  React.useEffect(() => {
    loadMembers();
    // reload when selectedChurch changes
  }, [selectedChurch]);

  // Add, update, delete handlers
  async function handleAddMember(memberData: Omit<Member, "id">) {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(memberData),
      });
      if (!response.ok) throw new Error("Failed to add member");
      await loadMembers();
    } catch (e) {
      const errorMsg = typeof e === "object" && e && "message" in e ? (e as any).message : String(e);
      setError(errorMsg || "Failed to add member");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteMember(id: Member["id"]) {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/members/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to delete member");
      await loadMembers();
    } catch (e) {
      const errorMsg = typeof e === "object" && e && "message" in e ? (e as any).message : String(e);
      setError(errorMsg || "Failed to delete member");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateMember(id: Member["id"], memberData: Partial<Member>) {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/members/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(memberData),
      });
      if (!response.ok) throw new Error("Failed to update member");
      await loadMembers();
    } catch (e) {
      const errorMsg = typeof e === "object" && e && "message" in e ? (e as any).message : String(e);
      setError(errorMsg || "Failed to update member");
    } finally {
      setLoading(false);
    }
  }

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

  // Add error/loading UI
  return (
    <div className="space-y-6">
      {error && <div className="text-red-500">{error}</div>}
      {loading && <div className="text-muted-foreground">Loading...</div>}
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
                        <Button variant="ghost" size="sm" onClick={() => handleUpdateMember(member.id, member)}>
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
