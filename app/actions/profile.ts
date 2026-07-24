"use server"

import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { user, userProfile, type UserProfile } from "@/lib/db/schema"

async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user
}

const SELECTABLE_ROLES = ["student", "graduate", "job_seeker", "counsellor"] as const

export type ProfileData = {
  name: string
  email: string
  role: string
  profile: UserProfile | null
}

export async function getProfile(): Promise<ProfileData> {
  const sessionUser = await getSessionUser()

  const [profile] = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, sessionUser.id))
    .limit(1)

  return {
    name: sessionUser.name,
    email: sessionUser.email,
    role: (sessionUser as { role?: string | null }).role ?? "user",
    profile: profile ?? null,
  }
}

const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  role: z.string().optional(),
  headline: z.string().trim().max(160).optional().nullable(),
  phone: z.string().trim().max(40).optional().nullable(),
  district: z.string().trim().max(80).optional().nullable(),
  educationLevel: z.string().trim().max(80).optional().nullable(),
  fieldOfStudy: z.string().trim().max(120).optional().nullable(),
  institution: z.string().trim().max(160).optional().nullable(),
  bio: z.string().trim().max(1000).optional().nullable(),
  interests: z.string().trim().max(400).optional().nullable(),
})

export type ProfileInput = z.input<typeof profileSchema>

export async function updateProfile(input: ProfileInput) {
  const sessionUser = await getSessionUser()
  const parsed = profileSchema.safeParse(input)

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid profile data")
  }

  const data = parsed.data
  const nowRole =
    data.role && SELECTABLE_ROLES.includes(data.role as (typeof SELECTABLE_ROLES)[number])
      ? data.role
      : undefined

  // Update the core account fields (never let a normal user grant themselves admin).
  const currentRole = (sessionUser as { role?: string | null }).role
  await db
    .update(user)
    .set({
      name: data.name,
      ...(nowRole && currentRole !== "admin" ? { role: nowRole } : {}),
      updatedAt: new Date(),
    })
    .where(eq(user.id, sessionUser.id))

  const profileValues = {
    headline: data.headline || null,
    phone: data.phone || null,
    district: data.district || null,
    educationLevel: data.educationLevel || null,
    fieldOfStudy: data.fieldOfStudy || null,
    institution: data.institution || null,
    bio: data.bio || null,
    interests: data.interests || null,
    updatedAt: new Date(),
  }

  await db
    .insert(userProfile)
    .values({ userId: sessionUser.id, ...profileValues })
    .onConflictDoUpdate({ target: userProfile.userId, set: profileValues })

  revalidatePath("/dashboard/profile")
  revalidatePath("/dashboard")
  return { success: true }
}
