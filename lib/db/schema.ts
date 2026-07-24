import { pgTable, text, timestamp, boolean, serial, integer, jsonb } from "drizzle-orm/pg-core"

// --- Better Auth required tables -------------------------------------------
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  role: text("role").default("user"),
  banned: boolean("banned").default(false),
  banReason: text("banReason"),
  banExpires: timestamp("banExpires"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
})

// --- App tables ------------------------------------------------------------
export const assessment = pgTable("assessment", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  personalityType: text("personalityType"),
  scores: jsonb("scores").$type<Record<string, number>>(),
  answers: jsonb("answers").$type<Record<string, number>>(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const recommendation = pgTable("recommendation", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  assessmentId: integer("assessmentId"),
  careers: jsonb("careers").$type<RecommendedCareer[]>().notNull(),
  summary: text("summary"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const savedCareer = pgTable("saved_career", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  careerId: text("careerId").notNull(),
  careerTitle: text("careerTitle").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const resume = pgTable("resume", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  filename: text("filename").notNull(),
  content: text("content"),
  analysis: jsonb("analysis").$type<ResumeAnalysis>(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const chatMessage = pgTable("chat_message", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const userProfile = pgTable("user_profile", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull().unique(),
  headline: text("headline"),
  phone: text("phone"),
  district: text("district"),
  educationLevel: text("educationLevel"),
  fieldOfStudy: text("fieldOfStudy"),
  institution: text("institution"),
  bio: text("bio"),
  interests: text("interests"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const learningProgress = pgTable("learning_progress", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  resourceId: text("resourceId").notNull(),
  resourceTitle: text("resourceTitle").notNull(),
  status: text("status").notNull().default("in_progress"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export type UserProfile = typeof userProfile.$inferSelect

export type RecommendedCareer = {
  careerId: string
  title: string
  matchScore: number
  reason: string
}

export type ResumeAnalysis = {
  strengths: string[]
  gaps: string[]
  suggestions: string[]
  suggestedCareers: string[]
  score: number
}
