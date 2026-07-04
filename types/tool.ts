export type ToolPricing = "Free" | "Freemium" | "Paid"

export interface Tool {
  id: string
  name: string
  slug: string
  description: string
  categoryId: string
  categoryName: string
  logoUrl: string | null
  websiteUrl: string
  pricing: ToolPricing
  rating: number
  reviewCount: number
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface ToolFilters {
  category?: string
  search?: string
  pricing?: ToolPricing
  minRating?: number
  featured?: boolean
}
