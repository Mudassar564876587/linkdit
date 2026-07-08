import type { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export const metadata: Metadata = { title: "System | Admin | LinkDit" }

export default async function AdminSystemPage() {
  const supabase = await createServerSupabaseClient()
  const { data: logs } = await supabase
    .from("audit_logs")
    .select("*, users(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(100)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">System / Audit Logs</h1>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-foreground">Action</th>
              <th className="px-4 py-3 text-left font-medium text-foreground hidden sm:table-cell">Entity</th>
              <th className="px-4 py-3 text-left font-medium text-foreground hidden md:table-cell">User</th>
              <th className="px-4 py-3 text-left font-medium text-foreground">Date</th>
            </tr>
          </thead>
          <tbody>
            {(logs ?? []).map((log) => (
              <tr key={log.id} className="border-b border-border last:border-0 hover:bg-accent/50">
                <td className="px-4 py-3">
                  <span className="font-medium text-foreground">{log.action}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                  {log.entity_type}{log.entity_id ? ` / ${log.entity_id.slice(0, 8)}` : ""}
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                  {log.users?.full_name || log.users?.email || "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(log.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!logs?.length && (
          <div className="p-8 text-center text-sm text-muted-foreground">No audit logs yet.</div>
        )}
      </div>
    </div>
  )
}
