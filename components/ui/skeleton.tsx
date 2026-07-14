import { cn } from "@/lib/utils"

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("rounded-xl bg-gradient-to-r from-muted via-muted/80 to-muted animate-shimmer", className)} />
}

export function ToolCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/50 bg-white p-5 shadow-premium-card">
      <div className="flex items-start gap-4">
        <Skeleton className="h-14 w-14 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2.5">
          <div className="flex items-start gap-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-12 rounded-full" />
          </div>
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-3/4" />
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border/30 pt-4">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-3.5 w-12" />
        </div>
        <Skeleton className="h-3.5 w-16" />
      </div>
    </div>
  )
}

export function CategoryCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/50 bg-white p-5 shadow-premium-card">
      <div className="flex items-start gap-4">
        <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-3.5 w-16" />
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-2/3" />
      </div>
      <div className="mt-4 border-t border-border/30 pt-4">
        <Skeleton className="h-3.5 w-24" />
      </div>
    </div>
  )
}

export function ArticleCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-white shadow-premium-card">
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-4 w-28 rounded-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center justify-between border-t border-border/30 pt-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  )
}
