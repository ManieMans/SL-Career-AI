"use client"

import { useState, useTransition } from "react"
import { BookOpen, ExternalLink, CheckCircle2, Search, SlidersHorizontal, Award, GraduationCap } from "lucide-react"
import { LEARNING_RESOURCES, RESOURCE_CATEGORIES, type LearningResource } from "@/lib/data/learning"
import { toggleLearningProgress } from "@/app/actions/assessment"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export function LearningCatalogClient({ initialTrackedIds }: { initialTrackedIds: string[] }) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [trackedIds, setTrackedIds] = useState<Set<string>>(new Set(initialTrackedIds))
  const [isPending, startTransition] = useTransition()

  const filtered = LEARNING_RESOURCES.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.provider.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase())

    const matchesCategory = selectedCategory === "All" || r.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleToggleTrack = (r: LearningResource) => {
    const isTracked = trackedIds.has(r.id)
    const next = new Set(trackedIds)
    if (isTracked) {
      next.delete(r.id)
    } else {
      next.add(r.id)
    }
    setTrackedIds(next)

    startTransition(async () => {
      try {
        const res = await toggleLearningProgress(r.id, r.title)
        toast.success(res.tracking ? `Enrolled in ${r.title}` : `Unenrolled from ${r.title}`)
      } catch (err: any) {
        toast.error("Failed to update progress")
      }
    })
  }

  return (
    <div className="container max-w-6xl space-y-8 p-4 py-8 md:p-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1 rounded-full px-3 py-1">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            Skill Up & Educate
          </Badge>
        </div>
        <h1 className="font-serif text-3xl font-bold tracking-tight mt-2">Curated Learning Resources</h1>
        <p className="mt-1 text-muted-foreground">
          Discover online courses, certifications, local programs (e.g. Njala University), and scholarships to advance your career in Sierra Leone.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses, providers, or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {RESOURCE_CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="rounded-full text-xs shrink-0"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r) => {
          const isTracked = trackedIds.has(r.id)
          return (
            <Card key={r.id} className="flex flex-col justify-between transition-all hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary">{r.category}</Badge>
                  <Badge
                    variant="outline"
                    className={
                      r.cost === "Free"
                        ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                        : "border-primary/30 text-primary"
                    }
                  >
                    {r.cost}
                  </Badge>
                </div>
                <CardTitle className="font-bold text-xl mt-2">{r.title}</CardTitle>
                <CardDescription className="text-xs font-semibold text-primary">{r.provider}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{r.description}</p>

                <div className="flex items-center justify-between text-xs pt-2 border-t">
                  <span className="text-muted-foreground">Type: <strong className="text-foreground">{r.type}</strong></span>
                  <span className="text-muted-foreground">Level: <strong className="text-foreground">{r.level}</strong></span>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant={isTracked ? "secondary" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => handleToggleTrack(r)}
                  >
                    <CheckCircle2 className={`mr-2 h-4 w-4 ${isTracked ? "text-emerald-500 fill-emerald-500/20" : ""}`} />
                    {isTracked ? "Tracked" : "Track Progress"}
                  </Button>

                  {r.url !== "#" && (
                    <Button size="sm" asChild>
                      <a href={r.url} target="_blank" rel="noopener noreferrer">
                        Visit <ExternalLink className="ml-1 h-3.5 w-3.5" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center text-muted-foreground">
          No learning resources found matching your search. Try another category or keyword.
        </div>
      )}
    </div>
  )
}
