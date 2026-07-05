import type { ComparisonFeature, ComparisonPricing, ComparisonRating } from "@/types/comparison"
import { Check, X } from "lucide-react"

type ComparisonTableProps = {
  features: ComparisonFeature[]
  pricing: ComparisonPricing[]
  ratings: ComparisonRating[]
  toolAName: string
  toolBName: string
}

export default function ComparisonTable({
  features,
  pricing,
  ratings,
  toolAName,
  toolBName,
}: ComparisonTableProps) {
  return (
    <div className="space-y-10">
      {/* Features */}
      {features.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-foreground">Features Comparison</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-foreground">Feature</th>
                  <th className="px-4 py-3 text-left font-medium text-foreground">{toolAName}</th>
                  <th className="px-4 py-3 text-left font-medium text-foreground">{toolBName}</th>
                </tr>
              </thead>
              <tbody>
                {features.map((f, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/30">
                    <td className="px-4 py-3 font-medium text-foreground">{f.name}</td>
                    <td className="px-4 py-3">
                      {typeof f.toolAValue === "boolean" ? (
                        f.toolAValue ? (
                          <Check className="h-5 w-5 text-emerald-500" aria-label="Yes" />
                        ) : (
                          <X className="h-5 w-5 text-red-400" aria-label="No" />
                        )
                      ) : (
                        <span className="text-muted-foreground">{f.toolAValue}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {typeof f.toolBValue === "boolean" ? (
                        f.toolBValue ? (
                          <Check className="h-5 w-5 text-emerald-500" aria-label="Yes" />
                        ) : (
                          <X className="h-5 w-5 text-red-400" aria-label="No" />
                        )
                      ) : (
                        <span className="text-muted-foreground">{f.toolBValue}</span>
                      )}
                    </td>
                  </tr>
                ))}
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
                  <th className="px-4 py-3 text-left font-medium text-foreground">{toolAName}</th>
                  <th className="px-4 py-3 text-left font-medium text-foreground">{toolBName}</th>
                </tr>
              </thead>
              <tbody>
                {pricing.map((p, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/30">
                    <td className="px-4 py-3 font-medium text-foreground">{p.aspect}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.toolAValue}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.toolBValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Ratings */}
      {ratings.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-foreground">Ratings Comparison</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-foreground">Aspect</th>
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
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[120px]">
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  winner === "A" ? "bg-emerald-500" : winner === "tie" ? "bg-amber-400" : "bg-muted-foreground/30"
                                }`}
                                style={{ width: `${(r.toolARating / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm font-medium text-foreground">{r.toolARating.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[120px]">
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  winner === "B" ? "bg-emerald-500" : winner === "tie" ? "bg-amber-400" : "bg-muted-foreground/30"
                                }`}
                                style={{ width: `${(r.toolBRating / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm font-medium text-foreground">{r.toolBRating.toFixed(1)}</span>
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
    </div>
  )
}
