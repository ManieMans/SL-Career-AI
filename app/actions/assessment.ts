"use server"

import { and, desc, eq } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { assessment, recommendation, savedCareer, learningProgress } from "@/lib/db/schema"
import { scoreAssessment } from "@/lib/data/assessment"
import { recommendCareersWithLLM } from "@/lib/recommend"

async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user
}

export async function submitAssessment(answers: Record<string, number>) {
  const user = await getSessionUser()
  const { scores, personalityType } = scoreAssessment(answers)

  const [saved] = await db
    .insert(assessment)
    .values({ userId: user.id, answers, scores, personalityType })
    .returning()

  const { careers, summary } = await recommendCareersWithLLM(scores, personalityType, user.role)
  await db.insert(recommendation).values({
    userId: user.id,
    assessmentId: saved.id,
    careers,
    summary,
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/recommendations")
  revalidatePath("/dashboard/assessment")
  return { id: saved.id, personalityType, scores }
}

async function getUserId() {
  return (await getSessionUser()).id
}

export async function getLatestAssessment() {
  const userId = await getUserId()
  const [latest] = await db
    .select()
    .from(assessment)
    .where(eq(assessment.userId, userId))
    .orderBy(desc(assessment.createdAt))
    .limit(1)
  return latest ?? null
}

export async function getLatestRecommendation() {
  const userId = await getUserId()
  const [latest] = await db
    .select()
    .from(recommendation)
    .where(eq(recommendation.userId, userId))
    .orderBy(desc(recommendation.createdAt))
    .limit(1)
  return latest ?? null
}

export async function getSavedCareers() {
  const userId = await getUserId()
  return db
    .select()
    .from(savedCareer)
    .where(eq(savedCareer.userId, userId))
    .orderBy(desc(savedCareer.createdAt))
}

export async function toggleSavedCareer(careerId: string, careerTitle: string) {
  const userId = await getUserId()
  const existing = await db
    .select()
    .from(savedCareer)
    .where(and(eq(savedCareer.userId, userId), eq(savedCareer.careerId, careerId)))
    .limit(1)

  if (existing.length > 0) {
    await db.delete(savedCareer).where(and(eq(savedCareer.userId, userId), eq(savedCareer.careerId, careerId)))
    revalidatePath("/dashboard/careers")
    return { saved: false }
  }

  await db.insert(savedCareer).values({ userId, careerId, careerTitle })
  revalidatePath("/dashboard/careers")
  return { saved: true }
}

export async function getLearningProgress() {
  const userId = await getUserId()
  return db.select().from(learningProgress).where(eq(learningProgress.userId, userId))
}

export async function toggleLearningProgress(resourceId: string, resourceTitle: string) {
  const userId = await getUserId()
  const existing = await db
    .select()
    .from(learningProgress)
    .where(and(eq(learningProgress.userId, userId), eq(learningProgress.resourceId, resourceId)))
    .limit(1)

  if (existing.length > 0) {
    await db
      .delete(learningProgress)
      .where(and(eq(learningProgress.userId, userId), eq(learningProgress.resourceId, resourceId)))
    revalidatePath("/dashboard/learning")
    return { tracking: false }
  }

  await db.insert(learningProgress).values({ userId, resourceId, resourceTitle })
  revalidatePath("/dashboard/learning")
  return { tracking: true }
}
