"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { loginSchema, type LoginInput } from "@/lib/validations/auth"

export async function login(data: LoginInput) {
  const parsed = loginSchema.safeParse(data)

  if (!parsed.success) {
    return { error: "Invalid form data." }
  }

  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    if (error.message === "Invalid login credentials") {
      return { error: "Invalid email or password." }
    }
    if (error.message.includes("Email not confirmed")) {
      return { error: "Please verify your email before logging in." }
    }
    return { error: error.message }
  }

  return { success: true }
}
