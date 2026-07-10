"use client"

import { useEffect } from "react"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function CompareError({ error, reset }: { error: Error; reset: () => void }) {
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
            Failed to load comparisons. Please try again.
          </p>
          <button
            onClick={reset}
            className="btn-primary mt-6"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
