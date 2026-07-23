import type {
  ArticleLayout,
  NewsArticle,
  NewsCategory,
  NewsStatus,
} from '../../news/types/news.types'

export type NewsFilter = 'all' | NewsCategory

export type AdminNewsStatus = NewsStatus

export interface AdminNewsArticle extends NewsArticle {
  status: AdminNewsStatus
  readTime: string
}

export interface NewsFormState {
  title: string
  category: NewsCategory
  layout: ArticleLayout
  excerpt: string
  content: string
  featuredImageFile: File | null
  featuredImagePreviewUrl: string
  author: string
  status: AdminNewsStatus
}

export const EMPTY_NEWS_FORM: NewsFormState = {
  title: '',
  category: 'news',
  layout: 'standard',
  excerpt: '',
  content: '',
  featuredImageFile: null,
  featuredImagePreviewUrl: '',
  author: "Top G's CC",
  status: 'draft',
}

export const NEWS_CATEGORY_OPTIONS: { value: NewsCategory; label: string }[] = [
  { value: 'news', label: 'Club News' },
  { value: 'match-report', label: 'Match Report' },
  { value: 'event', label: 'Event' },
  { value: 'announcement', label: 'Announcement' },
]

export const NEWS_LAYOUT_OPTIONS: { value: ArticleLayout; label: string }[] = [
  { value: 'standard', label: 'Standard Article' },
  { value: 'match-report', label: 'Match Report' },
]

export const NEWS_FILTERS: { value: NewsFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  ...NEWS_CATEGORY_OPTIONS,
]

export const categoryLabel: Record<NewsCategory, string> = {
  news: 'Club News',
  'match-report': 'Match Report',
  event: 'Event',
  announcement: 'Announcement',
}

export const categoryBadgeClass: Record<NewsCategory, string> = {
  news: 'border-[#6f8cff]/25 bg-[#6f8cff]/[0.08] text-[#9aaeff]',
  'match-report': 'border-gold/25 bg-gold/[0.08] text-gold',
  event: 'border-green-light/25 bg-green-light/[0.08] text-green-light',
  announcement: 'border-[#d86b5f]/25 bg-[#d86b5f]/[0.08] text-[#ff9b8f]',
}

export const statusBadgeClass: Record<AdminNewsStatus, string> = {
  published: 'border-green-light/25 bg-green-light/[0.08] text-green-light',
  draft: 'border-white/[0.12] bg-white/[0.05] text-muted',
}

export const adminNewsInputClass =
  'h-11 w-full rounded border border-white/[0.12] bg-white/[0.045] px-4 font-heading text-sm font-semibold tracking-[0.5px] text-white outline-none placeholder:text-muted focus:border-gold/40'

export const adminNewsTextareaClass =
  'min-h-[120px] w-full resize-y rounded border border-white/[0.12] bg-white/[0.045] px-4 py-3 font-body text-sm font-light leading-[1.7] text-white outline-none placeholder:text-muted focus:border-gold/40'
