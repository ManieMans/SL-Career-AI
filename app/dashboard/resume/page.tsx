import { requireUser } from "@/lib/session"
import { getLatestResume } from "@/app/actions/resume"
import { ResumeClient } from "./resume-client"

export default async function ResumePage() {
  await requireUser()
  const latestResume = await getLatestResume()

  return <ResumeClient initialResume={latestResume} />
}
