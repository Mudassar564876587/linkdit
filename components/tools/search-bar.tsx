"use client"

import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { useEffect, useRef, useState, useCallback } from "react"

export default function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<{ name: string; slug: string }[]>([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const handleSearch = useCallback(
    (q: string) => {
      const params = new URLSearchParams()
      if (q) params.set("q", q)
      router.push(`/tools?${params.toString()}`)
      setOpen(false)
      setActiveIndex(-1)
    },
    [router]
  )

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([])
      setOpen(false)
      setActiveIndex(-1)
      return
    }

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/tools/suggest?q=${encodeURIComponent(query)}`)
        if (res.ok) {
          const data = await res.json()
          setSuggestions(data)
          setOpen(data.length > 0)
          setActiveIndex(-1)
        }
      } catch {}
    }, 300)

    return () => clearTimeout(debounceRef.current)
  }, [query])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setActiveIndex(-1)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function selectSuggestion(s: { name: string; slug: string }) {
    setQuery(s.name)
    setOpen(false)
    setActiveIndex(-1)
    router.push(`/tools/${s.slug}`)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        selectSuggestion(suggestions[activeIndex])
      } else {
        handleSearch(query)
      }
      e.preventDefault()
    } else if (e.key === "ArrowDown") {
      setActiveIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      )
      e.preventDefault()
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      )
      e.preventDefault()
    } else if (e.key === "Escape") {
      setOpen(false)
      setActiveIndex(-1)
      inputRef.current?.blur()
    }
  }

  return (
    <div ref={ref} className="relative w-full max-w-md" role="combobox" aria-expanded={open} aria-haspopup="listbox">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search AI tools..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (suggestions.length) setOpen(true) }}
          className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          aria-label="Search AI tools"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
          role="searchbox"
        />
      </div>

      {open && suggestions.length > 0 && (
        <div
          id="search-suggestions"
          role="listbox"
          className="absolute left-0 right-0 top-full mt-1 rounded-xl border border-border bg-background p-1 shadow-lg z-50"
        >
          {suggestions.map((s, i) => (
            <button
              key={s.slug}
              id={`suggestion-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              onClick={() => selectSuggestion(s)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors ${
                i === activeIndex ? "bg-accent" : "hover:bg-accent"
              }`}
            >
              <Search className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              {s.name}
            </button>
          ))}
        </div>
      )}

      {open && suggestions.length === 0 && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full mt-1 rounded-xl border border-border bg-background p-4 text-center text-sm text-muted-foreground shadow-lg z-50">
          No tools found for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  )
}
