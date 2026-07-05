"use client"

import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { adminDeleteResource } from "@/actions/admin/resources"

export default function ResourceActions({ id }: { id: string }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm("Delete this resource?")) return
    await adminDeleteResource(id); router.refresh()
  }

  return (
    <button onClick={handleDelete} className="flex h-7 w-7 items-center justify-center rounded-md text-red-500 hover:bg-red-50">
      <Trash2 className="h-4 w-4" />
    </button>
  )
}
