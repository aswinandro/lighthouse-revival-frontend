import type { ReactNode } from "react";
import { ChurchProvider } from "@/components/providers/church-context";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <ChurchProvider>{children}</ChurchProvider>;
}
