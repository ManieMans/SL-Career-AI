import { requireUser } from "@/lib/session"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()
  return <DashboardShell user={user}>{children}</DashboardShell>
}
