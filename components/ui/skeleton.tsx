import { cn } from "@/lib/utils"

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("rounded-xl bg-muted animate-pulse-soft", className)}
    />
  )
}

export function ToolCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-premium">
      <div className="flex items-start justify-between">
        <Skeleton className="h-12 w-12" />
        <Skeleton className="h-5 w-14" />
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  )
}

export function CategoryCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-premium">
      <Skeleton className="h-12 w-12" />
      <Skeleton className="mt-5 h-5 w-28" />
      <Skeleton className="mt-1 h-4 w-16" />
    </div>
  )
}

export function ArticleCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-premium">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  )
}
