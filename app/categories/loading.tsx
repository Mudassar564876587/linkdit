import { Skeleton } from "@/components/ui/skeleton"

export default function CategoriesLoading() {
  return (
    <div className="bg-[#FAFBFF] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2.5">
            <Skeleton className="h-8 w-36 sm:h-9 sm:w-44" />
            <Skeleton className="h-5 w-72 sm:h-5 sm:w-96" />
          </div>
          <Skeleton className="h-11 w-full sm:w-72 lg:w-80 rounded-xl" />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-2xl border border-border/25 bg-white/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-3 w-14" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="rounded-[20px] border border-border/30 bg-white p-6">
              <div className="flex items-start gap-4">
                <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              <div className="mt-3.5 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
