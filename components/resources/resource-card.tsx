import Link from "next/link"
import { Download, ExternalLink, Star } from "lucide-react"
import { cn } from "@/lib/utils"

type ResourceCardProps = {
  name: string
  slug: string
  description: string | null
  coverImageUrl: string | null
  websiteUrl: string | null
  downloadUrl: string | null
  pricing: string
  featured: boolean
  categoryName: string | null
}

export default function ResourceCard({
  name, slug, description, coverImageUrl, websiteUrl,
  downloadUrl, pricing, featured, categoryName,
}: ResourceCardProps) {
  return (
    <Link
      href={`/resources/${slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        featured && "ring-1 ring-primary/20"
      )}
      aria-label={`View ${name}`}
    >
      {coverImageUrl ? (
        <div className="aspect-[16/9] overflow-hidden">
          <img src={coverImageUrl} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
        </div>
      ) : (
        <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
          <span className="text-3xl font-bold text-primary/30">{name.charAt(0)}</span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
              <Star className="h-3 w-3 fill-amber-500" /> Featured
            </span>
          )}
          {categoryName && <span>{categoryName}</span>}
        </div>

        <h3 className="mt-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {name}
        </h3>

        <p className="mt-1 flex-1 text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className={cn(
            "rounded-md px-2.5 py-0.5 text-xs font-medium",
            pricing === "Free" ? "bg-emerald-50 text-emerald-700" :
            pricing === "Freemium" ? "bg-amber-50 text-amber-700" :
            "bg-violet-50 text-violet-700"
          )}>
            {pricing}
          </span>
          <div className="flex items-center gap-1.5">
            {downloadUrl && <Download className="h-3.5 w-3.5 text-muted-foreground" />}
            {websiteUrl && !downloadUrl && <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />}
          </div>
        </div>
      </div>
    </Link>
  )
}
