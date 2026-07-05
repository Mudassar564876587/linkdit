"use client"

import { useCallback } from "react"
import { Link2, Globe, Mail, Share2 } from "lucide-react"

export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const encoded = encodeURIComponent(url)
  const text = encodeURIComponent(title)

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(url)
  }, [url])

  const links = [
    { icon: Globe, href: `https://twitter.com/intent/tweet?url=${encoded}&text=${text}`, label: "Share on Twitter" },
    { icon: Globe, href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`, label: "Share on Facebook" },
    { icon: Globe, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`, label: "Share on LinkedIn" },
    { icon: Mail, href: `mailto:?subject=${text}&body=${encoded}`, label: "Share via Email" },
  ]

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-foreground">Share</span>
      <div className="flex items-center gap-1">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            aria-label={l.label}
          >
            <l.icon className="h-4 w-4" />
          </a>
        ))}
        <button
          onClick={copyLink}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          aria-label="Copy link"
        >
          <Link2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
