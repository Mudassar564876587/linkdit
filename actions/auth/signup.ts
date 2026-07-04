"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { signupSchema, type SignupInput } from "@/lib/validations/auth"

export async function signup(data: SignupInput) {
  const parsed = signupSchema.safeParse(data)

  if (!parsed.success) {
    return { error: "Invalid form data." }
  }

  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "An account with this email already exists." }
    }
    return { error: error.message }
  }

  return { success: true }
}
