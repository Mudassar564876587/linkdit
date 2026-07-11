import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"

export async function POST() {
  const userSupabase = await createServerSupabaseClient()
  const { data: { user } } = await userSupabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 })

  const { data: adminUser } = await userSupabase.from("users").select("role").eq("id", user.id).single()
  if (adminUser?.role !== "admin") return NextResponse.json({ error: "Permission denied." }, { status: 403 })

  const admin = getAdminClient()

  // Update existing DB records from Freemium to Preemium
  const results: string[] = []

  const { error: e1 } = await (admin.from("tools") as any).update({ pricing: "Preemium" }).eq("pricing", "Freemium")
  results.push(e1 ? `tools update error: ${e1.message}` : "tools updated")

  const { error: e2 } = await (admin.from("resources") as any).update({ pricing: "Preemium" }).eq("pricing", "Freemium")
  results.push(e2 ? `resources update error: ${e2.message}` : "resources updated")

  const { error: e3 } = await (admin.from("tool_submissions") as any).update({ pricing: "Preemium" }).eq("pricing", "Freemium")
  results.push(e3 ? `tool_submissions update error: ${e3.message}` : "tool_submissions updated")

  // Also try to add missing columns (needs SQL, may fail)
  const sql = `ALTER TABLE IF EXISTS public.tools ADD COLUMN IF NOT EXISTS is_verified boolean NOT NULL DEFAULT false;
ALTER TABLE IF EXISTS public.tools ADD COLUMN IF NOT EXISTS sponsored boolean NOT NULL DEFAULT false;
NOTIFY pgrst, 'reload schema';`

  return NextResponse.json({
    results,
    migrationSQL: sql,
    instructions: `If columns are missing, run the SQL above in your Supabase SQL Editor.`,
  })
}
