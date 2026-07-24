import prisma from '../../lib/prisma'
import { uploadRemoteImage } from '../../lib/cloudinary.js'

const INSTAGRAM_GRAPH_URL = 'https://graph.instagram.com'
const DEFAULT_LIMIT = 12
const MAX_LIMIT = 48
const MAX_SYNC_PAGES = 10

interface InstagramApiPost {
  id: string
  caption?: string
  media_type: string
  media_url?: string
  permalink: string
  thumbnail_url?: string
  timestamp: string
}

interface InstagramApiResponse {
  data?: InstagramApiPost[]
  paging?: {
    next?: string
  }
  error?: {
    message?: string
  }
}

interface GalleryQuery {
  year?: number
  page?: number
  limit?: number
}

function requireInstagramConfig() {
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN

  if (!accountId || !accessToken) {
    throw new Error(
      'INSTAGRAM_ACCOUNT_ID and INSTAGRAM_ACCESS_TOKEN are required'
    )
  }

  return { accountId, accessToken }
}

function normaliseInstagramTimestamp(timestamp: string) {
  return timestamp.replace(/([+-]\d{2})(\d{2})$/, '$1:$2')
}

function getYearRange(year: number) {
  return {
    gte: new Date(`${year}-01-01T00:00:00.000Z`),
    lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
  }
}

function clampLimit(limit?: number) {
  if (!limit || limit < 1) return DEFAULT_LIMIT
  return Math.min(limit, MAX_LIMIT)
}

function toPublicGalleryPost(post: {
  id: string
  instagramMediaId: string
  caption: string | null
  mediaType: string
  mediaUrl: string | null
  thumbnailUrl: string | null
  permalink: string
  timestamp: Date
}) {
  return {
    id: post.id,
    instagramMediaId: post.instagramMediaId,
    caption: post.caption,
    mediaType: post.mediaType,
    mediaUrl: post.mediaUrl,
    thumbnailUrl: post.thumbnailUrl,
    imageUrl: post.thumbnailUrl ?? post.mediaUrl ?? '',
    permalink: post.permalink,
    timestamp: post.timestamp.toISOString(),
    year: post.timestamp.getUTCFullYear(),
  }
}

async function fetchInstagramJson(url: string): Promise<InstagramApiResponse> {
  const response = await fetch(url)
  const body = (await response.json()) as InstagramApiResponse

  if (!response.ok) {
    throw new Error(
      body.error?.message ?? `Instagram request failed with ${response.status}`
    )
  }

  return body
}

export async function fetchInstagramPostsFromMeta() {
  const { accountId, accessToken } = requireInstagramConfig()
  const fields = [
    'id',
    'caption',
    'media_type',
    'media_url',
    'permalink',
    'thumbnail_url',
    'timestamp',
  ].join(',')

  let url: string | undefined =
    `${INSTAGRAM_GRAPH_URL}/${accountId}/media` +
    `?fields=${fields}&limit=50&access_token=${accessToken}`

  const posts: InstagramApiPost[] = []
  let pageCount = 0

  while (url && pageCount < MAX_SYNC_PAGES) {
    const body = await fetchInstagramJson(url)
    posts.push(...(body.data ?? []))
    url = body.paging?.next
    pageCount += 1
  }

  return posts
}

export async function syncInstagramPosts() {
  const posts = await fetchInstagramPostsFromMeta()
  const mediaIds = posts.map(post => post.id)
  const existingPosts = await prisma.instagramPost.findMany({
    where: {
      instagramMediaId: {
        in: mediaIds,
      },
    },
    select: {
      instagramMediaId: true,
      thumbnailUrl: true,
    },
  })
  const existingThumbnails = new Map(
    existingPosts.map(post => [post.instagramMediaId, post.thumbnailUrl])
  )

  for (const post of posts) {
    const sourceImage = post.thumbnail_url ?? post.media_url
    const existingThumbnail = existingThumbnails.get(post.id)
    let thumbnailUrl = existingThumbnail

    if (sourceImage && !existingThumbnail?.includes('res.cloudinary.com')) {
      try {
        thumbnailUrl = await uploadRemoteImage(
          sourceImage,
          'top-gs-cc/gallery',
          post.id
        )
      } catch {
        thumbnailUrl = sourceImage
      }
    }

    await prisma.instagramPost.upsert({
      where: {
        instagramMediaId: post.id,
      },
      update: {
        caption: post.caption,
        mediaType: post.media_type,
        mediaUrl: post.media_url,
        thumbnailUrl,
        permalink: post.permalink,
        timestamp: new Date(normaliseInstagramTimestamp(post.timestamp)),
        active: true,
      },
      create: {
        instagramMediaId: post.id,
        caption: post.caption,
        mediaType: post.media_type,
        mediaUrl: post.media_url,
        thumbnailUrl,
        permalink: post.permalink,
        timestamp: new Date(normaliseInstagramTimestamp(post.timestamp)),
        active: true,
      },
    })
  }

  const deactivated =
    mediaIds.length > 0
      ? await prisma.instagramPost.updateMany({
          where: {
            instagramMediaId: {
              notIn: mediaIds,
            },
          },
          data: {
            active: false,
          },
        })
      : { count: 0 }

  return {
    synced: posts.length,
    deactivated: deactivated.count,
  }
}

export async function getGalleryPosts({ year, page = 1, limit }: GalleryQuery) {
  const safePage = Math.max(page, 1)
  const safeLimit = clampLimit(limit)

  const allPostDates = await prisma.instagramPost.findMany({
    where: {
      active: true,
    },
    select: {
      timestamp: true,
    },
    orderBy: {
      timestamp: 'desc',
    },
  })

  const years = Array.from(
    new Set(allPostDates.map(post => post.timestamp.getUTCFullYear()))
  )

  const selectedYear = year ?? years[0] ?? null
  const where =
    selectedYear === null
      ? {
          active: true,
        }
      : {
          active: true,
          timestamp: getYearRange(selectedYear),
        }

  const [posts, total] = await Promise.all([
    prisma.instagramPost.findMany({
      where,
      orderBy: {
        timestamp: 'desc',
      },
      skip: (safePage - 1) * safeLimit,
      take: safeLimit,
    }),
    prisma.instagramPost.count({ where }),
  ])

  return {
    posts: posts.map(toPublicGalleryPost),
    years,
    selectedYear,
    page: safePage,
    limit: safeLimit,
    total,
    totalPages: Math.max(Math.ceil(total / safeLimit), 1),
  }
}
