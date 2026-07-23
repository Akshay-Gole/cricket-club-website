export type NewsCategory = 'news' | 'match-report' | 'event' | 'announcement'
export type ArticleLayout = 'match-report' | 'standard'
export type NewsStatus = 'published' | 'draft'
export type NewsBlockType =
  | 'paragraph'
  | 'heading'
  | 'image'
  | 'quote'
  | 'callout'

export interface NewsBlock {
  type: NewsBlockType
  data: Record<string, unknown>
}

export interface NewsArticle {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featuredImage?: string
  category: NewsCategory
  layout: ArticleLayout
  author: string
  publishedAt: string
  updatedAt: string
  status?: NewsStatus
  readTime: string
  blocks: NewsBlock[]
}

export interface CreateNewsDto {
  title: string
  content: string
  excerpt: string
  featuredImage?: string
  category: NewsCategory
  layout: ArticleLayout
  author?: string
  status?: NewsStatus
  blocks?: NewsBlock[]
}
