import { LineChart, TrendingUp, MapPin, Target, Sparkles, Building2 } from "lucide-react"
import { requireUser } from "@/lib/session"
import {
  SECTOR_EMPLOYMENT,
  TOP_GROWING_ROLES,
  REGIONAL_OPPORTUNITY,
  SKILLS_IN_DEMAND,
  KEY_STATS,
} from "@/lib/data/labour-market"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default async function InsightsPage() {
  await requireUser()

  return (
    <div className="container max-w-6xl space-y-8 p-4 py-8 md:p-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1 rounded-full px-3 py-1">
            <LineChart className="h-3.5 w-3.5 text-primary" />
            Sierra Leone Labour Intelligence
          </Badge>
        </div>
        <h1 className="font-serif text-3xl font-bold tracking-tight mt-2">Labour Market Insights</h1>
        <p className="mt-1 text-muted-foreground">
          Real-time insights on economic sectors, top growing jobs, and regional opportunity indices across Sierra Leone.
        </p>
      </div>

      {/* Key Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KEY_STATS.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-serif text-3xl font-bold text-primary">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sector Employment & Growing Roles */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Sector Employment Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Employment Share by Sector
            </CardTitle>
            <CardDescription>Estimated percentage share of active workforce</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {SECTOR_EMPLOYMENT.map((s) => (
              <div key={s.sector} className="space-y-1.5">
                <div className="flex justify-between text-sm font-medium">
                  <span>{s.sector}</span>
                  <span className="text-primary font-semibold">{s.share}% share (+{s.growth}% YoY)</span>
                </div>
                <Progress value={s.share} className="h-2.5" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Growing Roles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Fastest Growing Careers
            </CardTitle>
            <CardDescription>Annual job creation and demand increase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {TOP_GROWING_ROLES.map((role) => (
              <div key={role.role} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-semibold text-sm">{role.role}</p>
                  <p className="text-xs text-muted-foreground">{role.category}</p>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20">
                  +{role.growth}% Growth
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Regional Opportunity Index */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Regional Opportunity Index
          </CardTitle>
          <CardDescription>Demand density and key economic sectors by region in Sierra Leone</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {REGIONAL_OPPORTUNITY.map((reg) => (
              <div key={reg.region} className="rounded-xl border p-4 bg-muted/20">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-base">{reg.region}</h4>
                  <Badge variant="secondary" className="font-bold text-primary">
                    Score: {reg.index}/100
                  </Badge>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  <span>Top Sector: </span>
                  <span className="font-semibold text-foreground">{reg.topSector}</span>
                </div>
                <Progress value={reg.index} className="mt-3 h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* In-Demand Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            In-Demand Employer Skills
          </CardTitle>
          <CardDescription>Key competencies requested in local Sierra Leone job listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SKILLS_IN_DEMAND.map((s) => (
              <div key={s.skill} className="rounded-xl border p-4">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span>{s.skill}</span>
                  <span className="text-primary">{s.demand}%</span>
                </div>
                <Progress value={s.demand} className="mt-2 h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
