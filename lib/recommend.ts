import { generateObject } from "ai"
import { z } from "zod"
import { CAREERS } from "@/lib/data/careers"
import { TOP_GROWING_ROLES, SECTOR_EMPLOYMENT } from "@/lib/data/labour-market"
import { CAREER_AI_MODEL, isAiEnabled } from "@/lib/ai"
import type { RecommendedCareer } from "@/lib/db/schema"
import type { Riasec } from "@/lib/data/assessment"

const DEMAND_WEIGHT: Record<string, number> = {
  High: 12,
  Growing: 9,
  Emerging: 7,
  Moderate: 4,
}

type LlmEnrichment = {
  summary: string
  careers: Array<{ careerId: string; reason: string }>
}

// Deterministic matching: overlap between a user's top interest areas and
// each career's RIASEC profile, weighted by local demand.
export function recommendCareers(scores: Record<string, number>): {
  careers: RecommendedCareer[]
  summary: string
} {
  const sorted = (Object.entries(scores) as [Riasec, number][]).sort((a, b) => b[1] - a[1])
  const top = sorted.slice(0, 3).map(([dim]) => dim)

  const ranked = CAREERS.map((career) => {
    let interestScore = 0
    career.riasec.forEach((dim, index) => {
      const userScore = scores[dim] ?? 0
      // Careers list their codes in priority order; weight earlier ones more.
      const positionWeight = 1 - index * 0.2
      interestScore += (userScore / 100) * positionWeight
    })
    const overlap = career.riasec.filter((d) => top.includes(d as Riasec)).length
    const demandBonus = DEMAND_WEIGHT[career.demand] ?? 0
    const raw = interestScore * 55 + overlap * 10 + demandBonus
    const matchScore = Math.max(40, Math.min(98, Math.round(raw)))

    const reason = `Aligns with your ${career.riasec
      .filter((d) => top.includes(d as Riasec))
      .join(" & ")} strengths and has ${career.demand.toLowerCase()} demand in Sierra Leone.`

    return {
      careerId: career.id,
      title: career.title,
      matchScore,
      reason: overlap > 0 ? reason : `Draws on ${career.riasec.join(", ")} interests, with ${career.demand.toLowerCase()} local demand.`,
    }
  })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 6)

  const topLabels = top.join(", ")
  const summary = `Your strongest interest areas are ${topLabels}. Based on this profile and current opportunities in Sierra Leone, we've matched you with careers that combine what energizes you with where jobs are growing. Your top match is ${ranked[0]?.title} at ${ranked[0]?.matchScore}%.`

  return { careers: ranked, summary }
}

// Hybrid: rule engine ranks careers and scores; Gemini writes the summary and reasons.
export async function recommendCareersWithLLM(
  scores: Record<string, number>,
  personalityType: string,
  userRole?: string | null
): Promise<{ careers: RecommendedCareer[]; summary: string }> {
  const baseline = recommendCareers(scores)
  if (!isAiEnabled()) return baseline

  const enrichment = await getRecommendationEnrichment(
    scores,
    personalityType,
    userRole,
    baseline.careers
  )
  if (!enrichment) return baseline

  const reasonById = new Map(enrichment.careers.map((c) => [c.careerId, c.reason]))
  const careers = baseline.careers.map((career) => ({
    ...career,
    reason: reasonById.get(career.careerId) ?? career.reason,
  }))

  return {
    careers,
    summary: enrichment.summary.trim() || baseline.summary,
  }
}

async function getRecommendationEnrichment(
  scores: Record<string, number>,
  personalityType: string,
  userRole: string | null | undefined,
  rankedCareers: RecommendedCareer[]
): Promise<LlmEnrichment | null> {
  const careerContext = rankedCareers.map((item) => {
    const detail = CAREERS.find((c) => c.id === item.careerId)
    return {
      careerId: item.careerId,
      title: item.title,
      matchScore: item.matchScore,
      category: detail?.category ?? "Unknown",
      demand: detail?.demand ?? "Moderate",
      salaryRange: detail?.salaryRange ?? "N/A",
      skills: detail?.skills ?? [],
      localContext: detail?.localContext ?? "",
    }
  })

  const systemPrompt = `You are CareerAI Sierra Leone, an expert career counselor for students and job seekers in Sierra Leone.
Given a user's RIASEC assessment results and pre-ranked career matches, write a warm, personalized summary and a specific reason for each match.

Local context:
- Top growing roles: ${TOP_GROWING_ROLES.map((r) => `${r.role} (+${r.growth}%)`).join(", ")}.
- Sector employment: ${SECTOR_EMPLOYMENT.map((s) => `${s.sector} (${s.share}%)`).join(", ")}.
- Currency: Sierra Leonean Leone (SLE).

Rules:
1. Return ONLY valid JSON matching the schema below.
2. Use ONLY the careerId values provided — do not add or remove careers.
3. Do NOT change match scores; they are already calculated.
4. Keep each reason to 1–2 sentences, referencing the user's RIASEC profile and Sierra Leone context.
5. Summary should be 2–3 sentences, encouraging and specific to their Holland code.`

  const userPrompt = `User profile:
- Holland code: ${personalityType}
- Role: ${userRole ?? "user"}
- RIASEC scores: ${JSON.stringify(scores)}

Pre-ranked careers (preserve careerId and order):
${JSON.stringify(careerContext, null, 2)}

Return JSON:
{
  "summary": "<personalized 2-3 sentence overview>",
  "careers": [
    { "careerId": "<id from list>", "reason": "<1-2 sentence personalized reason>" }
  ]
}`

  try {
    const { object } = await generateObject({
      model: CAREER_AI_MODEL,
      temperature: 0.6,
      system: systemPrompt,
      prompt: userPrompt,
      schema: z.object({
        summary: z.string(),
        careers: z.array(
          z.object({
            careerId: z.string(),
            reason: z.string(),
          })
        ),
      }),
    })

    if (!object.summary || !Array.isArray(object.careers)) return null

    const allowedIds = new Set(rankedCareers.map((c) => c.careerId))
    const validCareers = object.careers.filter(
      (c) => typeof c.careerId === "string" && typeof c.reason === "string" && allowedIds.has(c.careerId)
    )

    if (validCareers.length === 0) return null

    return { summary: object.summary, careers: validCareers }
  } catch (err) {
    console.error("AI recommendation error:", err)
    return null
  }
}
