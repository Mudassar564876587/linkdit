"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validations/auth"

export async function forgotPassword(data: ForgotPasswordInput) {
  const parsed = forgotPasswordSchema.safeParse(data)

  if (!parsed.success) {
    return { error: "Invalid email address." }
  }

  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    }
  )

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
