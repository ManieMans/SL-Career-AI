import Link from "next/link"
import { Sparkles, Brain, ArrowRight, Bookmark, Compass, CheckCircle2 } from "lucide-react"
import { requireUser } from "@/lib/session"
import { getLatestRecommendation, getLatestAssessment, getSavedCareers } from "@/app/actions/assessment"
import { CAREERS } from "@/lib/data/careers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default async function RecommendationsPage() {
  await requireUser()
  const [recommendation, assessment, saved] = await Promise.all([
    getLatestRecommendation(),
    getLatestAssessment(),
    getSavedCareers(),
  ])

  const savedIds = new Set(saved.map((s) => s.careerId))

  if (!recommendation || !assessment) {
    return (
      <div className="container max-w-4xl space-y-8 p-4 py-12 md:p-8">
        <Card className="text-center p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <Brain className="h-8 w-8" />
          </div>
          <CardTitle className="font-serif text-2xl">No Recommendations Yet</CardTitle>
          <CardDescription className="mt-2 max-w-md mx-auto">
            Take our 3-minute career interest assessment to receive personalized career recommendations matched to Sierra Leone's job market.
          </CardDescription>
          <div className="mt-6">
            <Button asChild size="lg">
              <Link href="/dashboard/assessment">
                Take Assessment Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-5xl space-y-8 p-4 py-8 md:p-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1 rounded-full px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Personalized AI Matches
          </Badge>
        </div>
        <h1 className="font-serif text-3xl font-bold tracking-tight mt-2">Your Career Recommendations</h1>
        <p className="mt-1 text-muted-foreground">
          Based on your RIASEC profile (<strong className="text-primary">{assessment.personalityType}</strong>) and current growth sectors across Sierra Leone.
        </p>
      </div>

      {/* Summary Card */}
      <Card className="bg-primary/5 border-primary/20 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Brain className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">Interest Summary</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{recommendation.summary}</p>
          </div>
        </div>
      </Card>

      {/* Career Recommendations Grid */}
      <div className="space-y-4">
        <h2 className="font-serif text-xl font-semibold">Matched Roles ({recommendation.careers.length})</h2>

        <div className="grid gap-6 md:grid-cols-2">
          {recommendation.careers.map((item) => {
            const careerDetail = CAREERS.find((c) => c.id === item.careerId)
            const isSaved = savedIds.has(item.careerId)

            return (
              <Card key={item.careerId} className="flex flex-col justify-between p-6 transition-shadow hover:shadow-md">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        {careerDetail?.category || "Career"}
                      </Badge>
                      <h3 className="font-bold text-xl">{item.title}</h3>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-2xl font-extrabold text-primary">{item.matchScore}%</span>
                      <span className="block text-xs text-muted-foreground">Match</span>
                    </div>
                  </div>

                  <Progress value={item.matchScore} className="mt-2 h-2" />

                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.reason}</p>

                  {careerDetail && (
                    <div className="mt-4 pt-4 border-t space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Local Demand:</span>
                        <span className="font-medium">{careerDetail.demand}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Monthly Pay (SLE):</span>
                        <span className="font-medium text-foreground">{careerDetail.salaryRange}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between pt-4 border-t">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/careers`}>
                      <Compass className="mr-2 h-4 w-4" />
                      View Details
                    </Link>
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
