import { DashboardShell } from "@/components/dashboard";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
