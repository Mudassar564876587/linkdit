"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updatePassword(formData: FormData) {
  const currentPassword = formData.get("currentPassword") as string
  const newPassword = formData.get("newPassword") as string

  if (!currentPassword || !newPassword) return { error: "Both fields required." }
  if (newPassword.length < 8) return { error: "Password must be at least 8 characters." }

  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated." }
  if (!user.email) return { error: "Cannot change password for OAuth accounts here." }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  })
  if (signInError) return { error: "Current password is incorrect." }

  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) return { error: error.message }

  revalidatePath("/dashboard/settings")
  return { success: true }
}

export async function deleteAccount() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated." }

  const { error: delError } = await supabase.rpc("delete_user_account")
  if (delError) return { error: delError.message }

  revalidatePath("/", "layout")
  return { success: true, redirect: "/" }
}

export async function unlinkProvider(provider: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated." }

  const identity = user.identities?.find((i) => i.provider === provider)
  if (!identity) return { error: "Provider not linked." }

  const { error } = await supabase.auth.unlinkIdentity(identity)

  if (error) return { error: error.message }

  revalidatePath("/dashboard/settings")
  return { success: true }
}
