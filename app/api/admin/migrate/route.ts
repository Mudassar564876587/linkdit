import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function POST() {
  const userSupabase = await createServerSupabaseClient()
  const { data: { user } } = await userSupabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 })

  const { data: adminUser } = await userSupabase.from("users").select("role").eq("id", user.id).single()
  if (adminUser?.role !== "admin") return NextResponse.json({ error: "Permission denied." }, { status: 403 })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Missing env vars." }, { status: 500 })
  }

  // Check if cons column already exists in API schema cache
  const checkRes = await fetch(`${supabaseUrl}/rest/v1/reviews?select=cons&limit=1`, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
  })

  if (checkRes.ok) {
    return NextResponse.json({ message: "Schema is up to date, no migration needed." })
  }

  // The DB migration exists in supabase/migrations/011_review_system.sql
  // but the PostgREST schema cache hasn't picked it up. Try to reload it.
  const { error: notifyError } = await userSupabase.rpc("pgrst_reload") as any

  if (!notifyError) {
    return NextResponse.json({ message: "Schema cache reloaded. Try again.", reloaded: true })
  }

  // If we can't reload, the migration SQL might not have been run at all
  const migrationSql = `
-- ============================================================================
-- Run this SQL in Supabase SQL Editor
-- Go to: https://supabase.com/dashboard/project/PROJECT_REF/sql/new
-- ============================================================================

alter table public.reviews
  add column if not exists title text,
  add column if not exists pros text[] default '{}',
  add column if not exists cons text[] default '{}';

create or replace function public.update_tool_rating()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_tool_id uuid;
begin
  if tg_op = 'DELETE' then
    v_tool_id := old.tool_id;
  else
    v_tool_id := new.tool_id;
  end if;

  update public.tools
  set
    rating = coalesce(
      (select round(avg(rating)::numeric, 2)
       from public.reviews
       where tool_id = v_tool_id and is_approved = true),
      0
    ),
    review_count = (
      select count(*)
      from public.reviews
      where tool_id = v_tool_id and is_approved = true
    )
  where id = v_tool_id;

  return null;
end;
$$;

drop trigger if exists trg_reviews_update_tool_rating on public.reviews;
create trigger trg_reviews_update_tool_rating
  after insert or update or delete on public.reviews
  for each row execute function public.update_tool_rating();

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';`

  return NextResponse.json({
    error: "Schema issue detected.",
    reloadAttempted: !!notifyError,
    migrationSQL: migrationSql,
    instructions: "Copy the SQL and run it in Supabase SQL Editor.",
  })
}