export default function ComparisonLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 h-8 w-64 animate-pulse rounded-lg bg-muted" />
        <div className="mb-6 flex items-center gap-4">
          <div className="h-16 w-16 animate-pulse rounded-2xl bg-muted" />
          <div className="h-6 w-6 animate-pulse rounded bg-muted" />
          <div className="h-16 w-16 animate-pulse rounded-2xl bg-muted" />
        </div>
        <div className="mt-8 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 w-full animate-pulse rounded bg-muted" />
          ))}
        </div>
      </div>
    </div>
  )
}
