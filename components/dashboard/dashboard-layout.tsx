"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LanguageSelector } from "@/components/ui/language-selector"
import { ChurchSelector } from "@/components/ui/church-selector"
import { useLanguage } from "@/components/providers/language-provider"
import { useChurch } from "@/components/providers/church-context"
import { apiClient } from "@/lib/api-client"
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Calendar,
  BookOpen,
  Church,
  MessageSquare,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  Building2,
  FileText,
  Mail,
} from "lucide-react"
import { cn } from "@/lib/utils"


interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function DashboardLayout({ children, activeTab, onTabChange }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ first_name?: string; last_name?: string; email?: string } | null>(null);
  const { isRTL } = useLanguage();
  const { userRole } = useChurch();
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    } else {
      // Fallback: try to fetch from API if token exists
      const token = localStorage.getItem("token");
      if (token) {
        apiClient.getCurrentUser(token).then((res: any) => {
          const userData = res.data || res;
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }).catch(err => console.error("Failed to fetch user", err));
      }
    }
  }, []);

  const handleSignOut = () => {
    localStorage.clear(); // Clear all including token and user
    sessionStorage.clear();
    window.location.href = "/login"; // Full reload to clear memory state
  };

  const navigationItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, roles: ["super_admin", "church_pastor", "church_leader", "member", "user"] },
    { id: "members", label: "Members", icon: Users, roles: ["super_admin", "church_pastor", "church_leader"] },
    { id: "newcomers", label: "Newcomers", icon: UserPlus, roles: ["super_admin", "church_pastor", "church_leader"] },
    { id: "attendance", label: "Attendance", icon: BarChart3, roles: ["super_admin", "church_pastor", "church_leader", "member", "user"] },
    { id: "courses", label: "Courses", icon: BookOpen, roles: ["super_admin", "church_pastor", "church_leader", "member", "user"] },
    { id: "events", label: "Events", icon: Calendar, roles: ["super_admin", "church_pastor", "church_leader", "member", "user"] },
    { id: "prayers", label: "Prayer Requests", icon: MessageSquare, roles: ["super_admin", "church_pastor", "church_leader", "member", "user"] },
    { id: "ministries", label: "Ministries", icon: Church, roles: ["super_admin", "church_pastor", "church_leader"] },
    { id: "churches", label: "Churches", icon: Building2, roles: ["super_admin"] },
    { id: "schedules", label: "Preaching Schedules", icon: Calendar, roles: ["super_admin", "church_pastor"] },
    { id: "reports", label: "Weekly Reports", icon: FileText, roles: ["super_admin", "church_pastor"] },
    { id: "email-config", label: "Email Config", icon: Mail, roles: ["super_admin"] },
  ];
  const filteredNavItems = navigationItems.filter((item) => item.roles.includes(userRole));

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden font-sans">
      {/* Mobile Header */}
      <div className="lg:hidden bg-card border-b border-border p-4 flex items-center justify-between flex-shrink-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Church className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">Church Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 h-full",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            isRTL && "right-0 left-auto lg:right-auto lg:left-0",
          )}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Church className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-bold text-lg">Church Admin</h1>
                  <p className="text-sm text-muted-foreground">Management System</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {filteredNavItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 h-11",
                      activeTab === item.id && "bg-primary text-primary-foreground",
                      isRTL && "flex-row-reverse",
                    )}
                    onClick={() => {
                      if (onTabChange) {
                        onTabChange(item.id);
                        setSidebarOpen(false);
                      }
                    }}
                    disabled={false}
                  >
                    <IconComponent className="w-5 h-5" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email : "Loading..."}</p>
                  <p className="text-sm text-muted-foreground">{user?.email || ""}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Desktop Header */}
          {activeTab && (
            <div className="hidden lg:flex bg-card border-b border-border px-8 py-4 items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-2xl font-bold capitalize tracking-tight text-white">{activeTab.replace("-", " ")}</h2>
                <p className="text-sm text-muted-foreground">Manage your church {activeTab.replace("-", " ")}</p>
              </div>
              <div className="flex items-center gap-4">
                <ChurchSelector />
                <LanguageSelector />
              </div>
            </div>
          )}

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 custom-scrollbar scroll-smooth">
            <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
