import { createServerSupabaseClient } from "@/lib/supabase/server"
import CommunityReviewsClient from "./community-reviews-client"

export default async function CommunityReviews() {
  const supabase = await createServerSupabaseClient()

  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, rating, title, content, created_at, tool_id, tools(name, slug)")
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(6)

  if (!reviews?.length) return null

  return <CommunityReviewsClient reviews={reviews as never} />
}
