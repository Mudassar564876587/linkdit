import { Skeleton } from "@/components/ui/skeleton"

export default function ToolsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 via-white to-white">
      <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 h-8 w-48 animate-pulse rounded-full bg-muted" />
          <div className="mx-auto h-14 w-[500px] animate-pulse rounded-xl bg-muted" />
          <div className="mx-auto mt-4 h-5 w-96 animate-pulse rounded bg-muted" />
          <div className="mx-auto mt-20 h-12 w-[400px] animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-20 animate-pulse rounded-2xl bg-muted" />
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/50 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <Skeleton className="h-14 w-14 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-3.5 w-24" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-3/4" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Skeleton className="h-8 flex-1 rounded-xl" />
                <Skeleton className="h-8 w-16 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
