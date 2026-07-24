import { Compass } from "lucide-react"
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold tracking-tight", className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Compass className="h-5 w-5" />
      </span>
      <span className="text-lg">
        Career<span className="text-primary">AI</span>
      </span>
    </span>
  )
}
