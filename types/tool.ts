export type ToolPricing = "Free" | "Freemium" | "Paid"
export type ToolPlatform = "Web" | "Mobile" | "Mac" | "Windows" | "Linux" | "iOS" | "Android" | "Chrome" | "API"

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
  platforms: ToolPlatform[]
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
  platforms?: ToolPlatform[]
  minRating?: number
  featured?: boolean
}