"use client"

import { useEffect } from "react"
import Link from "next/link"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react"

export default function ComparisonError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="mx-auto max-w-md px-4 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-foreground">Something went wrong</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Failed to load this comparison. Please try again.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button onClick={reset} className="btn-primary">
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
            <Link href="/compare" className="btn-secondary">
              <ArrowLeft className="h-4 w-4" />
              Back to comparisons
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
