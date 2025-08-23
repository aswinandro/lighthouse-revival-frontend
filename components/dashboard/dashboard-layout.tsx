"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LanguageSelector } from "@/components/ui/language-selector"
import { useLanguage } from "@/components/providers/language-provider"
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
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  activeTab: string
  onTabChange: (tab: string) => void
}

export function DashboardLayout({ children, activeTab, onTabChange }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isRTL } = useLanguage()

  const navigationItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "members", label: "Members", icon: Users },
    { id: "newcomers", label: "Newcomers", icon: UserPlus },
    { id: "attendance", label: "Attendance", icon: BarChart3 },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "events", label: "Events", icon: Calendar },
    { id: "prayers", label: "Prayer Requests", icon: MessageSquare },
    { id: "ministries", label: "Ministries", icon: Church },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden bg-card border-b border-border p-4 flex items-center justify-between">
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

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
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
            <nav className="flex-1 p-4 space-y-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon
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
                      onTabChange(item.id)
                      setSidebarOpen(false)
                    }}
                  >
                    <IconComponent className="w-5 h-5" />
                    {item.label}
                  </Button>
                )
              })}
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Admin User</p>
                  <p className="text-sm text-muted-foreground">admin@church.com</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-destructive">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          {/* Desktop Header */}
          <div className="hidden lg:flex bg-card border-b border-border p-4 items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold capitalize">{activeTab}</h2>
              <p className="text-muted-foreground">Manage your church {activeTab}</p>
            </div>
            <LanguageSelector />
          </div>

          {/* Content */}
          <div className="p-6">{children}</div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
