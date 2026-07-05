import type { ComparisonFeature, ComparisonPricing, ComparisonRating } from "@/types/comparison"
import { Check, X, Minus } from "lucide-react"

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
}: ComparisonTableProps) {
  const overallWinner =
    toolA.rating > toolB.rating ? "A" : toolB.rating > toolA.rating ? "B" : "tie"

  function winnerClass(w: string) {
    if (w === "A") return "bg-emerald-50 text-emerald-700"
    if (w === "B") return "bg-blue-50 text-blue-700"
    return "text-muted-foreground"
  }

  function winnerIcon(w: string) {
    if (w === "A") return "← Winner"
    if (w === "B") return "Winner →"
    return ""
  }

  return (
    <div className="space-y-10">
      {/* Overall Score */}
      <section>
        <h2 className="text-xl font-semibold text-foreground">Overall Comparison</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className={`rounded-xl border p-5 ${overallWinner === "A" ? "border-emerald-200 bg-emerald-50/50" : "border-border"}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">{toolAName}</h3>
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">{toolA.pricing}</span>
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-foreground">{toolA.rating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">/ 5</span>
              <span className="ml-2 text-xs text-muted-foreground">({toolA.reviewCount} reviews)</span>
            </div>
          </div>
          <div className={`rounded-xl border p-5 ${overallWinner === "B" ? "border-emerald-200 bg-emerald-50/50" : "border-border"}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">{toolBName}</h3>
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">{toolB.pricing}</span>
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-foreground">{toolB.rating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">/ 5</span>
              <span className="ml-2 text-xs text-muted-foreground">({toolB.reviewCount} reviews)</span>
            </div>
          </div>
        </div>
        {overallWinner !== "tie" && (
          <p className="mt-3 text-center text-sm text-muted-foreground">
            <span className={`font-medium ${overallWinner === "A" ? "text-emerald-600" : "text-blue-600"}`}>
              {overallWinner === "A" ? toolAName : toolBName}
            </span>{" "}
            has a higher overall rating.
          </p>
        )}
      </section>

      {/* Features */}
      {features.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-foreground">Features Comparison</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-foreground">Feature</th>
                  <th className="px-4 py-3 text-left font-medium text-foreground min-w-[140px]">{toolAName}</th>
                  <th className="px-4 py-3 text-left font-medium text-foreground min-w-[140px]">{toolBName}</th>
                </tr>
              </thead>
              <tbody>
                {features.map((f, i) => {
                  const aWin = typeof f.toolAValue === "boolean" ? (f.toolAValue && !f.toolBValue)
                    : typeof f.toolBValue === "boolean" ? false
                    : String(f.toolAValue).toLowerCase() === "yes" && String(f.toolBValue).toLowerCase() !== "yes"
                  const bWin = typeof f.toolBValue === "boolean" ? (f.toolBValue && !f.toolAValue)
                    : typeof f.toolAValue === "boolean" ? false
                    : String(f.toolBValue).toLowerCase() === "yes" && String(f.toolAValue).toLowerCase() !== "yes"
                  return (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/30">
                      <td className="px-4 py-3 font-medium text-foreground">{f.name}</td>
                      <td className={`px-4 py-3 ${aWin ? "bg-emerald-50/50" : ""}`}>
                        {renderFeatureValue(f.toolAValue)}
                      </td>
                      <td className={`px-4 py-3 ${bWin ? "bg-emerald-50/50" : ""}`}>
                        {renderFeatureValue(f.toolBValue)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Pricing */}
      {pricing.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-foreground">Pricing Comparison</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-foreground">Aspect</th>
                  <th className="px-4 py-3 text-left font-medium text-foreground min-w-[140px]">{toolAName}</th>
                  <th className="px-4 py-3 text-left font-medium text-foreground min-w-[140px]">{toolBName}</th>
                </tr>
              </thead>
              <tbody>
                {pricing.map((p, i) => {
                  const aCheaper = typeof p.toolAValue === "number" && typeof p.toolBValue === "number"
                    ? p.toolAValue < p.toolBValue
                    : false
                  const bCheaper = typeof p.toolAValue === "number" && typeof p.toolBValue === "number"
                    ? p.toolBValue < p.toolAValue
                    : false
                  return (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/30">
                      <td className="px-4 py-3 font-medium text-foreground">{p.aspect}</td>
                      <td className={`px-4 py-3 text-muted-foreground ${aCheaper ? "bg-emerald-50/50 font-medium text-emerald-700" : ""}`}>
                        {p.toolAValue}
                      </td>
                      <td className={`px-4 py-3 text-muted-foreground ${bCheaper ? "bg-emerald-50/50 font-medium text-emerald-700" : ""}`}>
                        {p.toolBValue}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Ratings */}
      {ratings.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-foreground">Ratings Breakdown</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-foreground">Category</th>
                  <th className="px-4 py-3 text-left font-medium text-foreground">{toolAName}</th>
                  <th className="px-4 py-3 text-left font-medium text-foreground">{toolBName}</th>
                </tr>
              </thead>
              <tbody>
                {ratings.map((r, i) => {
                  const winner = r.toolARating > r.toolBRating ? "A" : r.toolBRating > r.toolARating ? "B" : "tie"
                  return (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/30">
                      <td className="px-4 py-3 font-medium text-foreground">{r.aspect}</td>
                      <td className={`px-4 py-3 ${winner === "A" ? "bg-emerald-50/30" : ""}`}>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 max-w-[160px]">
                            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  winner === "A" ? "bg-emerald-500" : winner === "tie" ? "bg-amber-400" : "bg-muted-foreground/30"
                                }`}
                                style={{ width: `${(r.toolARating / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm font-semibold text-foreground min-w-[2ch]">{r.toolARating.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className={`px-4 py-3 ${winner === "B" ? "bg-emerald-50/30" : ""}`}>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 max-w-[160px]">
                            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  winner === "B" ? "bg-emerald-500" : winner === "tie" ? "bg-amber-400" : "bg-muted-foreground/30"
                                }`}
                                style={{ width: `${(r.toolBRating / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm font-semibold text-foreground min-w-[2ch]">{r.toolBRating.toFixed(1)}</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Last Updated */}
      {updatedAt && (
        <p className="text-xs text-muted-foreground text-right">
          Last updated: {new Date(updatedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}
    </div>
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
