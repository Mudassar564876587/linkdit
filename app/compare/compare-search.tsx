"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, ArrowRightLeft, X, ArrowDown, ArrowUp, Loader2, Check, TrendingUp, Clock, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

type ToolResult = {
  id: string
  name: string
  slug: string
  logoUrl: string | null
  pricing: string
  rating: number
  reviewCount: number
  categoryName: string | null
}

const POPULAR_COMPARISONS = [
  { a: "ChatGPT", b: "Claude", slug: "chatgpt-vs-claude" },
  { a: "Claude", b: "Gemini", slug: "claude-vs-gemini" },
  { a: "Cursor", b: "Copilot", slug: "cursor-vs-copilot" },
  { a: "Midjourney", b: "DALL-E", slug: "midjourney-vs-dalle3" },
]

const RECENT_SEARCHES_KEY = "linkdit_recent_tool_searches"

function loadRecentSearches(): string[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export default function CompareSearch({
  initialQuery,
  initialToolA,
  initialToolB,
}: {
  initialQuery?: string
  initialToolA?: string
  initialToolB?: string
}) {
  const router = useRouter()
  const [step, setStep] = useState<"a" | "b" | "done" | "search">(
    initialToolA ? (initialToolB ? "done" : "b") : "a"
  )
  const [toolA, setToolA] = useState<ToolResult | null>(null)
  const [toolB, setToolB] = useState<ToolResult | null>(null)
  const [query, setQuery] = useState(initialQuery || "")
  const [results, setResults] = useState<ToolResult[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState<string[]>(loadRecentSearches)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  function saveRecentSearch(name: string) {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
      const list = stored ? JSON.parse(stored) : []
      const filtered = list.filter((s: string) => s !== name)
      filtered.unshift(name)
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(filtered.slice(0, 5)))
      setRecentSearches(filtered.slice(0, 5))
    } catch {}
  }

  const selectTool = useCallback((tool: ToolResult) => {
    if (step === "a") {
      setToolA(tool)
      setStep("b")
      setQuery("")
      setResults([])
      setOpen(false)
      saveRecentSearch(tool.name)
    } else if (step === "b") {
      setToolB(tool)
      setStep("done")
      setQuery("")
      setResults([])
      setOpen(false)
      saveRecentSearch(tool.name)
    }
  }, [step])

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query || query.length < 1) {
        setResults([])
        setOpen(false)
        return
      }
      setLoading(true)
      try {
        const res = await fetch(`/api/tools/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data ?? [])
        setOpen(true)
        setSelectedIndex(-1)
      } catch {
        setResults([])
      }
      setLoading(false)
    }, 200)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleCompare() {
    if (toolA && toolB) {
      router.push(`/compare?q=&a=${toolA.slug}&b=${toolB.slug}`)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === "Enter" && selectedIndex >= 0 && results[selectedIndex]) {
      e.preventDefault()
      selectTool(results[selectedIndex])
    } else if (e.key === "Escape") {
      setOpen(false)
    }
  }

  function resetSelection() {
    if (step === "b") {
      setToolA(null)
      setStep("a")
    } else if (step === "done") {
      setToolB(null)
      setStep("b")
    }
    setQuery("")
    setResults([])
    inputRef.current?.focus()
  }

  const isSearchMode = step === "search"

  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-background shadow-premium-lg">
        {!isSearchMode && (
          <div className="flex items-center gap-3 border-b border-border/50 bg-gradient-to-r from-blue-50/50 via-white to-indigo-50/50 px-5 py-3">
            {toolA && (
              <div className="flex items-center gap-2 rounded-xl bg-primary/5 px-3 py-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-[10px] font-bold text-primary overflow-hidden">
                  {toolA.logoUrl ? (
                    <img src={toolA.logoUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    toolA.name.charAt(0)
                  )}
                </div>
                <span className="text-sm font-medium text-foreground">{toolA.name}</span>
                <button onClick={resetSelection} className="ml-1 text-muted-foreground hover:text-foreground">
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {toolA && toolB && (
              <ArrowRightLeft className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
            {toolB && (
              <div className="flex items-center gap-2 rounded-xl bg-primary/5 px-3 py-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-[10px] font-bold text-primary overflow-hidden">
                  {toolB.logoUrl ? (
                    <img src={toolB.logoUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    toolB.name.charAt(0)
                  )}
                </div>
                <span className="text-sm font-medium text-foreground">{toolB.name}</span>
                <button onClick={resetSelection} className="ml-1 text-muted-foreground hover:text-foreground">
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {!toolA && !toolB && (
              <span className="text-sm text-muted-foreground">Select two tools to compare</span>
            )}
            <div className="ml-auto flex items-center gap-2">
              {step === "a" && (
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                  Step 1: Select Tool A
                </span>
              )}
              {step === "b" && (
                <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-700">
                  Step 2: Select Tool B
                </span>
              )}
              {step === "done" && (
                <button
                  onClick={handleCompare}
                  className="btn-primary !min-h-0 !rounded-lg !px-4 !py-1.5 text-xs"
                >
                  <Sparkles className="h-3 w-3" />
                  Compare Now
                </button>
              )}
            </div>
          </div>
        )}

        <div ref={containerRef} className="relative">
          <div className="flex items-center px-4 py-3">
            <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => { if (results.length > 0) setOpen(true) }}
              onKeyDown={handleKeyDown}
              placeholder={
                isSearchMode
                  ? "Search comparisons or tools..."
                  : step === "a"
                  ? "Search for the first tool..."
                  : step === "b"
                  ? "Search for the second tool..."
                  : "Search comparisons..."
              }
              className="ml-3 h-10 flex-1 border-0 bg-transparent text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              aria-label="Search tools"
            />
            {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            {query && !loading && (
              <button onClick={() => { setQuery(""); setResults([]); setOpen(false) }} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {open && results.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-border bg-background shadow-premium-lg animate-scale-in">
              <div className="max-h-80 overflow-y-auto p-1.5">
                {results.map((tool, i) => (
                  <button
                    key={tool.id}
                    onClick={() => selectTool(tool)}
                    onMouseEnter={() => setSelectedIndex(i)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                      selectedIndex === i ? "bg-primary/5 text-foreground" : "text-foreground hover:bg-accent"
                    )}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-xs font-bold text-primary overflow-hidden ring-1 ring-border">
                      {tool.logoUrl ? (
                        <img src={tool.logoUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        tool.name.charAt(0)
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{tool.name}</span>
                        <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {tool.pricing}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>★ {tool.rating.toFixed(1)}</span>
                        {tool.reviewCount > 0 && <span>({tool.reviewCount})</span>}
                        {tool.categoryName && <span>&middot; {tool.categoryName}</span>}
                      </div>
                    </div>
                    <Check className={cn(
                      "h-4 w-4 shrink-0",
                      (step === "a" && toolA?.id === tool.id) || (step === "b" && toolB?.id === tool.id)
                        ? "text-primary"
                        : "text-transparent"
                    )} />
                  </button>
                ))}
              </div>
              <div className="border-t border-border px-3 py-2 text-[11px] text-muted-foreground flex items-center gap-3">
                <span className="flex items-center gap-1"><ArrowUp className="h-3 w-3" /> <ArrowDown className="h-3 w-3" /> Navigate</span>
                <span className="flex items-center gap-1">Enter Select</span>
                <span className="flex items-center gap-1">Esc Close</span>
              </div>
            </div>
          )}

          {open && query.length > 0 && results.length === 0 && !loading && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-border bg-background shadow-premium-lg">
              <div className="p-6 text-center text-sm text-muted-foreground">
                No tools found for &ldquo;{query}&rdquo;
              </div>
            </div>
          )}
        </div>
      </div>

      {!query && !toolA && !toolB && recentSearches.length > 0 && (
        <div className="mt-4 animate-fade-in">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Clock className="h-3 w-3" />
            <span>Recent searches</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((name) => (
              <button
                key={name}
                onClick={() => setQuery(name)}
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {!query && !toolA && !toolB && (
        <div className="mt-4 animate-fade-in">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <TrendingUp className="h-3 w-3" />
            <span>Popular comparisons</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {POPULAR_COMPARISONS.map((pc) => (
              <button
                key={pc.slug}
                onClick={() => router.push(`/compare/${pc.slug}`)}
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors"
              >
                {pc.a} vs {pc.b}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
