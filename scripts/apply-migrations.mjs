// Apply pending migrations via Supabase REST API
// Run: node scripts/apply-migrations.mjs

const supabaseUrl = "https://voavwcfvnviwtweyeeej.supabase.co"
const serviceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvYXZ3Y2Z2bnZpd3R3ZXllZWVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzE0MDE1NSwiZXhwIjoyMDk4NzE2MTU1fQ.Me1f_XpDHhChfcUYcp6c5s3ZwE5U6F5WFikPqVEroXs"

async function runSQL(sql) {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": serviceRoleKey,
      "Authorization": `Bearer ${serviceRoleKey}`,
      "Accept": "application/json",
    },
    body: JSON.stringify({ sql_text: sql }),
  })
  return { ok: response.ok, status: response.status, body: await response.text() }
}

async function createExecSQL() {
  // First create the function if it doesn't exist via SQL in PostgREST
  const sql = `
CREATE OR REPLACE FUNCTION public.exec_sql_raw(sql_text text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  EXECUTE sql_text;
END;
$$;
  `
  return runSQL(sql)
}

async function main() {
  console.log("Creating exec_sql_raw function...")
  // Can't create functions via REST, need to use SQL editor or direct pg connection
  // Let me try a different approach - use the Supabase Management API
  
  // Instead, let me just use fetch to hit the pg-api
  const mgmtUrl = `https://api.supabase.com/v1/projects/voavwcfvnviwtweyeeej/database/query`
  console.log("Trying direct SQL endpoint...")
  
  // The pg-api endpoint with service key
  const response = await fetch(`https://voavwcfvnviwtweyeeej.supabase.co/auth/v1/admin/users`, {
    method: "GET",
    headers: {
      "apikey": serviceRoleKey,
      "Authorization": `Bearer ${serviceRoleKey}`,
    },
  })
  console.log("Auth check:", response.status)
  
  // We need to use the Supabase API or a different method
  // Let's just try to add the column via the tools API
  console.log("Platforms column needs to be added manually in Supabase SQL Editor")
  console.log("Run this SQL:")
  console.log("")
  console.log("alter table public.tools add column if not exists platforms text[] default '{}';")
  console.log("update public.tools set platforms = '{\"Web\"}' where platforms is null or platforms = '{}';")
  console.log("NOTIFY pgrst, 'reload schema';")
}

main().catch(console.error)
