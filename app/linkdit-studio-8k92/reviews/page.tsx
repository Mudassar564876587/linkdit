import type { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import AdminReviewsClient from "./admin-reviews-client"

export const metadata: Metadata = { title: "Reviews | Admin | LinkDit" }

export default async function AdminReviewsPage() {
  const admin = getAdminClient()
  const { data: reviews } = await admin
    .from("reviews")
    .select("*, users(full_name, email), tools(name, slug), reviewer_profiles(*)")
    .order("created_at", { ascending: false })

  return <AdminReviewsClient reviews={(reviews ?? [])} />
}
