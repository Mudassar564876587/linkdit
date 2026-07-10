import { getRelatedComparisons } from "@/services/comparisons.service"
import ComparisonCard from "@/components/comparisons/comparison-card"

export default async function RelatedComparisons({
  currentSlug,
  toolAId,
  toolBId,
}: {
  currentSlug: string
  toolAId: string
  toolBId: string
}) {
  const comparisons = await getRelatedComparisons(currentSlug, toolAId, toolBId)

  if (comparisons.length === 0) return null

  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground">Related Comparisons</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Comparisons involving the same tools
      </p>
      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {comparisons.map((c) => (
          <ComparisonCard key={c.id} comparison={c} />
        ))}
      </div>
    </div>
  )
}
