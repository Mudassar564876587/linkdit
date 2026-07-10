"use client"

import { cn } from "@/lib/utils"
import { Trophy, Minus, GraduationCap, Code2, Building2, Megaphone, PenLine, Palette, Video, Terminal, Search, Users } from "lucide-react"
import type { UseCaseResult, WinnerResult, ToolSummary } from "@/types/comparison"

const useCaseIcons: Record<string, React.ReactNode> = {
  "students": <GraduationCap className="h-4 w-4" />,
  "developers": <Code2 className="h-4 w-4" />,
  "businesses": <Building2 className="h-4 w-4" />,
  "marketing": <Megaphone className="h-4 w-4" />,
  "content-creation": <PenLine className="h-4 w-4" />,
  "design": <Palette className="h-4 w-4" />,
  "video": <Video className="h-4 w-4" />,
  "coding": <Terminal className="h-4 w-4" />,
  "research": <Search className="h-4 w-4" />,
}

type Props = {
  toolA: ToolSummary
  toolB: ToolSummary
  useCases: UseCaseResult[]
  winners: WinnerResult[]
}

export default function ComparisonSummary({ toolA, toolB, useCases, winners }: Props) {
  const aWins = winners.filter(w => w.winner === "A").length
  const bWins = winners.filter(w => w.winner === "B").length

  return (
    <div className="mt-12 space-y-8">
      {/* Overall Winner */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-background via-primary/[0.02] to-background p-8 shadow-premium">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-primary/[0.05] to-transparent rounded-full blur-3xl" />
        <div className="relative text-center">
          <h2 className="text-xl font-semibold text-foreground">Overall Comparison</h2>
          <div className="mt-4 flex items-center justify-center gap-6 sm:gap-10">
            <div className="text-center">
              <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-white mx-auto ring-1 ring-border/50 shadow-soft overflow-hidden">
                {toolA.logoUrl ? (
                  <img src={toolA.logoUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-primary">{toolA.name.charAt(0)}</span>
                )}
              </div>
              <p className="mt-2 text-sm font-semibold text-foreground">{toolA.name}</p>
              <p className="text-2xl font-bold text-foreground">{toolA.rating.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">{aWins} wins</p>
            </div>
            <div className="text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <span className="text-sm font-bold text-muted-foreground">VS</span>
              </div>
            </div>
            <div className="text-center">
              <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-white mx-auto ring-1 ring-border/50 shadow-soft overflow-hidden">
                {toolB.logoUrl ? (
                  <img src={toolB.logoUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-primary">{toolB.name.charAt(0)}</span>
                )}
              </div>
              <p className="mt-2 text-sm font-semibold text-foreground">{toolB.name}</p>
              <p className="text-2xl font-bold text-foreground">{toolB.rating.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">{bWins} wins</p>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <span className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold",
              aWins > bWins ? "bg-emerald-100 text-emerald-700" :
              bWins > aWins ? "bg-blue-100 text-blue-700" :
              "bg-amber-100 text-amber-700"
            )}>
              <Trophy className="h-4 w-4" />
              {aWins > bWins ? `${toolA.name} wins ${aWins}-${bWins}` :
               bWins > aWins ? `${toolB.name} wins ${bWins}-${aWins}` :
               "It's a tie!"}
            </span>
          </div>
        </div>
      </div>

      {/* Use Case Summary */}
      {useCases.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            Which Tool is Better For...
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((uc, i) => (
              <div
                key={uc.useCase}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 hover:shadow-premium animate-fade-in-up",
                  uc.winner === "A"
                    ? "border-emerald-200/60 bg-gradient-to-br from-emerald-50/40 to-white"
                    : uc.winner === "B"
                    ? "border-blue-200/60 bg-gradient-to-br from-blue-50/40 to-white"
                    : "border-amber-200/40 bg-gradient-to-br from-amber-50/30 to-white"
                )}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center gap-2.5">
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg",
                    uc.winner === "A" ? "bg-emerald-100 text-emerald-600" :
                    uc.winner === "B" ? "bg-blue-100 text-blue-600" :
                    "bg-amber-100 text-amber-600"
                  )}>
                    {useCaseIcons[uc.useCase] || <Users className="h-4 w-4" />}
                  </div>
                  <span className="text-sm font-semibold text-foreground">{uc.label}</span>
                  <div className="ml-auto">
                    {uc.winner === "A" && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                        <Trophy className="h-3 w-3" /> {toolA.name}
                      </span>
                    )}
                    {uc.winner === "B" && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                        <Trophy className="h-3 w-3" /> {toolB.name}
                      </span>
                    )}
                    {uc.winner === "tie" && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                        <Minus className="h-3 w-3" /> Tie
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{uc.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
