"use client"

import { cn } from "@/lib/utils"
import { Trophy, Minus } from "lucide-react"

type WinnerBadgeProps = {
  winner: "A" | "B" | "tie"
  label: string
  reason: string
  toolAName: string
  toolBName: string
  index?: number
}

export default function WinnerBadge({ winner, label, reason, toolAName, toolBName, index = 0 }: WinnerBadgeProps) {
  const isTie = winner === "tie"
  const winnerName = isTie ? "Tie" : winner === "A" ? toolAName : toolBName

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:shadow-premium animate-fade-in-up",
        isTie
          ? "border-amber-200/60 bg-gradient-to-br from-amber-50/50 to-white"
          : "border-emerald-200/60 bg-gradient-to-br from-emerald-50/50 to-white"
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-current/[0.04] to-transparent rounded-full blur-2xl" />

      <div className="relative">
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full",
            isTie ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
          )}>
            {isTie ? <Minus className="h-4 w-4" /> : <Trophy className="h-4 w-4" />}
          </div>
          <span className="text-sm font-semibold text-foreground">{label}</span>
        </div>

        {!isTie && (
          <div className="mt-3">
            <span className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold",
              "bg-emerald-100 text-emerald-700"
            )}>
              <Trophy className="h-3 w-3" />
              {winnerName}
            </span>
          </div>
        )}

        {isTie && (
          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
              <Minus className="h-3 w-3" />
              Tie
            </span>
          </div>
        )}

        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          {reason}
        </p>
      </div>
    </div>
  )
}
