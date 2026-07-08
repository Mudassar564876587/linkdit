"use client"

import { useRouter } from "next/navigation"
import { Trash2, Star } from "lucide-react"
import {
  adminDeleteComparison,
  adminToggleComparisonPublish,
  adminToggleComparisonFeatured,
} from "@/actions/admin/comparisons"

export default function ComparisonActions({
  id,
  isPublished,
  isFeatured,
}: {
  id: string
  isPublished?: boolean
  isFeatured?: boolean
}) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm("Delete this comparison?")) return
    await adminDeleteComparison(id)
    router.refresh()
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={async () => {
          await adminToggleComparisonPublish(id, !isPublished)
          router.refresh()
        }}
        className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
          isPublished ? "text-emerald-500" : "text-muted-foreground hover:bg-accent"
        }`}
        title={isPublished ? "Unpublish" : "Publish"}
      >
        <span
          className={`h-2 w-2 rounded-full ${isPublished ? "bg-emerald-500" : "bg-gray-300"}`}
        />
      </button>
      <button
        onClick={async () => {
          await adminToggleComparisonFeatured(id, !isFeatured)
          router.refresh()
        }}
        className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
          isFeatured ? "text-amber-500 bg-amber-50" : "text-muted-foreground hover:bg-accent"
        }`}
        title={isFeatured ? "Unfeature" : "Feature"}
      >
        <Star className={`h-4 w-4 ${isFeatured ? "fill-amber-500" : ""}`} />
      </button>
      <button
        onClick={handleDelete}
        className="flex h-7 w-7 items-center justify-center rounded-md text-red-500 hover:bg-red-50"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}
