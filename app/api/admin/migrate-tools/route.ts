import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function POST() {
  const userSupabase = await createServerSupabaseClient()
  const { data: { user } } = await userSupabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 })

  const { data: adminUser } = await userSupabase.from("users").select("role").eq("id", user.id).single()
  if (adminUser?.role !== "admin") return NextResponse.json({ error: "Permission denied." }, { status: 403 })

  const sql = `ALTER TABLE IF EXISTS public.tools ADD COLUMN IF NOT EXISTS is_verified boolean NOT NULL DEFAULT false;
ALTER TABLE IF EXISTS public.tools ADD COLUMN IF NOT EXISTS sponsored boolean NOT NULL DEFAULT false;
NOTIFY pgrst, 'reload schema';`

  return NextResponse.json({
    migrationSQL: sql,
    instructions: `Copy the SQL above and run it in your Supabase SQL Editor:
https://supabase.com/dashboard/project/PROJECT_REF/sql/new`,
  })
}
