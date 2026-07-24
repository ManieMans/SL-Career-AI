import { createGoogleGenerativeAI } from "@ai-sdk/google"
import type { LanguageModel } from "ai"

// The Gemini API key comes from Google AI Studio. We accept a couple of common
// env var names so deployment is flexible.
const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY ??
  process.env.GEMINI_API_KEY_2 ??
  process.env.GOOGLE_GENERATIVE_AI_API_KEY

const HAS_GATEWAY = Boolean(process.env.AI_GATEWAY_API_KEY)

// Resolve which model powers the AI features:
// 1. A direct Google Generative AI key (Google AI Studio) — calls Gemini directly.
// 2. Otherwise the Vercel AI Gateway (zero-config) via a "google/..." model string.
// Every AI feature wraps its call in try/catch and falls back to deterministic
// logic, so the app stays fully functional even if the credential is rejected.
function resolveModel(): LanguageModel {
  if (GEMINI_API_KEY) {
    const google = createGoogleGenerativeAI({ apiKey: GEMINI_API_KEY })
    // "gemini-flash-latest" is a stable alias that tracks the current Flash
    // model. Older explicit IDs like "gemini-2.5-flash" are blocked for newly
    // created API keys, so the alias keeps the integration working.
    return google("gemini-flash-latest")
  }
  // Routed through the Vercel AI Gateway.
  return "google/gemini-flash-latest"
}

export const CAREER_AI_MODEL = resolveModel()

// AI features gracefully fall back to deterministic logic when no credential is set.
export function isAiEnabled() {
  return Boolean(GEMINI_API_KEY) || HAS_GATEWAY
}
