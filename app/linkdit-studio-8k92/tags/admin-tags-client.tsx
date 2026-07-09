"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { adminCreateTag, adminUpdateTag, adminDeleteTag } from "@/actions/admin/tags"

type Tag = { id: string; name: string; slug: string; created_at: string; tool_count: number }

export default function AdminTagsClient({ tags }: { tags: Tag[] }) {
  const router = useRouter()
  const [editing, setEditing] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [showNew, setShowNew] = useState(false)

  function reset() { setName(""); setEditing(null); setShowNew(false) }

  function edit(tag: Tag) {
    setEditing(tag.id); setName(tag.name); setShowNew(true)
  }

  async function handleSave() {
    if (editing) {
      await adminUpdateTag(editing, name)
    } else {
      await adminCreateTag(name)
    }
    reset(); router.refresh()
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this tag?")) return
    await adminDeleteTag(id); router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Tags</h1>
        <button onClick={() => { reset(); setShowNew(true) }}
          className="btn-primary">
          <Plus className="h-4 w-4" /> Add Tag
        </button>
      </div>

      {showNew && (
        <div className="rounded-xl border border-border bg-background p-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="btn-primary">
              {editing ? "Update" : "Create"}
            </button>
            <button onClick={reset} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-foreground">Name</th>
              <th className="px-4 py-3 text-left font-medium text-foreground hidden sm:table-cell">Slug</th>
              <th className="px-4 py-3 text-left font-medium text-foreground hidden md:table-cell">Tools</th>
              <th className="px-4 py-3 text-right font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((t) => (
              <tr key={t.id} className="border-b border-border last:border-0 hover:bg-accent/50">
                <td className="px-4 py-3 font-medium text-foreground">{t.name}</td>
                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{t.slug}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{t.tool_count}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => edit(t)} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(t.id)} className="flex h-7 w-7 items-center justify-center rounded-md text-red-500 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}