import { requireUser } from "@/lib/session"
import { getSavedCareers } from "@/app/actions/assessment"
import { CareersCatalogClient } from "./careers-client"

export default async function CareersPage() {
  await requireUser()
  const saved = await getSavedCareers()
  const savedIds = saved.map((s) => s.careerId)

  return <CareersCatalogClient initialSavedIds={savedIds} />
}
