"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { removeBookmark } from "@/actions/dashboard/bookmarks"
import { useState } from "react"

type Bookmark = {
  id: string
  created_at: string
  tool_id: string | null
  tools: {
    id: string
    name: string
    slug: string
    description: string
    logo_url: string | null
    rating: number
    pricing: string
  }
}

export default function BookmarksList({ bookmarks }: { bookmarks: Bookmark[] }) {
  const router = useRouter()
  const [removing, setRemoving] = useState<string | null>(null)

  if (!bookmarks.length) {
    return (
      <div className="rounded-xl border border-border p-8 text-center">
        <p className="text-muted-foreground">No bookmarks yet.</p>
        <Link href="/" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">
          Browse AI tools
        </Link>
      </div>
    )
  }

  async function handleRemove(id: string) {
    setRemoving(id)
    await removeBookmark(id)
    router.refresh()
  }

  return (
    <div className="space-y-3">
      {bookmarks.map((b) => (
        <div
          key={b.id}
          className="flex items-center gap-4 rounded-xl border border-border bg-background p-4 shadow-sm"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
            {b.tools.name.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <Link
              href={`/tools/${b.tools.slug}`}
              className="text-sm font-medium text-foreground hover:underline"
            >
              {b.tools.name}
            </Link>
            <p className="truncate text-xs text-muted-foreground">{b.tools.description}</p>
            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
              <span>{b.tools.rating}/5</span>
              <span>{b.tools.pricing}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/tools/${b.tools.slug}`}>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(b.id)}
              disabled={removing === b.id}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
