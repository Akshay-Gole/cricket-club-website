import api from '../../../services/api'
import type { NewsArticle, CreateNewsDto } from '../types/news.types'

export const newsApi = {
  getAll: async (category?: string): Promise<NewsArticle[]> => {
    const url = category ? `/news?category=${category}` : '/news'
    const response = await api.get<NewsArticle[]>(url)
    return response.data
  },

  getBySlug: async (slug: string): Promise<NewsArticle> => {
    const response = await api.get<NewsArticle>(`/news/${slug}`)
    return response.data
  },

  create: async (data: CreateNewsDto): Promise<NewsArticle> => {
    const response = await api.post<NewsArticle>('/news', data)
    return response.data
  },

  update: async (
    slug: string,
    data: Partial<CreateNewsDto>
  ): Promise<NewsArticle> => {
    const response = await api.put<NewsArticle>(`/news/${slug}`, data)
    return response.data
  },

  delete: async (slug: string): Promise<void> => {
    await api.delete(`/news/${slug}`)
  },
}

export default newsApi
