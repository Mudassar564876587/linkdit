"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams,
}: {
  currentPage: number
  totalPages: number
  basePath: string
  searchParams?: Record<string, string> | URLSearchParams
}) {
  if (totalPages <= 1) return null

  function href(page: number) {
    const params = searchParams instanceof URLSearchParams
      ? new URLSearchParams(searchParams.toString())
      : new URLSearchParams(searchParams)
    params.set("page", String(page))
    return `${basePath}?${params.toString()}`
  }

  const pages: (number | "...")[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...")
    }
  }

  return (
    <nav className="mb-16 flex items-center justify-center gap-2" aria-label="Pagination">
      {currentPage > 1 && (
        <Link
          href={href(currentPage - 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-white text-muted-foreground shadow-sm transition-all duration-200 hover:border-primary/20 hover:text-primary hover:shadow-md active:scale-95"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`e${i}`} className="flex h-10 w-10 items-center justify-center text-muted-foreground text-sm" aria-hidden="true">
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all duration-200 active:scale-95",
              p === currentPage
                ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg"
                : "border border-border/50 bg-white text-muted-foreground shadow-sm hover:border-primary/20 hover:text-primary hover:shadow-md"
            )}
            aria-label={`Page ${p}`}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={href(currentPage + 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-white text-muted-foreground shadow-sm transition-all duration-200 hover:border-primary/20 hover:text-primary hover:shadow-md active:scale-95"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </nav>
  )
}
