"use client"

import { Plus, X } from "lucide-react"

type FaqItem = { question: string; answer: string }

type FaqManagerProps = {
  items: FaqItem[]
  onChange: (items: FaqItem[]) => void
}

export default function FaqManager({ items, onChange }: FaqManagerProps) {
  function add() {
    onChange([...items, { question: "", answer: "" }])
  }

  function update(i: number, field: "question" | "answer", value: string) {
    const next = [...items]
    next[i] = { ...next[i], [field]: value }
    onChange(next)
  }

  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">FAQ ({items.length})</label>
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <Plus className="h-4 w-4" /> Add FAQ
        </button>
      </div>

      {items.map((faq, i) => (
        <div key={i} className="rounded-xl border border-border bg-background p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-3">
              <input
                type="text"
                value={faq.question}
                onChange={(e) => update(i, "question", e.target.value)}
                placeholder="Question"
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                aria-label={`FAQ question ${i + 1}`}
              />
              <textarea
                value={faq.answer}
                onChange={(e) => update(i, "answer", e.target.value)}
                placeholder="Answer"
                rows={3}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                aria-label={`FAQ answer ${i + 1}`}
              />
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Remove FAQ"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}

      {items.length === 0 && (
        <p className="text-sm text-muted-foreground">No FAQs added yet. Click "Add FAQ" to add one.</p>
      )}
    </div>
  )
}
