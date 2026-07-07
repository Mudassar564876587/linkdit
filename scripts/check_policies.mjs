import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://voavwcfvnviwtweyeeej.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvYXZ3Y2Z2bnZpd3R3ZXllZWVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzE0MDE1NSwiZXhwIjoyMDk4NzE2MTU1fQ.Me1f_XpDHhChfcUYcp6c5s3ZwE5U6F5WFikPqVEroXs"
);

const { data: allPolicies, error: pErr } = await supabase
  .from("pg_policies")
  .select("tablename, policyname, permissive, roles, cmd, qual, with_check");
if (pErr) {
  console.log("Cannot query pg_policies:", pErr.message);
} else {
  console.log("\n=== ALL POLICIES ===");
  for (const p of allPolicies) {
    console.log(
      `${p.tablename}.${p.policyname}: ${p.cmd}, qual=${(p.qual || "").substring(0, 200)}, with_check=${(p.with_check || "").substring(0, 200)}`
    );
  }
}
