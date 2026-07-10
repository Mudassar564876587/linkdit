import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { Sparkles } from "lucide-react"

export default function CompareLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border border-blue-100/50 p-8 sm:p-12">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-10 w-80" />
            <Skeleton className="mt-3 h-5 w-96" />
          </div>

          <div className="mt-8">
            <Skeleton className="h-14 w-full rounded-2xl" />
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-background p-6">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-12 w-12 rounded-xl" />
                </div>
                <Skeleton className="mt-4 h-6 w-3/4" />
                <Skeleton className="mt-2 h-4 w-full" />
                <Skeleton className="mt-1 h-4 w-2/3" />
                <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
