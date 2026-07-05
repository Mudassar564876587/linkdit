"use client"

import { useEffect } from "react"

export default function IncrementViews({ comparisonId }: { comparisonId: string }) {
  useEffect(() => {
    fetch(`/api/comparisons/${comparisonId}/views`, {
      method: "POST",
    }).catch(() => {})
  }, [comparisonId])

  return null
}
