export type NewsCategory = 'news' | 'match-report' | 'event' | 'announcement'

export interface NewsArticle {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featuredImage?: string
  category: NewsCategory
  author: string
  publishedAt: string
  updatedAt: string
}

export interface CreateNewsDto {
  title: string
  content: string
  excerpt: string
  featuredImage?: string
  category: NewsCategory
}
