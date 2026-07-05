"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

export default function ComparisonSearch({ initialQuery }: { initialQuery?: string }) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery || "")

  const debouncedSearch = useCallback(
    (value: string) => {
      if (value) {
        router.push(`/compare?q=${encodeURIComponent(value)}`)
      } else {
        router.push("/compare")
      }
    },
    [router]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== initialQuery) {
        debouncedSearch(query)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [query, debouncedSearch, initialQuery])

  return (
    <div className="relative mx-auto max-w-2xl">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search comparisons..."
        className="h-12 w-full rounded-xl border border-border bg-background pl-12 pr-4 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label="Search comparisons"
      />
    </div>
  )
}
