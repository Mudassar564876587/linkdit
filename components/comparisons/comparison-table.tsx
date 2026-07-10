"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ComparisonFeature, ComparisonPricing, ComparisonRating } from "@/types/comparison"
import { Check, X, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

type ComparisonTableProps = {
  features: ComparisonFeature[]
  pricing: ComparisonPricing[]
  ratings: ComparisonRating[]
  toolAName: string
  toolBName: string
  toolA: { pricing: string; rating: number; reviewCount: number }
  toolB: { pricing: string; rating: number; reviewCount: number }
  createdAt?: string
  updatedAt?: string
  toolAFeatures?: string[]
  toolBFeatures?: string[]
}

export default function ComparisonTable({
  features,
  pricing,
  ratings,
  toolAName,
  toolBName,
  toolA,
  toolB,
  updatedAt,
  toolAFeatures,
  toolBFeatures,
}: ComparisonTableProps) {
  const overallWinner =
    toolA.rating > toolB.rating ? "A" : toolB.rating > toolA.rating ? "B" : "tie"

  const autoFeatures = buildAutoFeatures(toolAFeatures, toolBFeatures)

  const allFeatures = features.length > 0 ? features : autoFeatures

  return (
    <div className="space-y-10">
      <OverallScoreSection
        toolAName={toolAName}
        toolBName={toolBName}
        toolA={toolA}
        toolB={toolB}
        overallWinner={overallWinner}
      />

      {allFeatures.length > 0 && (
        <FeatureComparisonSection
          features={allFeatures}
          toolAName={toolAName}
          toolBName={toolBName}
        />
      )}

      {pricing.length > 0 && (
        <PricingComparisonSection
          pricing={pricing}
          toolAName={toolAName}
          toolBName={toolBName}
        />
      )}

      {ratings.length > 0 && (
        <RatingsBreakdownSection
          ratings={ratings}
          toolAName={toolAName}
          toolBName={toolBName}
        />
      )}

      {updatedAt && (
        <p className="text-xs text-muted-foreground text-right">
          Last updated: {new Date(updatedAt).toLocaleDateString("en-US", {
            year: "numeric", month: "long", day: "numeric",
          })}
        </p>
      )}
    </div>
  )
}

function OverallScoreSection({ toolAName, toolBName, toolA, toolB, overallWinner }: {
  toolAName: string; toolBName: string; toolA: any; toolB: any; overallWinner: string
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
        <Trophy className="h-5 w-5 text-amber-500" />
        Overall Score
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {[
          { tool: toolA, name: toolAName, isWinner: overallWinner === "A" },
          { tool: toolB, name: toolBName, isWinner: overallWinner === "B" },
        ].map(({ tool, name, isWinner }) => (
          <div
            key={name}
            className={cn(
              "relative overflow-hidden rounded-2xl border p-6 transition-all duration-200",
              isWinner ? "border-emerald-200 bg-gradient-to-br from-emerald-50/60 to-white shadow-soft" : "border-border/80 bg-background shadow-soft"
            )}
          >
            {isWinner && (
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                  <Trophy className="h-3 w-3" /> Winner
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">{name}</h3>
              <span className="rounded-lg bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary">
                {tool.pricing}
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-foreground">{tool.rating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">/ 5</span>
              {tool.reviewCount > 0 && (
                <span className="ml-2 text-xs text-muted-foreground">({tool.reviewCount.toLocaleString()} reviews)</span>
              )}
            </div>
          </div>
        ))}
      </div>
      {overallWinner !== "tie" && (
        <p className="mt-3 text-center text-sm text-muted-foreground">
          <span className={cn("font-semibold", overallWinner === "A" ? "text-emerald-600" : "text-blue-600")}>
            {overallWinner === "A" ? toolAName : toolBName}
          </span> has a higher overall rating.
        </p>
      )}
    </section>
  )
}

function FeatureComparisonSection({ features, toolAName, toolBName }: {
  features: ComparisonFeature[]; toolAName: string; toolBName: string
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-foreground">Features Comparison</h2>
      <div className="mt-4 overflow-hidden rounded-2xl border border-border/80 shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-5 py-3.5 text-left font-medium text-foreground">Feature</th>
                <th className="px-5 py-3.5 text-left font-medium text-foreground min-w-[160px]">{toolAName}</th>
                <th className="px-5 py-3.5 text-left font-medium text-foreground min-w-[160px]">{toolBName}</th>
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => {
                const aWin = isWinner(f.toolAValue, f.toolBValue)
                const bWin = isWinner(f.toolBValue, f.toolAValue)
                return (
                  <tr key={i} className={cn(
                    "border-b border-border/50 last:border-0 transition-colors",
                    i % 2 === 0 ? "bg-background" : "bg-muted/20"
                  )}>
                    <td className="px-5 py-3.5 font-medium text-foreground">{f.name}</td>
                    <td className={cn("px-5 py-3.5", aWin && "bg-emerald-50/50")}>
                      <div className="flex items-center gap-2">
                        {renderFeatureValue(f.toolAValue)}
                        {aWin && <Trophy className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                      </div>
                    </td>
                    <td className={cn("px-5 py-3.5", bWin && "bg-emerald-50/50")}>
                      <div className="flex items-center gap-2">
                        {renderFeatureValue(f.toolBValue)}
                        {bWin && <Trophy className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function PricingComparisonSection({ pricing, toolAName, toolBName }: {
  pricing: ComparisonPricing[]; toolAName: string; toolBName: string
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-foreground">Pricing Comparison</h2>
      <div className="mt-4 overflow-hidden rounded-2xl border border-border/80 shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-5 py-3.5 text-left font-medium text-foreground">Aspect</th>
                <th className="px-5 py-3.5 text-left font-medium text-foreground min-w-[160px]">{toolAName}</th>
                <th className="px-5 py-3.5 text-left font-medium text-foreground min-w-[160px]">{toolBName}</th>
              </tr>
            </thead>
            <tbody>
              {pricing.map((p, i) => {
                const aCheaper = typeof p.toolAValue === "number" && typeof p.toolBValue === "number"
                  ? p.toolAValue < p.toolBValue : false
                const bCheaper = typeof p.toolAValue === "number" && typeof p.toolBValue === "number"
                  ? p.toolBValue < p.toolAValue : false
                return (
                  <tr key={i} className={cn(
                    "border-b border-border/50 last:border-0 transition-colors",
                    i % 2 === 0 ? "bg-background" : "bg-muted/20"
                  )}>
                    <td className="px-5 py-3.5 font-medium text-foreground">{p.aspect}</td>
                    <td className={cn("px-5 py-3.5", aCheaper && "bg-emerald-50/50")}>
                      <div className="flex items-center gap-2">
                        <span className={aCheaper ? "font-semibold text-emerald-700" : "text-muted-foreground"}>
                          {p.toolAValue}
                        </span>
                        {aCheaper && <Trophy className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                      </div>
                    </td>
                    <td className={cn("px-5 py-3.5", bCheaper && "bg-emerald-50/50")}>
                      <div className="flex items-center gap-2">
                        <span className={bCheaper ? "font-semibold text-emerald-700" : "text-muted-foreground"}>
                          {p.toolBValue}
                        </span>
                        {bCheaper && <Trophy className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function RatingsBreakdownSection({ ratings, toolAName, toolBName }: {
  ratings: ComparisonRating[]; toolAName: string; toolBName: string
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-foreground">Ratings Breakdown</h2>
      <div className="mt-4 overflow-hidden rounded-2xl border border-border/80 shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-5 py-3.5 text-left font-medium text-foreground">Category</th>
                <th className="px-5 py-3.5 text-left font-medium text-foreground">{toolAName}</th>
                <th className="px-5 py-3.5 text-left font-medium text-foreground">{toolBName}</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((r, i) => {
                const winner = r.toolARating > r.toolBRating ? "A" : r.toolBRating > r.toolARating ? "B" : "tie"
                return (
                  <tr key={i} className={cn(
                    "border-b border-border/50 last:border-0 transition-colors",
                    i % 2 === 0 ? "bg-background" : "bg-muted/20"
                  )}>
                    <td className="px-5 py-3.5 font-medium text-foreground">{r.aspect}</td>
                    <td className={cn("px-5 py-3.5", winner === "A" && "bg-emerald-50/40")}>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-[160px]">
                          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all",
                                winner === "A" ? "bg-emerald-500" : winner === "tie" ? "bg-amber-400" : "bg-muted-foreground/30"
                              )}
                              style={{ width: `${(r.toolARating / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-foreground min-w-[2ch]">{r.toolARating.toFixed(1)}</span>
                        {winner === "A" && <Trophy className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                      </div>
                    </td>
                    <td className={cn("px-5 py-3.5", winner === "B" && "bg-emerald-50/40")}>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-[160px]">
                          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all",
                                winner === "B" ? "bg-emerald-500" : winner === "tie" ? "bg-amber-400" : "bg-muted-foreground/30"
                              )}
                              style={{ width: `${(r.toolBRating / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-foreground min-w-[2ch]">{r.toolBRating.toFixed(1)}</span>
                        {winner === "B" && <Trophy className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function renderFeatureValue(value: string | boolean) {
  if (typeof value === "boolean") {
    return value
      ? <Check className="h-5 w-5 text-emerald-500" aria-label="Yes" />
      : <X className="h-5 w-5 text-red-400" aria-label="No" />
  }
  const lower = value.toLowerCase()
  if (lower === "yes" || lower === "true" || lower === "available") {
    return <Check className="h-5 w-5 text-emerald-500" aria-label={value} />
  }
  if (lower === "no" || lower === "false" || lower === "unavailable" || lower === "none") {
    return <X className="h-5 w-5 text-red-400" aria-label={value} />
  }
  return <span className="text-muted-foreground">{value}</span>
}

function isWinner(aValue: string | boolean, bValue: string | boolean): boolean {
  const aYes = aValue === true || String(aValue).toLowerCase() === "yes" || String(aValue).toLowerCase() === "available" || String(aValue).toLowerCase() === "true"
  const bYes = bValue === true || String(bValue).toLowerCase() === "yes" || String(bValue).toLowerCase() === "available" || String(bValue).toLowerCase() === "true"
  return aYes && !bYes
}

function buildAutoFeatures(toolAFeatures?: string[], toolBFeatures?: string[]): ComparisonFeature[] {
  if (!toolAFeatures || !toolBFeatures) return []
  if (toolAFeatures.length === 0 && toolBFeatures.length === 0) return []

  const all = new Set<string>()
  for (const f of toolAFeatures) all.add(f)
  for (const f of toolBFeatures) all.add(f)

  return Array.from(all).map((name) => ({
    name,
    toolAValue: toolAFeatures.includes(name),
    toolBValue: toolBFeatures.includes(name),
  }))
}
