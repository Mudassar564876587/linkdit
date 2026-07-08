"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from "@/actions/admin/categories"

type Category = { id: string; name: string; slug: string; description: string; icon_name: string; tool_count: number }

export default function AdminCategoriesClient({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const [editing, setEditing] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [icon, setIcon] = useState("PenLine")
  const [showNew, setShowNew] = useState(false)

  function reset() { setName(""); setSlug(""); setDescription(""); setIcon("PenLine"); setEditing(null); setShowNew(false) }

  function edit(cat: Category) {
    setEditing(cat.id); setName(cat.name); setSlug(cat.slug); setDescription(cat.description); setIcon(cat.icon_name); setShowNew(true)
  }

  async function handleSave() {
    if (editing) {
      await adminUpdateCategory(editing, { name, slug, description, icon_name: icon })
    } else {
      await adminCreateCategory({ name, slug, description, icon_name: icon })
    }
    reset(); router.refresh()
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category?")) return
    await adminDeleteCategory(id); router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Categories</h1>
        <button onClick={() => { reset(); setShowNew(true) }}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Add Category
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
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Slug</label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              {editing ? "Update" : "Create"}
            </button>
            <button onClick={reset} className="h-9 rounded-lg border border-border px-4 text-sm font-medium text-muted-foreground hover:bg-accent">Cancel</button>
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
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0 hover:bg-accent/50">
                <td className="px-4 py-3 font-medium text-foreground">{c.name}</td>
                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{c.slug}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{c.tool_count}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => edit(c)} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="flex h-7 w-7 items-center justify-center rounded-md text-red-500 hover:bg-red-50">
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
