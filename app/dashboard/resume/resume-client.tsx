"use client"

import { useState, useTransition } from "react"
import { FileText, Sparkles, CheckCircle2, AlertCircle, Lightbulb, Compass, Upload, Copy, Check } from "lucide-react"
import { analyzeResumeAction, extractResumeTextAction } from "@/app/actions/resume"
import type { ResumeAnalysis } from "@/lib/db/schema"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

const SAMPLE_TEMPLATE = `AMINATA KAMARA
Freetown, Sierra Leone | +232 76 000 000 | aminata@example.com

SUMMARY
Motivated and detail-oriented graduate with a strong foundation in Data Analysis, Excel, and Community Research. Passionate about leveraging digital tools to drive positive impact in public health and agricultural development across Sierra Leone.

EDUCATION
B.Sc. in Statistics & Economics
Fourah Bay College, University of Sierra Leone (2020 – 2024)
- Relevant Coursework: Data Analysis, Econometrics, Research Methods, Applied Mathematics

SKILLS
- Technical & Software: Advanced MS Excel, Python (pandas, matplotlib), SQL, SPSS, Data Visualization
- Soft Skills: Problem Solving, Team Leadership, Report Writing, Public Speaking
- Languages: English (Fluent), Krio (Native)

EXPERIENCE & VOLUNTEERING
Research Assistant (Intern)
Local Development NGO, Freetown (June 2023 – Dec 2023)
- Assisted in collecting and cleaning survey data from over 300 rural households.
- Created monthly progress reports using MS Excel and presented insights to program coordinators.

PROJECTS & CERTIFICATIONS
- Google Data Analytics Professional Certificate (Coursera)
- Responsive Web Design Certification (freeCodeCamp)
`

export function ResumeClient({
  initialResume,
}: {
  initialResume: { id: number; filename: string; content: string | null; analysis: ResumeAnalysis | null } | null
}) {
  const [content, setContent] = useState(initialResume?.content || "")
  const [filename, setFilename] = useState(initialResume?.filename || "My_Resume.txt")
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(initialResume?.analysis || null)
  const [isPending, startTransition] = useTransition()
  const [isUploading, setIsUploading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleAnalyze = () => {
    if (!content.trim()) {
      toast.error("Please paste or upload your resume text first")
      return
    }

    startTransition(async () => {
      try {
        const res = await analyzeResumeAction(filename, content)
        setAnalysis(res.analysis)
        toast.success("Resume analysis generated successfully!")
      } catch (err: any) {
        toast.error(err.message || "Failed to analyze resume")
      }
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target
    const file = input.files?.[0]
    console.log("[v0] handleFileUpload fired, file:", file?.name, file?.size)
    if (!file) return

    if (file.size > 8 * 1024 * 1024) {
      toast.error("File is too large. Please upload a file under 8MB.")
      input.value = ""
      return
    }

    setIsUploading(true)
    const loadingId = toast.loading(`Reading ${file.name}...`)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const { filename: extractedName, content: extractedText } = await extractResumeTextAction(formData)
      setFilename(extractedName)
      setContent(extractedText)
      toast.success(`Loaded ${extractedName}`, { id: loadingId })
    } catch (err: any) {
      toast.error(err?.message || "Failed to read file", { id: loadingId })
    } finally {
      setIsUploading(false)
      // Reset so selecting the same file again re-triggers onChange
      input.value = ""
    }
  }

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(SAMPLE_TEMPLATE)
    setCopied(true)
    toast.success("Sample template copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container max-w-5xl space-y-8 p-4 py-8 md:p-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1 rounded-full px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI Resume Analyzer & Builder
          </Badge>
        </div>
        <h1 className="font-serif text-3xl font-bold tracking-tight mt-2">Resume Optimization</h1>
        <p className="mt-1 text-muted-foreground">
          Analyze your CV against employer requirements in Sierra Leone, get instant AI feedback, or use our optimized local resume template.
        </p>
      </div>

      <Tabs defaultValue="analyzer" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="analyzer">AI Resume Analyzer</TabsTrigger>
          <TabsTrigger value="template">Local Sierra Leone CV Template</TabsTrigger>
        </TabsList>

        {/* Analyzer Tab */}
        <TabsContent value="analyzer" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Input Side */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Upload or Paste Resume Text
                </CardTitle>
                <CardDescription>Upload a PDF, Word document, or text file &mdash; or paste your CV content below</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Upload className="h-3.5 w-3.5" />
                    Upload CV file (PDF, DOCX, DOC, TXT, MD)
                  </label>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.md,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown"
                    onChange={handleFileUpload}
                    disabled={isUploading || isPending}
                    className="cursor-pointer"
                  />
                  {isUploading && <p className="text-xs text-muted-foreground">Extracting text from your file...</p>}
                </div>

                <Textarea
                  placeholder="Paste your CV text here, or upload a file above..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[300px] font-mono text-xs leading-relaxed"
                />

                <Button onClick={handleAnalyze} disabled={isPending || isUploading || !content.trim()} className="w-full">
                  {isPending ? "Analyzing with AI..." : "Analyze Resume"}
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Analysis Results Side */}
            <Card className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Feedback & Score
                </CardTitle>
                <CardDescription>Automated alignment with Sierra Leone job market expectations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 flex-1">
                {analysis ? (
                  <div className="space-y-6">
                    {/* Score badge */}
                    <div className="rounded-xl border p-4 text-center bg-primary/5 border-primary/20">
                      <span className="font-serif text-4xl font-extrabold text-primary">{analysis.score}/100</span>
                      <p className="text-xs text-muted-foreground mt-1 font-semibold">Overall Resume Strength Score</p>
                      <Progress value={analysis.score} className="mt-3 h-2" />
                    </div>

                    {/* Strengths */}
                    {analysis.strengths.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" /> Key Strengths
                        </h4>
                        <ul className="space-y-1 text-xs text-muted-foreground list-disc pl-4">
                          {analysis.strengths.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Gaps & Suggestions */}
                    {analysis.suggestions.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <Lightbulb className="h-4 w-4" /> Recommended Improvements
                        </h4>
                        <ul className="space-y-1 text-xs text-muted-foreground list-disc pl-4">
                          {analysis.suggestions.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Suggested Careers */}
                    {analysis.suggestedCareers.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                          <Compass className="h-4 w-4" /> Matched Sierra Leone Roles
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {analysis.suggestedCareers.map((c) => (
                            <Badge key={c} variant="secondary">
                              {c}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-20 text-center text-muted-foreground text-sm space-y-2">
                    <FileText className="h-10 w-10 mx-auto text-muted-foreground/40" />
                    <p>No analysis generated yet.</p>
                    <p className="text-xs text-muted-foreground">Paste your resume content on the left and click "Analyze Resume".</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Template Tab */}
        <TabsContent value="template">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sierra Leone Standard CV Format</CardTitle>
                <CardDescription>Clean, ATS-friendly template tailored for local employers and NGOs</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleCopyTemplate}>
                {copied ? <Check className="mr-2 h-4 w-4 text-emerald-500" /> : <Copy className="mr-2 h-4 w-4" />}
                {copied ? "Copied" : "Copy Template"}
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="p-4 rounded-xl border bg-muted/40 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {SAMPLE_TEMPLATE}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
