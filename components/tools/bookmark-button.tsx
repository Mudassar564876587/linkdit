"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bookmark } from "lucide-react"
import { addBookmark, removeBookmark } from "@/actions/dashboard/bookmarks"
import { cn } from "@/lib/utils"

export default function BookmarkButton({
  toolId,
  isBookmarked,
  isAuthenticated,
  className,
}: {
  toolId: string
  isBookmarked: boolean
  isAuthenticated: boolean
  className?: string
}) {
  const [loading, setLoading] = useState(false)
  const [bookmarked, setBookmarked] = useState(isBookmarked)
  const router = useRouter()

  async function toggle() {
    if (!isAuthenticated) {
      router.push("/login?redirectTo=" + encodeURIComponent(window.location.pathname))
      return
    }

    setLoading(true)
    if (bookmarked) {
      await removeBookmark(toolId)
    } else {
      await addBookmark(toolId)
    }
    setBookmarked(!bookmarked)
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        bookmarked
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:border-primary hover:text-primary",
        className
      )}
      title={bookmarked ? "Remove bookmark" : "Add bookmark"}
      aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-primary" : ""}`} aria-hidden="true" />
    </button>
  )
}
