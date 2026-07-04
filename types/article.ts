export interface Article {
  id: string
  title: string
  slug: string
  description: string
  content: string
  categoryId: string
  categoryName: string
  readTime: string
  publishedAt: string
  authorName: string
  authorAvatarUrl: string | null
  featured: boolean
  createdAt: string
  updatedAt: string
}
