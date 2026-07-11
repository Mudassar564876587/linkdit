import ReviewCard from "@/components/tools/review-card"

type ReviewerProfile = {
  id: string
  full_name: string
  username: string
  avatar_url: string | null
  country: string
  city: string | null
  job_title: string
  industry: string | null
  experience_level: string
  years_of_experience: number | null
  helpful_count: number | null
}

type ReviewUser = {
  full_name: string | null
  avatar_url: string | null
}

type Review = {
  id: string
  rating: number
  title: string | null
  content: string | null
  pros: string[] | null
  cons: string[] | null
  best_for: string | null
  would_recommend: boolean | null
  helpful_count: number | null
  usage_duration: string | null
  primary_use_case: string | null
  verified_user: boolean | null
  verified_purchase: boolean | null
  created_at: string
  users: ReviewUser | null
  reviewer_profiles: ReviewerProfile | null
}

export default function ReviewsList({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) {
    return <p className="text-sm text-muted-foreground">No reviews yet.</p>
  }

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <ReviewCard key={r.id} review={r} />
      ))}
    </div>
  )
}
