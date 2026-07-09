"use server"

export async function applyReviewMigration() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return { error: "Missing environment variables." }
  }

  const sql = `
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
  `

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": serviceRoleKey,
        "Authorization": `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({ query: sql }),
    })

    if (!res.ok) {
      const text = await res.text()
      // Fallback: try direct SQL via pg_ddl
      const res2 = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Prefer": "params=single-object",
        },
        body: JSON.stringify({ query: sql }),
      })

      if (!res2.ok) {
        return {
          error: "Could not run migration automatically.",
          sql,
          needsManual: true,
        }
      }
    }

    // Refresh schema cache
    await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": serviceRoleKey,
        "Authorization": `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({ query: "NOTIFY pgrst, 'reload schema';" }),
    }).catch(() => {})

    return { success: true }
  } catch {
    return {
      error: "Could not run migration automatically.",
      sql,
      needsManual: true,
    }
  }
}