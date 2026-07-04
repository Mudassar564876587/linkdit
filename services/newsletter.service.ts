import { getAdminClient } from "@/lib/supabase"

export async function subscribeToNewsletter(
  email: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getAdminClient()

  const { error: existingError } = await supabase
    .from("newsletter_subscribers")
    .select("id")
    .eq("email", email)
    .maybeSingle()

  if (existingError) {
    return { success: false, error: "Something went wrong. Please try again." }
  }

  const { error } = await supabase.from("newsletter_subscribers").insert({
    email,
    subscribed: true,
    subscribed_at: new Date().toISOString(),
  })

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "You are already subscribed!" }
    }
    return { success: false, error: "Something went wrong. Please try again." }
  }

  return { success: true }
}
