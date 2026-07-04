export default function ToolDetailLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex animate-pulse gap-6">
          <div className="h-16 w-16 rounded-2xl bg-muted" />
          <div className="flex-1 space-y-3">
            <div className="h-8 w-64 rounded-lg bg-muted" />
            <div className="h-4 w-48 rounded-lg bg-muted" />
          </div>
        </div>
        <div className="mt-10 space-y-4">
          <div className="h-6 w-32 rounded-lg bg-muted" />
          <div className="h-24 w-full rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  )
}
