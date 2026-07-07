import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://voavwcfvnviwtweyeeej.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvYXZ3Y2Z2bnZpd3R3ZXllZWVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzE0MDE1NSwiZXhwIjoyMDk4NzE2MTU1fQ.Me1f_XpDHhChfcUYcp6c5s3ZwE5U6F5WFikPqVEroXs"
);

async function test() {
  // Check what role the test user has when viewed from a regular client context
  // First sign in
  const authClient = createClient(
    "https://voavwcfvnviwtweyeeej.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvYXZ3Y2Z2bnZpd3R3ZXllZWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxNDAxNTUsImV4cCI6MjA5ODcxNjE1NX0.20XIBN10D2RDuTbS17O02lT0QKMiNWRqAyEy_8bipRs"
  );

  const { data: signIn, error: signInErr } = await authClient.auth.signInWithPassword({
    email: "test-linkdit@example.com",
    password: "Test123456!",
  });
  if (signInErr) {
    console.error("Sign in failed:", signInErr.message);
    return;
  }
  console.log("Signed in as:", signIn.user?.email);

  // Try to SELECT from users as the authenticated user (this will be subject to RLS)
  console.log("\n=== Trying to SELECT from users as authenticated user ===");
  const { data: users, error: usersErr } = await authClient.from("users").select("id, email, role");
  if (usersErr) {
    console.error("ERROR selecting from users:", usersErr.message);
  } else {
    console.log("Users data:", JSON.stringify(users));
  }

  // Try the insert with full data (mimicking server action)
  console.log("\n=== Trying INSERT with full data ===");
  const { data: cat } = await authClient.from("categories").select("id").limit(1).single();
  const { data: ins, error: insErr } = await authClient.from("tool_submissions").insert({
    submitter_email: "test-linkdit@example.com",
    user_id: signIn.user.id,
    tool_name: "Full Test Tool",
    tool_url: "https://full-test.com",
    description: "Testing full insert",
    full_description: "<p>Full description</p>",
    category_id: cat?.id,
    pricing: "Free",
    tags: ["test", "full"],
    features: ["Feature A"],
    pros: ["Pro 1"],
    cons: ["Con 1"],
    faqs: [{ q: "Question?", a: "Answer!" }],
    contact_email: "test-linkdit@example.com",
    logo_url: null,
    cover_image_url: null,
    gallery_images: [],
    slug: "full-test-tool",
    submission_status: "submitted",
    status: "pending",
  }).select("id").single();
  if (insErr) {
    console.error("INSERT ERROR:", JSON.stringify(insErr, null, 2));
  } else {
    console.log("Insert succeeded, id:", ins.id);
    await authClient.from("tool_submissions").delete().eq("id", ins.id);
  }
}

test().catch(console.error);
