"use client"

import { useRouter } from "next/navigation"
import { Trash2, Download } from "lucide-react"
import { adminDeleteSubscriber, adminExportSubscribersCSV } from "@/actions/admin/newsletter"

type Subscriber = { id: string; email: string; subscribed: boolean; subscribed_at: string | null }

export default function AdminNewsletterClient({ subscribers }: { subscribers: Subscriber[] }) {
  const router = useRouter()
  const active = subscribers.filter((s) => s.subscribed)

  async function handleExport() {
    const result = await adminExportSubscribersCSV()
    if (result.csv) {
      const blob = new Blob([result.csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url; a.download = "subscribers.csv"; a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Newsletter</h1>
          <p className="text-sm text-muted-foreground">{active.length} active subscribers</p>
        </div>
        <button onClick={handleExport}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-foreground hover:bg-accent">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-foreground">Email</th>
              <th className="px-4 py-3 text-center font-medium text-foreground">Status</th>
              <th className="px-4 py-3 text-left font-medium text-foreground hidden md:table-cell">Subscribed</th>
              <th className="px-4 py-3 text-right font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0 hover:bg-accent/50">
                <td className="px-4 py-3 text-foreground">{s.email}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    s.subscribed ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                    {s.subscribed ? "Active" : "Unsubscribed"}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                  {s.subscribed_at ? new Date(s.subscribed_at).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={async () => { if (confirm("Delete subscriber?")) { await adminDeleteSubscriber(s.id); router.refresh() }}}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-red-500 hover:bg-red-50 ml-auto">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
