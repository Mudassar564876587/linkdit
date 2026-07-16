"use client"

import { AlertTriangle } from "lucide-react"

export default function CategoriesError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#FAFBFF]">
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50">
          <AlertTriangle className="h-7 w-7 text-rose-500" />
        </div>
        <h1 className="mt-4 text-xl font-semibold text-foreground">Something went wrong</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Failed to load categories. Please try again.</p>
        <button onClick={reset} className="btn-primary mt-6 inline-flex">
          Try again
        </button>
      </div>
    </div>
  )
}
