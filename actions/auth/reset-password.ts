"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validations/auth"

export async function resetPassword(data: ResetPasswordInput) {
  const parsed = resetPasswordSchema.safeParse(data)

  if (!parsed.success) {
    return { error: "Invalid form data." }
  }

  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
