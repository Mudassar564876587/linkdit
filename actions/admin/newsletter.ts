"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { logAuditEvent } from "@/lib/audit"

async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from("users").select("role").eq("id", userId).single()
  return data?.role === "admin"
}

export async function adminDeleteSubscriber(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }
  const { data: subscriber } = await supabase.from("newsletter_subscribers").select("email").eq("id", id).single()
  await supabase.from("newsletter_subscribers").delete().eq("id", id)
  await logAuditEvent({ action: "delete", entityType: "newsletter_subscriber", entityId: id, metadata: { email: subscriber?.email } })
  revalidatePath("/linkdit-studio-8k92/newsletter")
  return { success: true }
}

export async function adminExportSubscribersCSV() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }

  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("email, subscribed, subscribed_at, unsubscribed_at")
    .order("subscribed_at", { ascending: false })

  if (!subscribers?.length) return { error: "No subscribers." }

  const header = "Email,Subscribed,Subscribed At,Unsubscribed At"
  const rows = subscribers.map((s) =>
    `"${s.email}",${s.subscribed ? "Yes" : "No"},"${s.subscribed_at || ""}","${s.unsubscribed_at || ""}"`
  )
  const csv = [header, ...rows].join("\n")

  return { success: true, csv }
}
