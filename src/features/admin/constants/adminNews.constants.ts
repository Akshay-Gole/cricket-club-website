import type { NewsArticle, NewsCategory } from '../../news/types/news.types'

export type NewsFilter = 'all' | NewsCategory

export type AdminNewsStatus = 'published' | 'draft'

export interface AdminNewsArticle extends NewsArticle {
  status: AdminNewsStatus
  readTime: string
}

export interface NewsFormState {
  title: string
  category: NewsCategory
  excerpt: string
  content: string
  featuredImageFile: File | null
  featuredImagePreviewUrl: string
  status: AdminNewsStatus
}

export const EMPTY_NEWS_FORM: NewsFormState = {
  title: '',
  category: 'news',
  excerpt: '',
  content: '',
  featuredImageFile: null,
  featuredImagePreviewUrl: '',
  status: 'draft',
}

export const NEWS_CATEGORY_OPTIONS: { value: NewsCategory; label: string }[] = [
  { value: 'news', label: 'Club News' },
  { value: 'match-report', label: 'Match Report' },
  { value: 'event', label: 'Event' },
  { value: 'announcement', label: 'Announcement' },
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

export const MOCK_NEWS_ARTICLES: AdminNewsArticle[] = [
  {
    id: 'news-1',
    title: 'Top G’s Demolish Norwood by 47 Runs in Season Opener',
    slug: 'top-gs-demolish-norwood-by-47-runs',
    excerpt:
      'A commanding all-round performance saw us take control early, restricting the opposition to 112 despite fine conditions.',
    content:
      'Top G’s CC opened the season with a strong performance against Norwood CC. Batting first, the side posted 159 / 8 before the bowlers finished the job with disciplined lines and sharp fielding.',
    featuredImage: '',
    category: 'match-report',
    author: 'Admin',
    publishedAt: '2026-05-22',
    updatedAt: '2026-05-22',
    status: 'published',
    readTime: '4 min read',
  },
  {
    id: 'news-2',
    title: 'Season 2026 Registrations Are Now Open',
    slug: 'season-2026-registrations-are-now-open',
    excerpt:
      'Applications for the upcoming season are live. Junior, Senior, and Social memberships are available from this week.',
    content:
      'Registrations for Season 2026 are now open. Players, supporters, volunteers and families are invited to join the club for another big year.',
    featuredImage: '',
    category: 'announcement',
    author: 'Admin',
    publishedAt: '2026-05-18',
    updatedAt: '2026-05-18',
    status: 'published',
    readTime: '2 min read',
  },
  {
    id: 'news-3',
    title: 'Club Night & End of Season Presentation — June 14',
    slug: 'club-night-end-of-season-presentation-june-14',
    excerpt:
      'Join us at the clubhouse for awards, highlights reel, and celebrations. All members, families and sponsors welcome.',
    content:
      'The club will host its presentation evening on June 14. The night will include awards, speeches, food and a celebration of the season.',
    featuredImage: '',
    category: 'event',
    author: 'Admin',
    publishedAt: '2026-05-15',
    updatedAt: '2026-05-15',
    status: 'draft',
    readTime: '1 min read',
  },
]
