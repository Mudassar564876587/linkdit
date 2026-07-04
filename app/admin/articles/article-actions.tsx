"use client"

import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { adminDeleteArticle } from "@/actions/admin/articles"

export default function ArticleActions({ id }: { id: string }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm("Delete this article?")) return
    await adminDeleteArticle(id); router.refresh()
  }

  return (
    <button onClick={handleDelete} className="flex h-7 w-7 items-center justify-center rounded-md text-red-500 hover:bg-red-50">
      <Trash2 className="h-4 w-4" />
    </button>
  )
}
