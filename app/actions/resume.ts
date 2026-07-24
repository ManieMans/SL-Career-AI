"use server"

import { eq, desc } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { generateObject } from "ai"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { resume, type ResumeAnalysis } from "@/lib/db/schema"
import { CAREERS } from "@/lib/data/careers"
import { CAREER_AI_MODEL, isAiEnabled } from "@/lib/ai"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

const MAX_FILE_BYTES = 8 * 1024 * 1024 // 8 MB

// Extracts plain text from an uploaded resume file (.pdf, .docx, .doc, .txt, .md).
// Runs on the server so we can use proper parsers instead of the browser's
// FileReader, which returns binary garbage for PDF/Word documents.
export async function extractResumeTextAction(formData: FormData) {
  await getUserId()

  const file = formData.get("file")
  if (!file || typeof file === "string") {
    throw new Error("No file was provided")
  }

  const uploaded = file as File
  if (uploaded.size === 0) throw new Error("The uploaded file is empty")
  if (uploaded.size > MAX_FILE_BYTES) throw new Error("File is too large (max 8MB)")

  const name = uploaded.name || "resume"
  const ext = name.split(".").pop()?.toLowerCase() ?? ""
  const buffer = Buffer.from(await uploaded.arrayBuffer())

  let text = ""

  try {
    if (ext === "pdf" || uploaded.type === "application/pdf") {
      const { extractText, getDocumentProxy } = await import("unpdf")
      const pdf = await getDocumentProxy(new Uint8Array(buffer))
      const { text: pdfText } = await extractText(pdf, { mergePages: true })
      text = Array.isArray(pdfText) ? pdfText.join("\n") : pdfText
    } else if (ext === "docx" || ext === "doc" || uploaded.type.includes("word") || uploaded.type.includes("officedocument")) {
      const mammoth = (await import("mammoth")).default
      const { value } = await mammoth.extractRawText({ buffer })
      text = value
    } else {
      // Plain text formats (.txt, .md, or unknown text-based files)
      text = buffer.toString("utf8")
    }
  } catch (err) {
    console.error("[v0] Resume extraction error:", err)
    throw new Error("Could not read that file. Please try a different file or paste the text manually.")
  }

  const cleaned = text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim()

  if (!cleaned) {
    throw new Error("No readable text found in that file. If it is a scanned image, paste the text manually.")
  }

  return { filename: name, content: cleaned }
}

export async function getLatestResume() {
  const userId = await getUserId()
  const [latest] = await db
    .select()
    .from(resume)
    .where(eq(resume.userId, userId))
    .orderBy(desc(resume.createdAt))
    .limit(1)
  return latest ?? null
}

export async function analyzeResumeAction(filename: string, content: string) {
  const userId = await getUserId()
  const trimmed = content.trim()
  if (!trimmed) throw new Error("Resume content cannot be empty")

  const analysis = await getGeminiResumeAnalysis(trimmed)

  const [saved] = await db
    .insert(resume)
    .values({
      userId,
      filename: filename || "My_Resume.txt",
      content: trimmed,
      analysis,
    })
    .returning()

  revalidatePath("/dashboard/resume")
  return saved
}

async function getGeminiResumeAnalysis(text: string): Promise<ResumeAnalysis> {
  if (!isAiEnabled()) {
    return generateFallbackResumeAnalysis(text)
  }

  const systemPrompt = `You are an expert HR Specialist and Career Coach in Sierra Leone.
Your task is to analyze the provided CV / Resume text for candidates applying for jobs in Sierra Leone.
Evaluate the candidate's education, skills, local relevance, and formatting.

Available Sierra Leone Career Profiles:
${CAREERS.map((c) => c.title).join(", ")}.

Return ONLY a JSON object matching this exact structure:
{
  "score": <number between 40 and 98 representing overall strength>,
  "strengths": [<array of 2-4 key bullet points highlighting candidate strengths>],
  "gaps": [<array of 1-3 missing skills or formatting gaps>],
  "suggestions": [<array of 2-4 practical, actionable recommendations to improve the CV>],
  "suggestedCareers": [<array of 2-3 matched career titles from the available list>]
}`

  try {
    const { object } = await generateObject({
      model: CAREER_AI_MODEL,
      temperature: 0.2,
      system: systemPrompt,
      prompt: `Please analyze this CV text:\n\n${text}`,
      schema: z.object({
        score: z.number(),
        strengths: z.array(z.string()),
        gaps: z.array(z.string()),
        suggestions: z.array(z.string()),
        suggestedCareers: z.array(z.string()),
      }),
    })

    if (object && typeof object.score === "number") {
      return {
        score: Math.min(98, Math.max(40, object.score)),
        strengths: Array.isArray(object.strengths) ? object.strengths : [],
        gaps: Array.isArray(object.gaps) ? object.gaps : [],
        suggestions: Array.isArray(object.suggestions) ? object.suggestions : [],
        suggestedCareers: Array.isArray(object.suggestedCareers) ? object.suggestedCareers : [],
      }
    }
  } catch (err) {
    console.error("AI resume analysis error:", err)
  }

  return generateFallbackResumeAnalysis(text)
}

function generateFallbackResumeAnalysis(text: string): ResumeAnalysis {
  const lower = text.toLowerCase()
  const strengths: string[] = []
  const gaps: string[] = []
  const suggestions: string[] = []
  const suggestedCareers: string[] = []
  let score = 70

  if (lower.includes("degree") || lower.includes("bachelor") || lower.includes("diploma") || lower.includes("university") || lower.includes("wassce")) {
    strengths.push("Clear educational qualifications specified")
    score += 5
  } else {
    gaps.push("Educational background not explicitly listed")
    suggestions.push("Specify your highest level of education (e.g. WASSCE, Diploma, or Degree)")
  }

  if (lower.includes("python") || lower.includes("javascript") || lower.includes("excel") || lower.includes("sql") || lower.includes("data")) {
    strengths.push("Strong technical and digital literacy skills")
    score += 10
    suggestedCareers.push("Software Developer", "Data Analyst")
  } else {
    gaps.push("Limited digital skill keywords detected")
    suggestions.push("Include specific software tools (e.g., MS Excel, Google Docs, Python)")
  }

  if (lower.includes("leader") || lower.includes("manage") || lower.includes("communicate") || lower.includes("organize")) {
    strengths.push("Demonstrates leadership, teamwork, and communication skills")
    score += 5
  } else {
    suggestions.push("Highlight leadership roles, campus organizations, or community volunteering")
  }

  if (lower.includes("sierra leone") || lower.includes("freetown") || lower.includes("ngo") || lower.includes("health") || lower.includes("solar")) {
    strengths.push("Local Sierra Leonean project context and field experience")
    score += 5
    if (lower.includes("health")) suggestedCareers.push("Community Health Officer")
    if (lower.includes("solar") || lower.includes("energy")) suggestedCareers.push("Solar Energy Technician")
  } else {
    suggestions.push("Emphasize achievements and projects relevant to local Sierra Leone employers and NGOs")
  }

  if (suggestedCareers.length === 0) {
    suggestedCareers.push("Data Analyst", "Community Health Officer", "Agribusiness Specialist")
  }

  return {
    strengths,
    gaps,
    suggestions,
    suggestedCareers,
    score: Math.min(95, Math.max(50, score)),
  }
}
