import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ReviewsList from "./reviews-list"

export default async function ReviewsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, rating, content, is_approved, created_at, updated_at, tools!inner(name, slug)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My reviews</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {reviews?.length ?? 0} review{(reviews?.length ?? 0) !== 1 ? "s" : ""}
        </p>
      </div>

      <ReviewsList reviews={reviews ?? []} />
    </div>
  )
}
