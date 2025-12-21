"use client";

import { useState } from "react";
import { DashboardLayout as DashboardShell } from "@/components/dashboard/dashboard-layout";
import { dashboardTabComponents } from "./tab-components";

type TabKey = keyof typeof dashboardTabComponents;

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const TabComponent = dashboardTabComponents[activeTab] || dashboardTabComponents["overview"];

  return (
    <DashboardShell
      activeTab={activeTab}
      onTabChange={(tab: string) => setActiveTab(tab as TabKey)}
    >
      <TabComponent />
    </DashboardShell>
  );
}
