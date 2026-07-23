import type { NewsArticle } from '../types/news.types'

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: '1',
    slug: 'top-gs-demolish-norwood-season-opener',
    title: "Top G's Demolish Norwood by 47 Runs in Dominant Opener",
    excerpt:
      "A captain's fifty, three wickets from Ryan, and total control with the ball. Top G's CC announced their 2026 intentions in emphatic fashion.",
    content:
      'From the first over it was clear this was not going to be a close contest.',
    category: 'match-report',
    layout: 'match-report',
    author: 'James Catto',
    publishedAt: '2026-05-22',
    updatedAt: '2026-05-22',
    status: 'published',
    readTime: '1 min read',
    blocks: [
      {
        type: 'paragraph',
        data: {
          text: 'From the first over it was clear this was not going to be a close contest.',
        },
      },
    ],
  },
  {
    id: '2',
    slug: 'season-2026-registrations-open',
    title: 'Season 2026 Registrations Are Now Open — Secure Your Spot',
    excerpt:
      'Applications for the upcoming season are live. Junior, senior, and social memberships are all available from this week.',
    content:
      'The club is now welcoming new and returning members for the 2026 season.\n\nPlayers can register for senior, junior and social membership options. The committee will review applications weekly and contact new players about training times, trials and team availability.\n\nFamilies, volunteers and supporters are also invited to get involved. A strong club season is not only built on match day — it is built by everyone around the squad.',
    category: 'news',
    layout: 'standard',
    author: 'Top G’s CC',
    publishedAt: '2026-05-18',
    updatedAt: '2026-05-18',
    status: 'published',
    readTime: '2 min read',
    blocks: [
      {
        type: 'paragraph',
        data: {
          text: 'The club is now welcoming new and returning members for the 2026 season.',
        },
      },
      {
        type: 'paragraph',
        data: {
          text: 'Players can register for senior, junior and social membership options. The committee will review applications weekly and contact new players about training times, trials and team availability.',
        },
      },
      {
        type: 'paragraph',
        data: {
          text: 'Families, volunteers and supporters are also invited to get involved. A strong club season is not only built on match day — it is built by everyone around the squad.',
        },
      },
    ],
  },
  {
    id: '3',
    slug: 'club-night-end-season-presentation',
    title: 'Club Night & End of Season Presentation — June 14',
    excerpt:
      'Join us at the clubhouse for awards, highlights reel, and celebrations. All members, families and sponsors welcome.',
    content:
      'The club will close the season with a presentation night for players, families and supporters.\n\nThe evening will include awards, speeches, food, season highlights and a few stories that probably should not leave the room.\n\nMembers are encouraged to bring family and friends. Sponsors are warmly welcome as we celebrate the people who helped build the year.',
    category: 'event',
    layout: 'standard',
    author: 'Top G’s CC',
    publishedAt: '2026-05-15',
    updatedAt: '2026-05-15',
    status: 'published',
    readTime: '2 min read',
    blocks: [
      {
        type: 'paragraph',
        data: {
          text: 'The club will close the season with a presentation night for players, families and supporters.',
        },
      },
      {
        type: 'paragraph',
        data: {
          text: 'The evening will include awards, speeches, food, season highlights and a few stories that probably should not leave the room.',
        },
      },
      {
        type: 'paragraph',
        data: {
          text: 'Members are encouraged to bring family and friends. Sponsors are warmly welcome as we celebrate the people who helped build the year.',
        },
      },
    ],
  },
]

export const getArticleBySlug = (slug?: string) =>
  NEWS_ARTICLES.find(article => article.slug === slug) ?? NEWS_ARTICLES[0]

export const formatArticleDate = (date: string) => {
  const value = date.includes('T') ? date : `${date}T00:00:00`
  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) return 'Date unavailable'

  return new Intl.DateTimeFormat('en-AU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(parsedDate)
}

export const categoryLabel = {
  news: 'Club News',
  'match-report': 'Match Report',
  event: 'Events',
  announcement: 'Announcement',
} satisfies Record<NewsArticle['category'], string>
