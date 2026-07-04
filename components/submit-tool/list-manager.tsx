"use client"

import { useState } from "react"
import { Plus, X, GripVertical } from "lucide-react"

type ListManagerProps = {
  label: string
  items: string[]
  onChange: (items: string[]) => void
  placeholder?: string
  maxItems?: number
}

export default function ListManager({ label, items, onChange, placeholder = "Add item...", maxItems = 30 }: ListManagerProps) {
  const [input, setInput] = useState("")

  function add() {
    const val = input.trim()
    if (!val || items.length >= maxItems) return
    onChange([...items, val])
    setInput("")
  }

  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i))
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") { e.preventDefault(); add() }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label} ({items.length}/{maxItems})</label>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={items.length >= maxItems}
          className="h-9 flex-1 rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          aria-label={`Add ${label} item`}
        />
        <button
          type="button"
          onClick={add}
          disabled={!input.trim() || items.length >= maxItems}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          aria-label="Add"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {items.length > 0 && (
        <ul className="space-y-1.5" role="list" aria-label={label}>
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
              <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="flex-1">{item}</span>
              <button
                type="button"
                onClick={() => remove(i)}
                className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                aria-label={`Remove ${item}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
