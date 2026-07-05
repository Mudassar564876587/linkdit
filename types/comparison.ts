export interface Comparison {
  id: string
  slug: string
  title: string
  description: string
  toolAId: string
  toolBId: string
  categoryId: string | null
  toolANotes: string
  toolBNotes: string
  prosA: string[]
  prosB: string[]
  consA: string[]
  consB: string[]
  featuresComparison: ComparisonFeature[]
  pricingComparison: ComparisonPricing[]
  ratingsComparison: ComparisonRating[]
  views: number
  isFeatured: boolean
  isPublished: boolean
  seoTitle: string | null
  seoDescription: string | null
  createdAt: string
  updatedAt: string
}

export interface ComparisonFeature {
  name: string
  toolAValue: string | boolean
  toolBValue: string | boolean
}

export interface ComparisonPricing {
  aspect: string
  toolAValue: string | number
  toolBValue: string | number
}

export interface ComparisonRating {
  aspect: string
  toolARating: number
  toolBRating: number
}

export interface ComparisonWithTools extends Comparison {
  toolA: {
    id: string
    name: string
    slug: string
    description: string
    logoUrl: string | null
    websiteUrl: string
    websiteLabel: string
    pricing: string
    rating: number
    reviewCount: number
    features: string[]
    pros: string[]
    cons: string[]
    categoryName: string | null
  }
  toolB: {
    id: string
    name: string
    slug: string
    description: string
    logoUrl: string | null
    websiteUrl: string
    websiteLabel: string
    pricing: string
    rating: number
    reviewCount: number
    features: string[]
    pros: string[]
    cons: string[]
    categoryName: string | null
  }
  categoryName: string | null
}

export interface ComparisonFilters {
  search?: string
  category?: string
  sort?: "popular" | "recent" | "featured"
}
