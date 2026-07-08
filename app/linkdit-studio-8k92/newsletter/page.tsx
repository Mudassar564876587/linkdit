import type { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import AdminNewsletterClient from "./admin-newsletter-client"

export const metadata: Metadata = { title: "Newsletter | Admin | LinkDit" }

export default async function AdminNewsletterPage() {
  const supabase = await createServerSupabaseClient()
  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false })

  return <AdminNewsletterClient subscribers={subscribers ?? []} />
}
