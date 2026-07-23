import api from '../../../services/api'
import type { NewsArticle, CreateNewsDto } from '../types/news.types'

interface ApiResponse<T> {
  data: T
}

export const newsApi = {
  getAll: async (category?: string): Promise<NewsArticle[]> => {
    const url = category ? `/news?category=${category}` : '/news'
    const response = await api.get<ApiResponse<NewsArticle[]>>(url)
    return response.data.data
  },

  getBySlug: async (slug: string): Promise<NewsArticle> => {
    const response = await api.get<ApiResponse<NewsArticle>>(`/news/${slug}`)
    return response.data.data
  },

  getAdminAll: async (): Promise<NewsArticle[]> => {
    const response = await api.get<ApiResponse<NewsArticle[]>>('/admin/news')
    return response.data.data
  },

  createAdmin: async (data: CreateNewsDto): Promise<NewsArticle> => {
    const response = await api.post<ApiResponse<NewsArticle>>(
      '/admin/news',
      data
    )
    return response.data.data
  },

  updateAdmin: async (
    id: string,
    data: CreateNewsDto
  ): Promise<NewsArticle> => {
    const response = await api.patch<ApiResponse<NewsArticle>>(
      `/admin/news/${id}`,
      data
    )
    return response.data.data
  },

  deleteAdmin: async (id: string): Promise<void> => {
    await api.delete(`/admin/news/${id}`)
  },
}

export default newsApi
