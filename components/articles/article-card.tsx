import Link from "next/link"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

type ArticleCardProps = {
  title: string
  slug: string
  description: string
  coverImageUrl: string | null
  readTime: string
  publishedAt: string | null
  authorName: string
  featured: boolean
  categoryName?: string
}

export default function ArticleCard({
  title, slug, description, coverImageUrl, readTime,
  publishedAt, authorName, featured, categoryName,
}: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${slug}`}
      className={cn(
        "group card-depth overflow-hidden",
        featured && "ring-1 ring-primary/20"
      )}
      aria-label={`Read ${title}`}
    >
      {coverImageUrl ? (
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={coverImageUrl}
            alt=""
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
          <span className="text-3xl font-bold text-primary/30">{title.charAt(0)}</span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {featured && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              Featured
            </span>
          )}
          {categoryName && <span>{categoryName}</span>}
        </div>

        <h3 className="mt-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>

        <p className="mt-1 flex-1 text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            {publishedAt ? new Date(publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Draft"}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {readTime}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">By {authorName}</span>
          <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            Read more <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  )
}
