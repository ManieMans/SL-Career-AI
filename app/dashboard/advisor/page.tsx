import { requireUser } from "@/lib/session"
import { getChatHistory } from "@/app/actions/advisor"
import { AdvisorChatClient } from "./advisor-client"

export default async function AdvisorPage() {
  const user = await requireUser()
  const history = await getChatHistory()

  return <AdvisorChatClient user={user} initialHistory={history} />
}
