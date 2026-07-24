import { redirect } from "next/navigation"
import { Shield, Users, Brain, Sparkles, Bookmark, FileText, AlertTriangle } from "lucide-react"
import { requireUser } from "@/lib/session"
import { db } from "@/lib/db"
import { user, assessment, recommendation, savedCareer, resume } from "@/lib/db/schema"
import { count } from "drizzle-orm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function AdminPage() {
  const sessionUser = await requireUser()

  if (sessionUser.role !== "admin") {
    return (
      <div className="container max-w-2xl space-y-8 p-4 py-16 md:p-8">
        <Card className="text-center p-8 border-destructive/20 bg-destructive/5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <CardTitle className="font-serif text-2xl text-destructive">Access Restricted</CardTitle>
          <CardDescription className="mt-2">
            You do not have administrative privileges to view this portal. If you believe this is an error, please contact the platform administrator.
          </CardDescription>
        </Card>
      </div>
    )
  }

  // Fetch admin stats from database
  const [
    [{ totalUsers }],
    [{ totalAssessments }],
    [{ totalRecommendations }],
    [{ totalSaved }],
    [{ totalResumes }],
  ] = await Promise.all([
    db.select({ totalUsers: count() }).from(user),
    db.select({ totalAssessments: count() }).from(assessment),
    db.select({ totalRecommendations: count() }).from(recommendation),
    db.select({ totalSaved: count() }).from(savedCareer),
    db.select({ totalResumes: count() }).from(resume),
  ])

  return (
    <div className="container max-w-6xl space-y-8 p-4 py-8 md:p-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1 rounded-full px-3 py-1">
            <Shield className="h-3.5 w-3.5 text-primary" />
            Platform Administration
          </Badge>
        </div>
        <h1 className="font-serif text-3xl font-bold tracking-tight mt-2">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          System analytics, user activity counts, and platform telemetry for CareerAI Sierra Leone.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Registered Users</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="font-serif text-3xl font-bold text-primary">{totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">Active user accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Assessments Completed</CardTitle>
            <Brain className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="font-serif text-3xl font-bold text-primary">{totalAssessments}</div>
            <p className="text-xs text-muted-foreground mt-1">RIASEC surveys taken</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">AI Recommendations Generated</CardTitle>
            <Sparkles className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="font-serif text-3xl font-bold text-primary">{totalRecommendations}</div>
            <p className="text-xs text-muted-foreground mt-1">Personalized career outputs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Careers Bookmarked</CardTitle>
            <Bookmark className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="font-serif text-3xl font-bold text-primary">{totalSaved}</div>
            <p className="text-xs text-muted-foreground mt-1">Total saved careers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Resumes Analyzed</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="font-serif text-3xl font-bold text-primary">{totalResumes}</div>
            <p className="text-xs text-muted-foreground mt-1">CV uploads and analyses</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
