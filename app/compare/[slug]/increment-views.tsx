"use client"

import { useEffect } from "react"

export default function IncrementViews({
  comparisonId,
  slug,
  title,
  toolAName,
  toolBName,
}: {
  comparisonId: string
  slug: string
  title?: string
  toolAName: string
  toolBName: string
}) {
  useEffect(() => {
    fetch(`/api/comparisons/${comparisonId}/views`, {
      method: "POST",
    }).catch(() => {})

    try {
      const stored = localStorage.getItem("recentlyCompared")
      const recent = stored ? JSON.parse(stored) : []
      const entry = { slug, title, toolAName, toolBName }
      const filtered = recent.filter((r: any) => r.slug !== slug)
      filtered.unshift(entry)
      localStorage.setItem("recentlyCompared", JSON.stringify(filtered.slice(0, 10)))
    } catch {}
  }, [comparisonId, slug, title, toolAName, toolBName])

  return null
}
