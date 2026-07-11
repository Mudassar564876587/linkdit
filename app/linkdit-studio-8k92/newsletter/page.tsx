import type { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import AdminNewsletterClient from "./admin-newsletter-client"

export const metadata: Metadata = { title: "Newsletter | Admin | LinkDit" }

export default async function AdminNewsletterPage() {
  const admin = getAdminClient()
  const { data: subscribers } = await admin
    .from("newsletter_subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false })

  return <AdminNewsletterClient subscribers={subscribers ?? []} />
}
