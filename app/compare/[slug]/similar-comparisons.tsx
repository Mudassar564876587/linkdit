import { getSimilarComparisons } from "@/services/comparisons.service"
import ComparisonCard from "@/components/comparisons/comparison-card"

export default async function SimilarComparisons({
  currentId,
  categoryId,
}: {
  currentId: string
  categoryId: string | null
}) {
  const comparisons = await getSimilarComparisons(currentId, categoryId)

  if (comparisons.length === 0) return null

  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground">Similar Comparisons</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Other comparisons you might find useful
      </p>
      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {comparisons.map((c) => (
          <ComparisonCard key={c.id} comparison={c} />
        ))}
      </div>
    </div>
  )
}
