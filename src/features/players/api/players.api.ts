import api from '../../../services/api'
import type { Player, CreatePlayerDto } from '../types/player.types'

interface ApiResponse<T> {
  data: T
}

interface ApiPlayer {
  id: string
  name: string
  role: Player['role']
  jerseyNumber: number
  imageUrl?: string | null
  playCricketPlayerId?: string | null
  stats: {
    battingAverage: number
    bestBowling: string
  }
  careerStats?: Player['careerStats']
  recentPerformances?: Player['recentPerformances']
  isCaptain?: boolean
  isFeatured?: boolean
  featuredStatValue?: string | null
  featuredStatLabel?: string | null
  active?: boolean
}

export function mapApiPlayer(player: ApiPlayer): Player {
  return {
    id: player.id,
    name: player.name,
    role: player.role,
    jerseyNumber: player.jerseyNumber,
    battingAverage: player.stats.battingAverage,
    bestBowling: player.stats.bestBowling,
    imageUrl: player.imageUrl ?? undefined,
    playCricketPlayerId: player.playCricketPlayerId ?? undefined,
    careerStats: player.careerStats ?? null,
    recentPerformances: player.recentPerformances ?? [],
    isCaptain: player.isCaptain,
    isFeatured: player.isFeatured,
    featuredStatValue: player.featuredStatValue ?? undefined,
    featuredStatLabel: player.featuredStatLabel ?? undefined,
    active: player.active,
  }
}

export const playersApi = {
  getAll: async (): Promise<Player[]> => {
    const response = await api.get<ApiResponse<ApiPlayer[]>>('/players')
    return response.data.data.map(mapApiPlayer)
  },

  getById: async (id: string): Promise<Player> => {
    const response = await api.get<ApiResponse<ApiPlayer>>(`/players/${id}`)
    return mapApiPlayer(response.data.data)
  },

  create: async (data: CreatePlayerDto): Promise<Player> => {
    const response = await api.post<Player>('/players', data)
    return response.data
  },

  update: async (
    id: string,
    data: Partial<CreatePlayerDto>
  ): Promise<Player> => {
    const response = await api.put<Player>(`/players/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/players/${id}`)
  },

  uploadPhoto: async (
    id: string,
    file: File
  ): Promise<{ photoUrl: string }> => {
    const formData = new FormData()
    formData.append('photo', file)

    const response = await api.post<{ photoUrl: string }>(
      `/players/${id}/photo`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return response.data
  },
}

export default playersApi
