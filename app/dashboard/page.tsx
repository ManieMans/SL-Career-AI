import Link from "next/link"
import {
  Brain,
  Sparkles,
  Compass,
  MessageSquare,
  LineChart,
  BookOpen,
  FileText,
  ArrowRight,
  Bookmark,
  CheckCircle2,
} from "lucide-react"
import { requireUser } from "@/lib/session"
import {
  getLatestAssessment,
  getLatestRecommendation,
  getSavedCareers,
  getLearningProgress,
} from "@/app/actions/assessment"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ROLE_LABELS } from "@/lib/nav"

export default async function DashboardPage() {
  const user = await requireUser()
  const [assessment, recommendation, saved, learning] = await Promise.all([
    getLatestAssessment(),
    getLatestRecommendation(),
    getSavedCareers(),
    getLearningProgress(),
  ])

  const roleLabel = ROLE_LABELS[user.role ?? "user"] ?? "Member"
  const topMatch = recommendation?.careers?.[0]

  return (
    <div className="container max-w-6xl space-y-8 p-4 py-8 md:p-8">
      {/* Header section */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-bold tracking-tight">Welcome back, {user.name}</h1>
            <Badge variant="secondary" className="rounded-full">
              {roleLabel}
            </Badge>
          </div>
          <p className="mt-1 text-muted-foreground">
            Explore personalized career pathways and local labour market intelligence in Sierra Leone.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline">
            <Link href="/dashboard/advisor">
              <MessageSquare className="mr-2 h-4 w-4 text-primary" />
              Ask AI Advisor
            </Link>
          </Button>
          {!assessment && (
            <Button asChild>
              <Link href="/dashboard/assessment">
                <Brain className="mr-2 h-4 w-4" />
                Take Assessment
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Assessment Card */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">RIASEC Profile</CardTitle>
            <Brain className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {assessment ? (
              <div>
                <div className="font-serif text-2xl font-bold text-primary">{assessment.personalityType}</div>
                <p className="text-xs text-muted-foreground mt-1">Assessment completed</p>
              </div>
            ) : (
              <div>
                <div className="text-sm font-semibold text-amber-600 dark:text-amber-400">Not taken yet</div>
                <p className="text-xs text-muted-foreground mt-1">Take 3 mins to unlock matches</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Recommendation */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Top Match</CardTitle>
            <Sparkles className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {topMatch ? (
              <div>
                <div className="truncate text-lg font-bold">{topMatch.title}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs font-semibold border-primary/30 text-primary">
                    {topMatch.matchScore}% Match
                  </Badge>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-sm text-muted-foreground">No matches yet</div>
                <p className="text-xs text-muted-foreground mt-1">Complete assessment first</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Saved Careers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Saved Careers</CardTitle>
            <Bookmark className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="font-serif text-2xl font-bold">{saved.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Bookmarked opportunities</p>
          </CardContent>
        </Card>

        {/* Tracked Learning */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="font-serif text-2xl font-bold">{learning.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Learning resources tracked</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Feature Action Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col justify-between transition-shadow hover:shadow-md">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
              <Brain className="h-5 w-5" />
            </div>
            <CardTitle>Career Assessment</CardTitle>
            <CardDescription>
              Discover your Holland Code interest traits and get matched to high-growth roles in Sierra Leone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/assessment">
                {assessment ? "Retake Assessment" : "Start Assessment"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between transition-shadow hover:shadow-md">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
              <Compass className="h-5 w-5" />
            </div>
            <CardTitle>Explore Careers</CardTitle>
            <CardDescription>
              Browse 16+ career profiles with realistic local salary ranges, required skills, and local context.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/careers">
                Browse Directory
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between transition-shadow hover:shadow-md">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
              <LineChart className="h-5 w-5" />
            </div>
            <CardTitle>Labour Intelligence</CardTitle>
            <CardDescription>
              Analyze sector growth rates, in-demand skills, and regional opportunity indices across Sierra Leone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/insights">
                View Insights
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations & Saved Careers Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recommended Careers List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Recommendations</CardTitle>
              <CardDescription>Matched to your personality and local demand</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/recommendations">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendation?.careers && recommendation.careers.length > 0 ? (
              recommendation.careers.slice(0, 3).map((item) => (
                <div key={item.careerId} className="flex items-start justify-between rounded-lg border p-3">
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{item.reason}</p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {item.matchScore}%
                  </Badge>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Take the assessment to unlock your personalized recommendations!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Tools & Saved Careers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Saved Careers</CardTitle>
              <CardDescription>Your bookmarked career pathways</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/careers">Explore</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {saved.length > 0 ? (
              saved.slice(0, 3).map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-primary fill-primary" />
                    <span className="font-semibold text-sm">{c.careerTitle}</span>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/careers`}>View</Link>
                  </Button>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No saved careers yet. Explore the career catalog to bookmark roles you like!
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
