export interface Resource {
  id: string
  name: string
  slug: string
  description: string | null
  content: string | null
  categoryId: string | null
  categoryName: string | null
  logoUrl: string | null
  coverImageUrl: string | null
  websiteUrl: string | null
  downloadUrl: string | null
  pricing: string
  features: string[]
  tags: string[]
  featured: boolean
  isPublished: boolean
  createdAt: string
  updatedAt: string
}
