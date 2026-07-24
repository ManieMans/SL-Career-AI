import { requireUser } from "@/lib/session"
import { getLearningProgress } from "@/app/actions/assessment"
import { LearningCatalogClient } from "./learning-client"

export default async function LearningPage() {
  await requireUser()
  const progress = await getLearningProgress()
  const trackedIds = progress.map((p) => p.resourceId)

  return <LearningCatalogClient initialTrackedIds={trackedIds} />
}
