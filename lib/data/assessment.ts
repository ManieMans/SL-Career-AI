// RIASEC (Holland Codes) based career interest assessment
export type Riasec = "Realistic" | "Investigative" | "Artistic" | "Social" | "Enterprising" | "Conventional"

export type Question = {
  id: string
  text: string
  dimension: Riasec
}

export const RIASEC_INFO: Record<Riasec, { label: string; short: string; description: string }> = {
  Realistic: {
    label: "Realistic",
    short: "The Doer",
    description: "Practical, hands-on, enjoys working with tools, machines, plants, or the outdoors.",
  },
  Investigative: {
    label: "Investigative",
    short: "The Thinker",
    description: "Analytical, curious, enjoys solving problems, research, and understanding how things work.",
  },
  Artistic: {
    label: "Artistic",
    short: "The Creator",
    description: "Imaginative, expressive, enjoys creativity, design, writing, and self-expression.",
  },
  Social: {
    label: "Social",
    short: "The Helper",
    description: "Empathetic, cooperative, enjoys teaching, helping, and working with people.",
  },
  Enterprising: {
    label: "Enterprising",
    short: "The Persuader",
    description: "Ambitious, persuasive, enjoys leading, selling, and starting ventures.",
  },
  Conventional: {
    label: "Conventional",
    short: "The Organizer",
    description: "Detail-oriented, organized, enjoys structure, data, and working with systems.",
  },
}

export const QUESTIONS: Question[] = [
  { id: "q1", text: "I enjoy fixing or building things with my hands.", dimension: "Realistic" },
  { id: "q2", text: "I like working outdoors or with plants, animals, or machines.", dimension: "Realistic" },
  { id: "q3", text: "I prefer practical tasks over abstract ideas.", dimension: "Realistic" },
  { id: "q4", text: "I enjoy solving complex problems and puzzles.", dimension: "Investigative" },
  { id: "q5", text: "I like to research topics deeply to understand how they work.", dimension: "Investigative" },
  { id: "q6", text: "I am curious about science, data, and experiments.", dimension: "Investigative" },
  { id: "q7", text: "I enjoy expressing myself through art, music, or writing.", dimension: "Artistic" },
  { id: "q8", text: "I like coming up with original and creative ideas.", dimension: "Artistic" },
  { id: "q9", text: "I prefer flexible environments over strict routines.", dimension: "Artistic" },
  { id: "q10", text: "I enjoy helping and teaching other people.", dimension: "Social" },
  { id: "q11", text: "I feel fulfilled when I improve someone's wellbeing.", dimension: "Social" },
  { id: "q12", text: "I am a good listener and people come to me for advice.", dimension: "Social" },
  { id: "q13", text: "I like leading teams and persuading others.", dimension: "Enterprising" },
  { id: "q14", text: "I am interested in starting my own business one day.", dimension: "Enterprising" },
  { id: "q15", text: "I enjoy taking risks to achieve big goals.", dimension: "Enterprising" },
  { id: "q16", text: "I like organizing information and keeping things in order.", dimension: "Conventional" },
  { id: "q17", text: "I am comfortable working with numbers and records.", dimension: "Conventional" },
  { id: "q18", text: "I prefer clear instructions and structured tasks.", dimension: "Conventional" },
]

export const LIKERT_OPTIONS = [
  { value: 1, label: "Strongly disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly agree" },
]

export function scoreAssessment(answers: Record<string, number>) {
  const totals: Record<Riasec, number> = {
    Realistic: 0,
    Investigative: 0,
    Artistic: 0,
    Social: 0,
    Enterprising: 0,
    Conventional: 0,
  }
  const counts: Record<Riasec, number> = {
    Realistic: 0,
    Investigative: 0,
    Artistic: 0,
    Social: 0,
    Enterprising: 0,
    Conventional: 0,
  }

  for (const q of QUESTIONS) {
    const a = answers[q.id]
    if (a) {
      totals[q.dimension] += a
      counts[q.dimension] += 1
    }
  }

  const scores: Record<string, number> = {}
  for (const dim of Object.keys(totals) as Riasec[]) {
    const max = counts[dim] * 5
    scores[dim] = max > 0 ? Math.round((totals[dim] / max) * 100) : 0
  }

  const sorted = (Object.entries(scores) as [Riasec, number][]).sort((a, b) => b[1] - a[1])
  const personalityType = sorted
    .slice(0, 3)
    .map(([dim]) => dim[0])
    .join("")

  return { scores, personalityType, topDimensions: sorted.slice(0, 3).map(([dim]) => dim) as Riasec[] }
}
