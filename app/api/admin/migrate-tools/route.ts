import { NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { createServerSupabaseClient } from "@/lib/supabase/server"

const MIGRATION_SQL = `-- Run this SQL in Supabase SQL Editor (https://supabase.com/dashboard/project/PROJECT_REF/sql/new)

alter table if exists public.tools add column if not exists sponsored   boolean not null default false;
alter table if exists public.tools add column if not exists is_verified boolean not null default false;

create index if not exists idx_tools_sponsored on public.tools (sponsored) where sponsored = true;
create index if not exists idx_tools_verified  on public.tools (is_verified) where is_verified = true;

NOTIFY pgrst, 'reload schema';
`

export async function POST() {
  const userSupabase = await createServerSupabaseClient()
  const { data: { user } } = await userSupabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 })

  const { data: adminUser } = await userSupabase.from("users").select("role").eq("id", user.id).single()
  if (adminUser?.role !== "admin") return NextResponse.json({ error: "Permission denied." }, { status: 403 })

  const admin = getAdminClient()
  const sql = MIGRATION_SQL
    .replace(/--.*?\n/g, "")
    .replace(/\n+/g, "\n")
    .trim()

  let executed = false
  let error: string | null = null

  // try via RPC (works if a helper function was defined)
  try {
    const { error: rpcErr } = await admin.rpc("pgrst_reload")
    if (!rpcErr) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        },
        body: JSON.stringify({ query: sql }),
      })
      if (res.ok || res.status === 201 || res.status === 204) {
        executed = true
      } else {
        error = `REST API returned ${res.status}`
      }
    }
  } catch (e: any) {
    error = e?.message || "RPC error"
  }

  return NextResponse.json({
    executed,
    error,
    migrationSQL: MIGRATION_SQL,
    instructions: executed
      ? "Migration ran successfully."
      : "Copy the SQL above and run it in your Supabase SQL Editor, then refresh.",
  })
}
