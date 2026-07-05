import Link from "next/link"

type TocItem = { id: string; text: string; level: number }

export default function TableOfContents({ content }: { content: string }) {
  const items: TocItem[] = []
  const regex = /<h([2-3])\s+id="([^"]+)"[^>]*>([^<]+)<\/h[2-3]>/gi
  let match: RegExpExecArray | null
  while ((match = regex.exec(content)) !== null) {
    items.push({ id: match[2], text: match[3], level: Number(match[1]) })
  }

  if (items.length < 2) return null

  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <h2 className="text-sm font-semibold text-foreground mb-3">Table of Contents</h2>
      <nav aria-label="Table of contents">
        <ul className="space-y-1.5">
          {items.map((item) => (
            <li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 12}px` }}>
              <Link
                href={`#${item.id}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
