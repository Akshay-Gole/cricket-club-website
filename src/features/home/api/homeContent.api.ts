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

export const DEFAULT_HOME_CONTENT: HomeContent = {
  matchesPlayed: '48',
  victories: '31',
  trophies: '06',
  activePlayers: '22',
  yearsActive: '01',
  tickerText:
    "Top G's CC def. Norwood CC by 47 runs    ·    Catto named Player of the Match    ·    Next fixture: Top G's CC vs Riverside CC — Sat 31 May    ·    U18s training every Thursday 5PM    ·    Season 2026 registrations now open    ·    ",
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

  update: async (data: HomeContent): Promise<HomeContent> => {
    const response = await api.patch<ApiResponse<HomeContent>>(
      '/admin/home-content',
      data
    )
    return response.data.data
  },
}

export default homeContentApi
