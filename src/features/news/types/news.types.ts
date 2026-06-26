export type NewsCategory = 'news' | 'match-report' | 'event' | 'announcement'
export type ArticleLayout = 'match-report' | 'standard'

export interface NewsArticle {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featuredImage?: string
  category: NewsCategory
  layout?: ArticleLayout
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
  layout?: ArticleLayout
}
