import type { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import AdminReviewsClient from "./admin-reviews-client"

export const metadata: Metadata = { title: "Reviews | Admin | LinkDit" }

export default async function AdminReviewsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, users(full_name, email), tools(name, slug), reviewer_profiles(*)")
    .order("created_at", { ascending: false })

  return <AdminReviewsClient reviews={(reviews ?? [])} />
}
