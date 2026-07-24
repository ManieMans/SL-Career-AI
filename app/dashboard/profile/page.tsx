import { requireUser } from "@/lib/session"
import { getProfile } from "@/app/actions/profile"
import {
  getLatestAssessment,
  getSavedCareers,
  getLearningProgress,
} from "@/app/actions/assessment"
import { getLatestResume } from "@/app/actions/resume"
import { ProfileClient } from "./profile-client"

export default async function ProfilePage() {
  await requireUser()
  const [profile, assessment, saved, learning, resume] = await Promise.all([
    getProfile(),
    getLatestAssessment(),
    getSavedCareers(),
    getLearningProgress(),
    getLatestResume(),
  ])

  return (
    <ProfileClient
      data={profile}
      stats={{
        personalityType: assessment?.personalityType ?? null,
        savedCareers: saved.length,
        coursesTracked: learning.length,
        hasResume: Boolean(resume),
      }}
    />
  )
}
