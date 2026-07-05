import { getPublishedComparisons } from "@/services/comparisons.service"
import ComparisonCard from "@/components/comparisons/comparison-card"

export default async function ComparisonList({ search }: { search?: string }) {
  const comparisons = await getPublishedComparisons({
    search,
    sort: "recent",
  })

  if (comparisons.length === 0) {
    return (
      <div className="mt-4 rounded-xl border border-border bg-muted/30 p-12 text-center">
        <p className="text-muted-foreground">
          {search
            ? `No comparisons found for "${search}".`
            : "No comparisons yet. Check back soon!"}
        </p>
      </div>
    )
  }

  return (
    <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {comparisons.map((c) => (
        <ComparisonCard key={c.id} comparison={c} />
      ))}
    </div>
  )
}
