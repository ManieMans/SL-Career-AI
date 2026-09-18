"use client"

import { useState } from "react"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const OPTIONS = [
  { label: "I like solving problems", result: "Technology & data" },
  { label: "I like helping people", result: "Health & community" },
  { label: "I like building things", result: "Business & engineering" },
]

export function FitChecker() {
  const [selected, setSelected] = useState<string | null>(null)
  const result = OPTIONS.find((option) => option.label === selected)?.result

  return (
    <div className="absolute -bottom-6 right-4 w-[min(19rem,calc(100%-2rem))] rounded-2xl border border-border bg-card p-4 shadow-xl sm:right-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Quick fit check</p>
          <p className="mt-1 text-sm font-semibold">What sounds most like you?</p>
        </div>
        <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary">30 sec</span>
      </div>
      <div className="mt-3 grid gap-2">
        {OPTIONS.map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => setSelected(option.label)}
            className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
              selected === option.label
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border text-muted-foreground hover:border-primary/50 hover:bg-muted"
            }`}
          >
            {option.label}
            {selected === option.label && <CheckCircle2 className="h-4 w-4 text-primary" />}
          </button>
        ))}
      </div>
      {result ? (
        <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-muted px-3 py-2">
          <p className="text-xs text-muted-foreground">You may enjoy <span className="font-semibold text-foreground">{result}</span></p>
          <Button size="sm" variant="ghost" className="h-7 px-2" asChild>
            <Link href="/sign-up" aria-label="Start the full assessment">
              Start <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      ) : null}
    </div>
  )
}
