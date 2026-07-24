"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Brain, CheckCircle2, ArrowRight, ArrowLeft, RotateCcw } from "lucide-react"
import { QUESTIONS, LIKERT_OPTIONS, RIASEC_INFO, type Riasec } from "@/lib/data/assessment"
import { submitAssessment } from "@/app/actions/assessment"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export default function AssessmentPage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ personalityType: string; scores: Record<string, number> } | null>(null)

  const currentQ = QUESTIONS[currentIndex]
  const totalQ = QUESTIONS.length
  const progressPercent = Math.round(((currentIndex + 1) / totalQ) * 100)

  const handleSelectOption = (value: number) => {
    const nextAnswers = { ...answers, [currentQ.id]: value }
    setAnswers(nextAnswers)

    if (currentIndex < totalQ - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleSubmit = async () => {
    // Ensure all answered
    if (Object.keys(answers).length < totalQ) {
      toast.error("Please answer all questions before submitting.")
      return
    }

    setSubmitting(true)
    try {
      const res = await submitAssessment(answers)
      setResult({ personalityType: res.personalityType, scores: res.scores })
      toast.success("Assessment submitted successfully!")
    } catch (err: any) {
      toast.error(err.message || "Failed to submit assessment")
    } finally {
      setSubmitting(false)
    }
  }

  if (result) {
    return (
      <div className="container max-w-3xl space-y-8 p-4 py-12 md:p-8">
        <Card className="text-center p-6 md:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <CardTitle className="font-serif text-3xl">Assessment Completed!</CardTitle>
          <CardDescription className="mt-2 text-base">
            Your primary Holland Code interest profile is:
          </CardDescription>

          <div className="mt-6 flex justify-center">
            <span className="font-serif text-5xl font-extrabold tracking-widest text-primary bg-primary/10 px-6 py-3 rounded-2xl">
              {result.personalityType}
            </span>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 text-left">
            {(Object.entries(result.scores) as [Riasec, number][]).map(([dim, score]) => (
              <div key={dim} className="rounded-lg border p-3">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span>{dim}</span>
                  <span className="text-primary">{score}%</span>
                </div>
                <Progress value={score} className="mt-2 h-2" />
                <p className="mt-1 text-xs text-muted-foreground">{RIASEC_INFO[dim]?.short}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => router.push("/dashboard/recommendations")}>
              View Recommended Careers
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => { setResult(null); setCurrentIndex(0); setAnswers({}); }}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Retake Quiz
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-3xl space-y-8 p-4 py-8 md:p-8">
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight">Career Interest Assessment</h1>
        <p className="mt-1 text-muted-foreground">
          Discover your strengths based on the RIASEC Holland Code model. Select how strongly you agree with each statement.
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span>Question {currentIndex + 1} of {totalQ}</span>
          <span className="text-primary font-semibold">{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary">{currentQ.dimension}</Badge>
          <span className="text-xs text-muted-foreground">{RIASEC_INFO[currentQ.dimension]?.short}</span>
        </div>

        <h2 className="font-serif text-xl md:text-2xl font-semibold leading-snug text-foreground">
          "{currentQ.text}"
        </h2>

        {/* Options */}
        <div className="mt-8 grid gap-3">
          {LIKERT_OPTIONS.map((opt) => {
            const isSelected = answers[currentQ.id] === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelectOption(opt.value)}
                className={`flex items-center justify-between w-full rounded-xl border p-4 text-left transition-all font-medium ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                    : "border-border hover:bg-muted hover:border-foreground/20"
                }`}
              >
                <span>{opt.label}</span>
                <span className={`h-5 w-5 rounded-full border flex items-center justify-center text-xs ${isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"}`}>
                  {opt.value}
                </span>
              </button>
            )
          })}
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentIndex === totalQ - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={submitting || Object.keys(answers).length < totalQ}
            >
              {submitting ? "Analyzing..." : "Submit & View Results"}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentIndex(Math.min(totalQ - 1, currentIndex + 1))}
              disabled={!answers[currentQ.id]}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
