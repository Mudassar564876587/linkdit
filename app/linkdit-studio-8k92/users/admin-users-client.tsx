"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Shield, User, Trash2, ExternalLink } from "lucide-react"
import { adminUpdateUserRole, adminDeleteUser } from "@/actions/admin/users"

export default function AdminUsersClient({ users }: { users: any[] }) {
  const router = useRouter()
  const [search, setSearch] = useState("")

  const filtered = users.filter((u) =>
    !search || u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  )

  async function handleRole(id: string, role: "admin" | "user") {
    await adminUpdateUserRole(id, role); router.refresh()
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this user?")) return
    await adminDeleteUser(id); router.refresh()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Users ({filtered.length})</h1>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..."
          className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-foreground">User</th>
              <th className="px-4 py-3 text-left font-medium text-foreground hidden sm:table-cell">Email</th>
              <th className="px-4 py-3 text-center font-medium text-foreground">Role</th>
              <th className="px-4 py-3 text-right font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0 hover:bg-accent/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {u.full_name?.charAt(0) || u.email?.charAt(0)}
                    </div>
                    <span className="font-medium text-foreground">{u.full_name || "—"}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{u.email}</td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => handleRole(u.id, u.role === "admin" ? "user" : "admin")}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      u.role === "admin" ? "bg-violet-100 text-violet-700" : "bg-gray-100 text-gray-600"}`}>
                    {u.role === "admin" ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                    {u.role}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => handleDelete(u.id)} className="flex h-7 w-7 items-center justify-center rounded-md text-red-500 hover:bg-red-50">
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
