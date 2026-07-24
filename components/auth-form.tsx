"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { GraduationCap, Briefcase, Search, Users } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const USER_TYPES = [
  { value: "student", label: "Student", icon: GraduationCap },
  { value: "graduate", label: "Graduate", icon: Briefcase },
  { value: "job_seeker", label: "Job seeker", icon: Search },
  { value: "counsellor", label: "Counsellor", icon: Users },
]

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("student")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isSignUp = mode === "sign-up"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = isSignUp
      ? await authClient.signUp.email({ email, password, name, role } as {
          email: string
          password: string
          name: string
          role: string
        })
      : await authClient.signIn.email({ email, password })

    setLoading(false)

    if (error) {
      setError(error.message ?? "Something went wrong")
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      {/* Form side */}
      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <Link href="/" className="inline-block">
            <Logo />
          </Link>
          <div className="mt-8">
            <h1 className="font-serif text-3xl font-semibold tracking-tight">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {isSignUp
                ? "Start discovering careers that fit you."
                : "Sign in to continue your career journey."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            {isSignUp && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  placeholder="e.g. Aminata Kamara"
                />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                placeholder="At least 8 characters"
              />
            </div>

            {isSignUp && (
              <div className="flex flex-col gap-2">
                <Label>I am a...</Label>
                <div className="grid grid-cols-2 gap-2">
                  {USER_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setRole(t.value)}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors",
                        role === t.value
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border text-muted-foreground hover:bg-muted",
                      )}
                    >
                      <t.icon className="h-4 w-4" />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="mt-1 w-full">
              {loading ? "Please wait..." : isSignUp ? "Create account" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <Link
              href={isSignUp ? "/sign-in" : "/sign-up"}
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </Link>
          </p>
        </div>
      </div>

      {/* Brand side */}
      <div className="relative hidden overflow-hidden bg-primary lg:block">
        <div className="flex h-full flex-col justify-between p-12 text-primary-foreground">
          <Logo className="text-primary-foreground [&_span]:text-primary-foreground" />
          <div>
            <p className="font-serif text-3xl font-semibold leading-tight">
              Discover the right career path with AI.
            </p>
            <p className="mt-4 max-w-md leading-relaxed text-primary-foreground/85">
              Personalized guidance and real labour-market intelligence for the students, graduates, and job
              seekers of Sierra Leone.
            </p>
          </div>
          <div className="flex gap-8">
            <div>
              <p className="font-serif text-2xl font-semibold">16+</p>
              <p className="text-sm text-primary-foreground/80">Careers profiled</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-semibold">6</p>
              <p className="text-sm text-primary-foreground/80">Interest dimensions</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-semibold">AI</p>
              <p className="text-sm text-primary-foreground/80">Career advisor</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
