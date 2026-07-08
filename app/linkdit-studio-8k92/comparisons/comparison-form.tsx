"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Trash2, Search } from "lucide-react"
import { adminCreateComparison, adminUpdateComparison } from "@/actions/admin/comparisons"

type Tool = {
  id: string
  name: string
  slug: string
  logo_url: string | null
  pricing: string
  rating: number
}

type Props = {
  categories: { id: string; name: string }[]
  initial?: {
    id: string
    title?: string | null
    description?: string | null
    tool_a?: Tool | null
    tool_b?: Tool | null
    pros_a?: string[] | null
    pros_b?: string[] | null
    cons_a?: string[] | null
    cons_b?: string[] | null
    features_comparison?: Record<string, unknown>[] | null
    pricing_comparison?: Record<string, unknown>[] | null
    ratings_comparison?: Record<string, unknown>[] | null
    tool_a_notes?: string | null
    tool_b_notes?: string | null
    category_id?: string | null
    seo_title?: string | null
    seo_description?: string | null
    is_published?: boolean | null
    is_featured?: boolean | null
  }
}

export default function ComparisonForm({ categories, initial }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [toolA, setToolA] = useState<Tool | null>(initial?.tool_a ?? null)
  const [toolB, setToolB] = useState<Tool | null>(initial?.tool_b ?? null)

  const [toolASearch, setToolASearch] = useState("")
  const [toolBSearch, setToolBSearch] = useState("")
  const [toolAResults, setToolAResults] = useState<Tool[]>([])
  const [toolBResults, setToolBResults] = useState<Tool[]>([])
  const [searchingA, setSearchingA] = useState(false)
  const [searchingB, setSearchingB] = useState(false)

  const [prosA, setProsA] = useState<string[]>(initial?.pros_a ?? [])
  const [prosB, setProsB] = useState<string[]>(initial?.pros_b ?? [])
  const [consA, setConsA] = useState<string[]>(initial?.cons_a ?? [])
  const [consB, setConsB] = useState<string[]>(initial?.cons_b ?? [])

  const [features, setFeatures] = useState<Record<string, unknown>[]>(initial?.features_comparison ?? [])
  const [pricing, setPricing] = useState<Record<string, unknown>[]>(initial?.pricing_comparison ?? [])
  const [ratings, setRatings] = useState<Record<string, unknown>[]>(initial?.ratings_comparison ?? [])

  const searchTool = useCallback(async (query: string, setResults: (r: Tool[]) => void, setSearching: (s: boolean) => void) => {
    if (!query || query.length < 2) {
      setResults([])
      return
    }
    setSearching(true)
    try {
      const res = await fetch(`/api/tools/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data ?? [])
    } catch {
      setResults([])
    }
    setSearching(false)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => searchTool(toolASearch, setToolAResults, setSearchingA), 300)
    return () => clearTimeout(timer)
  }, [toolASearch, searchTool])

  useEffect(() => {
    const timer = setTimeout(() => searchTool(toolBSearch, setToolBResults, setSearchingB), 300)
    return () => clearTimeout(timer)
  }, [toolBSearch, searchTool])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    fd.set("toolAId", toolA?.id ?? "")
    fd.set("toolBId", toolB?.id ?? "")
    fd.set("prosA", prosA.join("\n"))
    fd.set("prosB", prosB.join("\n"))
    fd.set("consA", consA.join("\n"))
    fd.set("consB", consB.join("\n"))
    fd.set("featuresComparison", JSON.stringify(features))
    fd.set("pricingComparison", JSON.stringify(pricing))
    fd.set("ratingsComparison", JSON.stringify(ratings))

    const result = initial
      ? await adminUpdateComparison(initial.id, fd)
      : await adminCreateComparison(fd)

    setLoading(false)
    if (result.error) setError(result.error)
    else router.push("/linkdit-studio-8k92/comparisons")
  }

  function addListItem(list: string[], setList: (v: string[]) => void, value: string) {
    if (value.trim()) setList([...list, value.trim()])
  }

  function removeListItem(list: string[], setList: (v: string[]) => void, index: number) {
    setList(list.filter((_, i) => i !== index))
  }

  function addJsonItem(list: Record<string, unknown>[], setList: (v: Record<string, unknown>[]) => void, template: Record<string, unknown>) {
    setList([...list, { ...template }])
  }

  function updateJsonItem(list: Record<string, unknown>[], setList: (v: Record<string, unknown>[]) => void, index: number, key: string, value: unknown) {
    const updated = list.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    setList(updated)
  }

  function removeJsonItem(list: Record<string, unknown>[], setList: (v: Record<string, unknown>[]) => void, index: number) {
    setList(list.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      <div className="space-y-1">
        <label htmlFor="title" className="text-sm font-medium text-foreground">
          Title *
        </label>
        <input
          id="title"
          name="title"
          defaultValue={initial?.title ?? ""}
          required
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="e.g. ChatGPT vs Claude"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className="text-sm font-medium text-foreground">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={initial?.description ?? ""}
          rows={3}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          placeholder="Brief description of this comparison"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Tool A */}
        <div className="space-y-3 rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-foreground">Tool A</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={toolASearch}
              onChange={(e) => setToolASearch(e.target.value)}
              placeholder="Search tools..."
              className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          {searchingA && <p className="text-xs text-muted-foreground">Searching...</p>}
          {toolAResults.length > 0 && (
            <div className="max-h-40 overflow-y-auto rounded-lg border border-border">
              {toolAResults.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setToolA(t)
                    setToolASearch("")
                    setToolAResults([])
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-accent"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.pricing} &middot; {t.rating}/5</p>
                  </div>
                </button>
              ))}
            </div>
          )}
          {toolA && (
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm font-bold text-primary">
                {toolA.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{toolA.name}</p>
                <p className="text-xs text-muted-foreground">{toolA.pricing}</p>
              </div>
              <button
                type="button"
                onClick={() => setToolA(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
          <input type="hidden" name="toolAId" value={toolA?.id ?? ""} />
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Notes about Tool A</label>
            <textarea
              name="toolANotes"
              defaultValue={initial?.tool_a_notes ?? ""}
              rows={2}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>
        </div>

        {/* Tool B */}
        <div className="space-y-3 rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-foreground">Tool B</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={toolBSearch}
              onChange={(e) => setToolBSearch(e.target.value)}
              placeholder="Search tools..."
              className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          {searchingB && <p className="text-xs text-muted-foreground">Searching...</p>}
          {toolBResults.length > 0 && (
            <div className="max-h-40 overflow-y-auto rounded-lg border border-border">
              {toolBResults.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setToolB(t)
                    setToolBSearch("")
                    setToolBResults([])
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-accent"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.pricing} &middot; {t.rating}/5</p>
                  </div>
                </button>
              ))}
            </div>
          )}
          {toolB && (
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm font-bold text-primary">
                {toolB.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{toolB.name}</p>
                <p className="text-xs text-muted-foreground">{toolB.pricing}</p>
              </div>
              <button
                type="button"
                onClick={() => setToolB(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
          <input type="hidden" name="toolBId" value={toolB?.id ?? ""} />
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Notes about Tool B</label>
            <textarea
              name="toolBNotes"
              defaultValue={initial?.tool_b_notes ?? ""}
              rows={2}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="categoryId" className="text-sm font-medium text-foreground">
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={initial?.category_id ?? ""}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pros & Cons */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Tool A Pros</h3>
          {prosA.map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={p}
                onChange={(e) => {
                  const updated = [...prosA]
                  updated[i] = e.target.value
                  setProsA(updated)
                }}
                className="h-9 flex-1 rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button type="button" onClick={() => removeListItem(prosA, setProsA, i)} className="text-red-500 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListItem(prosA, setProsA, "")}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <Plus className="h-3 w-3" /> Add pro
          </button>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Tool B Pros</h3>
          {prosB.map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={p}
                onChange={(e) => {
                  const updated = [...prosB]
                  updated[i] = e.target.value
                  setProsB(updated)
                }}
                className="h-9 flex-1 rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button type="button" onClick={() => removeListItem(prosB, setProsB, i)} className="text-red-500 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListItem(prosB, setProsB, "")}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <Plus className="h-3 w-3" /> Add pro
          </button>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Tool A Cons</h3>
          {consA.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={c}
                onChange={(e) => {
                  const updated = [...consA]
                  updated[i] = e.target.value
                  setConsA(updated)
                }}
                className="h-9 flex-1 rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button type="button" onClick={() => removeListItem(consA, setConsA, i)} className="text-red-500 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListItem(consA, setConsA, "")}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <Plus className="h-3 w-3" /> Add con
          </button>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Tool B Cons</h3>
          {consB.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={c}
                onChange={(e) => {
                  const updated = [...consB]
                  updated[i] = e.target.value
                  setConsB(updated)
                }}
                className="h-9 flex-1 rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button type="button" onClick={() => removeListItem(consB, setConsB, i)} className="text-red-500 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListItem(consB, setConsB, "")}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <Plus className="h-3 w-3" /> Add con
          </button>
        </div>
      </div>

      {/* Features Comparison */}
      <div className="space-y-3 rounded-xl border border-border p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Features Comparison</h3>
          <button
            type="button"
            onClick={() => addJsonItem(features, setFeatures, { name: "", toolAValue: "", toolBValue: "" })}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <Plus className="h-3 w-3" /> Add feature row
          </button>
        </div>
        {features.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-2 py-1 text-left font-medium text-foreground">Feature</th>
                  <th className="px-2 py-1 text-left font-medium text-foreground">Tool A</th>
                  <th className="px-2 py-1 text-left font-medium text-foreground">Tool B</th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody>
                {features.map((f, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="px-2 py-1">
                      <input
                        value={f.name as string}
                        onChange={(e) => updateJsonItem(features, setFeatures, i, "name", e.target.value)}
                        className="h-8 w-full rounded border border-input bg-background px-2 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </td>
                    <td className="px-2 py-1">
                      <input
                        value={f.toolAValue as string}
                        onChange={(e) => updateJsonItem(features, setFeatures, i, "toolAValue", e.target.value)}
                        className="h-8 w-full rounded border border-input bg-background px-2 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Value for Tool A"
                      />
                    </td>
                    <td className="px-2 py-1">
                      <input
                        value={f.toolBValue as string}
                        onChange={(e) => updateJsonItem(features, setFeatures, i, "toolBValue", e.target.value)}
                        className="h-8 w-full rounded border border-input bg-background px-2 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Value for Tool B"
                      />
                    </td>
                    <td className="px-2 py-1">
                      <button type="button" onClick={() => removeJsonItem(features, setFeatures, i)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pricing Comparison */}
      <div className="space-y-3 rounded-xl border border-border p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Pricing Comparison</h3>
          <button
            type="button"
            onClick={() => addJsonItem(pricing, setPricing, { aspect: "", toolAValue: "", toolBValue: "" })}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <Plus className="h-3 w-3" /> Add pricing row
          </button>
        </div>
        {pricing.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-2 py-1 text-left font-medium text-foreground">Aspect</th>
                  <th className="px-2 py-1 text-left font-medium text-foreground">Tool A</th>
                  <th className="px-2 py-1 text-left font-medium text-foreground">Tool B</th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody>
                {pricing.map((p, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="px-2 py-1">
                      <input
                        value={p.aspect as string}
                        onChange={(e) => updateJsonItem(pricing, setPricing, i, "aspect", e.target.value)}
                        className="h-8 w-full rounded border border-input bg-background px-2 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="e.g. Monthly"
                      />
                    </td>
                    <td className="px-2 py-1">
                      <input
                        value={p.toolAValue as string}
                        onChange={(e) => updateJsonItem(pricing, setPricing, i, "toolAValue", e.target.value)}
                        className="h-8 w-full rounded border border-input bg-background px-2 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </td>
                    <td className="px-2 py-1">
                      <input
                        value={p.toolBValue as string}
                        onChange={(e) => updateJsonItem(pricing, setPricing, i, "toolBValue", e.target.value)}
                        className="h-8 w-full rounded border border-input bg-background px-2 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </td>
                    <td className="px-2 py-1">
                      <button type="button" onClick={() => removeJsonItem(pricing, setPricing, i)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ratings Comparison */}
      <div className="space-y-3 rounded-xl border border-border p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Ratings Comparison</h3>
          <button
            type="button"
            onClick={() => addJsonItem(ratings, setRatings, { aspect: "", toolARating: 0, toolBRating: 0 })}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <Plus className="h-3 w-3" /> Add rating row
          </button>
        </div>
        {ratings.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-2 py-1 text-left font-medium text-foreground">Aspect</th>
                  <th className="px-2 py-1 text-left font-medium text-foreground">Tool A</th>
                  <th className="px-2 py-1 text-left font-medium text-foreground">Tool B</th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody>
                {ratings.map((r, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="px-2 py-1">
                      <input
                        value={r.aspect as string}
                        onChange={(e) => updateJsonItem(ratings, setRatings, i, "aspect", e.target.value)}
                        className="h-8 w-full rounded border border-input bg-background px-2 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="e.g. Ease of Use"
                      />
                    </td>
                    <td className="px-2 py-1">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={r.toolARating as string}
                        onChange={(e) => updateJsonItem(ratings, setRatings, i, "toolARating", parseFloat(e.target.value) || 0)}
                        className="h-8 w-20 rounded border border-input bg-background px-2 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </td>
                    <td className="px-2 py-1">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={r.toolBRating as string}
                        onChange={(e) => updateJsonItem(ratings, setRatings, i, "toolBRating", parseFloat(e.target.value) || 0)}
                        className="h-8 w-20 rounded border border-input bg-background px-2 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </td>
                    <td className="px-2 py-1">
                      <button type="button" onClick={() => removeJsonItem(ratings, setRatings, i)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SEO */}
      <fieldset className="rounded-xl border border-border p-4 space-y-3">
        <legend className="text-sm font-medium text-foreground px-1">SEO</legend>
        <div className="space-y-1">
          <label htmlFor="seoTitle" className="text-xs text-muted-foreground">SEO Title</label>
          <input
            id="seoTitle"
            name="seoTitle"
            defaultValue={initial?.seo_title ?? ""}
            className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="seoDescription" className="text-xs text-muted-foreground">SEO Description</label>
          <textarea
            id="seoDescription"
            name="seoDescription"
            defaultValue={initial?.seo_description ?? ""}
            rows={2}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>
      </fieldset>

      {/* Publish & Featured */}
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            name="published"
            value="true"
            defaultChecked={initial?.is_published ?? undefined}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          Publish
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            name="featured"
            value="true"
            defaultChecked={initial?.is_featured ?? undefined}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          Featured
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {initial ? "Update Comparison" : "Create Comparison"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="h-10 rounded-lg border border-border px-5 text-sm font-medium text-muted-foreground hover:bg-accent"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
