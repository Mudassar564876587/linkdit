import { Calendar, Clock, User } from "lucide-react"

export default function ArticleMeta({
  authorName, publishedAt, readTime,
}: {
  authorName: string
  publishedAt: string | null
  readTime: string
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <User className="h-4 w-4" aria-hidden="true" />
        {authorName}
      </span>
      {publishedAt && (
        <span className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" aria-hidden="true" />
          {new Date(publishedAt).toLocaleDateString("en-US", {
            month: "long", day: "numeric", year: "numeric",
          })}
        </span>
      )}
      <span className="flex items-center gap-1.5">
        <Clock className="h-4 w-4" aria-hidden="true" />
        {readTime}
      </span>
    </div>
  )
}
