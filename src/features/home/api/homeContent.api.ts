import api from '../../../services/api'

export interface HomeContent {
  matchesPlayed: string
  victories: string
  trophies: string
  activePlayers: string
  yearsActive: string
  tickerText: string
}

interface ApiResponse<T> {
  data: T
}

export type HomeContentInput = Pick<HomeContent, 'tickerText'>

export const EMPTY_HOME_CONTENT: HomeContent = {
  matchesPlayed: '',
  victories: '',
  trophies: '',
  activePlayers: '',
  yearsActive: '',
  tickerText: '',
}

const homeContentApi = {
  getPublic: async (): Promise<HomeContent> => {
    const response = await api.get<ApiResponse<HomeContent>>('/home-content')
    return response.data.data
  },

  getAdmin: async (): Promise<HomeContent> => {
    const response = await api.get<ApiResponse<HomeContent>>(
      '/admin/home-content'
    )
    return response.data.data
  },

  update: async (data: HomeContentInput): Promise<HomeContent> => {
    const response = await api.patch<ApiResponse<HomeContent>>(
      '/admin/home-content',
      data
    )
    return response.data.data
  },
}

export default homeContentApi
