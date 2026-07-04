import { Star } from "lucide-react"

export default function RatingStars({ rating, size = 4 }: { rating: number; size?: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size * 4}
          className={`h-${size} w-${size} ${
            i <= full
              ? "fill-amber-400 text-amber-400"
              : i === full + 1 && half
              ? "fill-amber-400/50 text-amber-400"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  )
}
