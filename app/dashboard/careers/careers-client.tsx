"use client"

import { useState, useTransition } from "react"
import { Search, Compass, Bookmark, Check, SlidersHorizontal, BookOpen, MapPin, DollarSign } from "lucide-react"
import { CAREERS, CAREER_CATEGORIES, type Career } from "@/lib/data/careers"
import { toggleSavedCareer } from "@/app/actions/assessment"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export function CareersCatalogClient({ initialSavedIds }: { initialSavedIds: string[] }) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [selectedDemand, setSelectedDemand] = useState<string>("All")
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(initialSavedIds))
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = CAREERS.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.summary.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))

    const matchesCategory = selectedCategory === "All" || c.category === selectedCategory
    const matchesDemand = selectedDemand === "All" || c.demand === selectedDemand

    return matchesSearch && matchesCategory && matchesDemand
  })

  const handleToggleSave = (c: Career) => {
    const isSaved = savedIds.has(c.id)
    const next = new Set(savedIds)
    if (isSaved) {
      next.delete(c.id)
    } else {
      next.add(c.id)
    }
    setSavedIds(next)

    startTransition(async () => {
      try {
        const res = await toggleSavedCareer(c.id, c.title)
        toast.success(res.saved ? `Saved ${c.title} to bookmarks` : `Removed ${c.title} from bookmarks`)
      } catch (err: any) {
        toast.error("Failed to update saved career")
      }
    })
  }

  return (
    <div className="container max-w-6xl space-y-8 p-4 py-8 md:p-8">
      {/* Page Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight">Career Catalog</h1>
        <p className="mt-1 text-muted-foreground">
          Explore roles in Sierra Leone with salary estimates, skill requirements, and localized job insights.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by career title, skill, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category & Demand Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filter:
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filter by sector category"
            className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="All">All Sectors</option>
            {CAREER_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedDemand}
            onChange={(e) => setSelectedDemand(e.target.value)}
            aria-label="Filter by market demand level"
            className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="All">All Demand Levels</option>
            <option value="High">High Demand</option>
            <option value="Growing">Growing</option>
            <option value="Emerging">Emerging</option>
            <option value="Moderate">Moderate</option>
          </select>
        </div>
      </div>

      {/* Career Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => {
          const isSaved = savedIds.has(c.id)
          return (
            <Card key={c.id} className="flex flex-col justify-between transition-all hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary">{c.category}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleSave(c)}
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    aria-label={isSaved ? "Remove bookmark" : "Bookmark career"}
                  >
                    <Bookmark className={`h-4 w-4 ${isSaved ? "fill-primary text-primary" : ""}`} />
                  </Button>
                </div>
                <CardTitle className="font-bold text-xl mt-2">{c.title}</CardTitle>
                <CardDescription className="line-clamp-2 text-sm">{c.summary}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Demand Level:</span>
                    <Badge variant="outline" className="text-xs font-semibold text-primary border-primary/30">
                      {c.demand}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Monthly Salary (SLE):</span>
                    <span className="font-semibold text-foreground">{c.salaryRange}</span>
                  </div>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1">
                  {c.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-[10px] font-normal">
                      {skill}
                    </Badge>
                  ))}
                  {c.skills.length > 3 && (
                    <Badge variant="outline" className="text-[10px] font-normal">
                      +{c.skills.length - 3} more
                    </Badge>
                  )}
                </div>

                <Button variant="outline" size="sm" className="w-full" onClick={() => setSelectedCareer(c)}>
                  View Full Details
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center text-muted-foreground">
          No careers match your search criteria. Try adjusting your filters or search term.
        </div>
      )}

      {/* Career Details Modal Overlay */}
      {selectedCareer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-background p-6 md:p-8 shadow-2xl border">
            <div className="flex items-start justify-between gap-4 border-b pb-4">
              <div>
                <Badge variant="secondary">{selectedCareer.category}</Badge>
                <h2 className="font-serif text-2xl font-bold mt-2">{selectedCareer.title}</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedCareer(null)}>
                Close
              </Button>
            </div>

            <div className="mt-6 space-y-6 text-sm">
              <div>
                <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Overview</h4>
                <p className="mt-1 leading-relaxed">{selectedCareer.description}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border p-4 bg-muted/20">
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-primary" /> Salary Range (SLE)
                  </h4>
                  <p className="mt-1 font-bold text-lg text-primary">{selectedCareer.salaryRange}</p>
                </div>

                <div className="rounded-xl border p-4 bg-muted/20">
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Compass className="h-4 w-4 text-primary" /> Outlook & Demand
                  </h4>
                  <p className="mt-1 font-semibold">{selectedCareer.demand} Demand</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{selectedCareer.outlook}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <BookOpen className="h-4 w-4 text-primary" /> Educational Pathway
                </h4>
                <p className="mt-1 leading-relaxed">{selectedCareer.education}</p>
              </div>

              <div>
                <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Key Skills</h4>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedCareer.skills.map((s) => (
                    <Badge key={s} variant="secondary">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <h4 className="font-semibold text-xs uppercase tracking-wider text-primary flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> Sierra Leone Context
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{selectedCareer.localContext}</p>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t">
              <Button
                variant={savedIds.has(selectedCareer.id) ? "secondary" : "default"}
                onClick={() => handleToggleSave(selectedCareer)}
              >
                <Bookmark className="mr-2 h-4 w-4" />
                {savedIds.has(selectedCareer.id) ? "Saved in Bookmarks" : "Save Career"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
