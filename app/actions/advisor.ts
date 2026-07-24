"use server"

import { eq, asc } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { generateText } from "ai"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { chatMessage } from "@/lib/db/schema"
import { CAREERS } from "@/lib/data/careers"
import { KEY_STATS, SECTOR_EMPLOYMENT, TOP_GROWING_ROLES } from "@/lib/data/labour-market"
import { CAREER_AI_MODEL, isAiEnabled } from "@/lib/ai"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

export async function getChatHistory() {
  const userId = await getUserId()
  return db
    .select()
    .from(chatMessage)
    .where(eq(chatMessage.userId, userId))
    .orderBy(asc(chatMessage.createdAt))
}

export async function sendChatMessage(content: string) {
  const userId = await getUserId()
  const trimmed = content.trim()
  if (!trimmed) return { error: "Message cannot be empty" }

  // Save user message
  await db.insert(chatMessage).values({
    userId,
    role: "user",
    content: trimmed,
  })

  // Retrieve user history for conversation context
  const history = await getChatHistory()

  // Generate response via Gemini API (or fallback)
  const responseText = await getGeminiAdvisorResponse(trimmed, history)

  // Save assistant message
  await db.insert(chatMessage).values({
    userId,
    role: "assistant",
    content: responseText,
  })

  revalidatePath("/dashboard/advisor")
  return { success: true, reply: responseText }
}

export async function clearChatHistory() {
  const userId = await getUserId()
  await db.delete(chatMessage).where(eq(chatMessage.userId, userId))
  revalidatePath("/dashboard/advisor")
  return { success: true }
}

async function getGeminiAdvisorResponse(
  prompt: string,
  history: Array<{ role: string; content: string }>
): Promise<string> {
  if (!isAiEnabled()) {
    return generateFallbackAdvisorResponse(prompt)
  }

  const systemContext = `You are CareerAI Sierra Leone, an empathetic, highly knowledgeable AI career counselor dedicated to helping students, graduates, and job seekers in Sierra Leone.
Your mission is to provide encouraging, realistic, and highly practical career advice tailored to Sierra Leone's economy.

Here is essential local context you know:
- Currency: Sierra Leonean Leone (SLE)
- Top growing roles: ${TOP_GROWING_ROLES.map((r) => `${r.role} (+${r.growth}% growth)`).join(", ")}.
- Sector breakdown: Agriculture (57% share), Services (26%), Trade (9%), Industry (5%), Public Sector (3%).
- Regional hubs: Western Area (Freetown - Services & Tech), Northern Province (Agriculture/Mining), Southern Province (Bo - Agribusiness), Eastern Province (Kenema - Agriculture/Cocoa), North West (Port Loko - Fisheries/Agri).
- Key institutions: Fourah Bay College, Njala University, Sensi Tech Innovation Hub, Innovation SL.
- Profiled Careers: ${CAREERS.map((c) => `${c.title} (${c.category}, Demand: ${c.demand}, Salary: ${c.salaryRange})`).join("; ")}.

Guidelines:
1. Provide concise, clear, and well-structured answers using markdown bullet points or bold text where helpful.
2. Reference specific Sierra Leonean institutions, salary estimates in SLE, or growth sectors when relevant.
3. Be supportive, practical, and action-oriented.`

  try {
    // Build conversation history (excluding the just-saved user message,
    // which we pass as the final prompt).
    const priorHistory = history.slice(-8)
    const messages = priorHistory
      .filter((msg, i) => !(i === priorHistory.length - 1 && msg.role === "user" && msg.content === prompt))
      .map((msg) => ({
        role: msg.role === "user" ? ("user" as const) : ("assistant" as const),
        content: msg.content,
      }))
    messages.push({ role: "user" as const, content: prompt })

    const { text } = await generateText({
      model: CAREER_AI_MODEL,
      temperature: 0.7,
      system: systemContext,
      messages,
    })

    if (text) return text
  } catch (err) {
    console.error("AI advisor error:", err)
  }

  return generateFallbackAdvisorResponse(prompt)
}

function generateFallbackAdvisorResponse(prompt: string): string {
  const lower = prompt.toLowerCase()

  if (lower.includes("salary") || lower.includes("earn") || lower.includes("pay")) {
    return "In Sierra Leone, entry-level salaries typically range from SLE 2,500 to SLE 5,000 per month depending on the sector. Technical fields like Software Development and Solar Technology can reach SLE 10,000 – 15,000+ per month as you gain experience."
  }

  if (lower.includes("tech") || lower.includes("software") || lower.includes("developer") || lower.includes("coding")) {
    return "Technology is expanding rapidly in Freetown! To get started, take free online courses like freeCodeCamp or Coursera's Python specialization. You can also connect with local innovation hubs like Sensi Tech Innovation Hub and Innovation SL."
  }

  if (lower.includes("health") || lower.includes("nurse") || lower.includes("doctor") || lower.includes("public health")) {
    return "Health careers remain vital across all districts in Sierra Leone. Roles like Community Health Officers and Epidemiologists are in high demand with the Ministry of Health and global NGOs such as Partners In Health and GOAL."
  }

  if (lower.includes("agriculture") || lower.includes("farming") || lower.includes("agribusiness")) {
    return "Agriculture accounts for over 57% of employment in Sierra Leone. Opportunities in Agribusiness, value chain addition, and sustainable farming are expanding with support from Njala University research and private agri-tech ventures."
  }

  const matched = CAREERS.find((c) => lower.includes(c.title.toLowerCase()) || lower.includes(c.category.toLowerCase()))
  if (matched) {
    return `**${matched.title}** (${matched.category}) is currently in **${matched.demand} demand** in Sierra Leone. Salary ranges around **${matched.salaryRange}**. Key skills needed include: ${matched.skills.join(", ")}. ${matched.localContext}`
  }

  return `As your Career AI Advisor, I am here to help you navigate your educational and career choices in Sierra Leone. Feel free to ask about specific industries, salary ranges in SLE, or how to build skills for your target role!`
}
