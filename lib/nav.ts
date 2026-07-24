import {
  LayoutDashboard,
  ClipboardList,
  Compass,
  Sparkles,
  MessageSquare,
  LineChart,
  BookOpen,
  FileText,
  Shield,
  UserCircle,
  type LucideIcon,
} from "lucide-react"

export type NavItem = {
  href: string
  label: string
  icon: LucideIcon
  adminOnly?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/assessment", label: "Assessment", icon: ClipboardList },
  { href: "/dashboard/recommendations", label: "Recommendations", icon: Sparkles },
  { href: "/dashboard/careers", label: "Careers", icon: Compass },
  { href: "/dashboard/advisor", label: "AI Advisor", icon: MessageSquare },
  { href: "/dashboard/insights", label: "Labour Market", icon: LineChart },
  { href: "/dashboard/learning", label: "Learning", icon: BookOpen },
  { href: "/dashboard/resume", label: "Resume", icon: FileText },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
  { href: "/dashboard/admin", label: "Admin", icon: Shield, adminOnly: true },
]

export const ROLE_LABELS: Record<string, string> = {
  student: "Student",
  graduate: "Graduate",
  job_seeker: "Job Seeker",
  counsellor: "Counsellor",
  admin: "Administrator",
  user: "Member",
}
