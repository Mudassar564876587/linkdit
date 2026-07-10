import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { Skeleton } from "@/components/ui/skeleton"

export default function ComparisonLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-4 w-40" />
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border border-blue-100/50 p-6 sm:p-10">
            <div className="flex items-center gap-4 sm:gap-6">
              <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl" />
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl" />
            </div>
            <Skeleton className="mt-4 h-8 w-72" />
            <Skeleton className="mt-2 h-5 w-96" />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>

          <div className="mt-8 space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
