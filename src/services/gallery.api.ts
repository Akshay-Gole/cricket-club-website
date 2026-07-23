const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'

export interface GalleryPost {
  id: string
  instagramMediaId: string
  caption: string | null
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM' | string
  mediaUrl: string | null
  thumbnailUrl: string | null
  permalink: string
  timestamp: string
  year: number
}

export interface GalleryResponse {
  posts: GalleryPost[]
  years: number[]
  activeYear: number | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface GalleryApiResponse {
  posts: GalleryPost[]
  years: number[]
  selectedYear: number | null
  page: number
  limit: number
  total: number
  totalPages: number
}

function apiUrl(
  path: string,
  params?: Record<string, number | string | undefined>
) {
  const url = new URL(`${API_URL}${path}`)

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })

  return url.toString()
}

export async function getGalleryPosts(params: {
  year?: number
  page?: number
  limit?: number
}) {
  const response = await fetch(apiUrl('/gallery', params))

  if (!response.ok) {
    throw new Error('Could not load gallery posts')
  }

  const payload = (await response.json()) as { data: GalleryApiResponse }
  const { data } = payload

  return {
    posts: data.posts,
    years: data.years,
    activeYear: data.selectedYear,
    pagination: {
      page: data.page,
      limit: data.limit,
      total: data.total,
      totalPages: data.totalPages,
    },
  }
}
