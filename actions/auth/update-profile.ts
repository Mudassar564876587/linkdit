"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { onboardingSchema, type OnboardingInput } from "@/lib/validations/auth"

export async function updateProfile(data: OnboardingInput) {
  const parsed = onboardingSchema.safeParse(data)

  if (!parsed.success) {
    return { error: "Invalid form data." }
  }

  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated." }
  }

  const { error } = await supabase.from("users").upsert(
    {
      id: user.id,
      email: user.email!,
      username: parsed.data.username,
      bio: parsed.data.bio ?? null,
      website: parsed.data.website ?? null,
    },
    { onConflict: "id" }
  )

  if (error) {
    if (error.code === "23505") {
      return { error: "This username is already taken." }
    }
    return { error: error.message }
  }

  return { success: true }
}
