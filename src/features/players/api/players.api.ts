import api from '../../../services/api'
import type { Player, CreatePlayerDto } from '../types/player.types'

export const playersApi = {
  getAll: async (): Promise<Player[]> => {
    const response = await api.get<Player[]>('/players')
    return response.data
  },

  getById: async (id: string): Promise<Player> => {
    const response = await api.get<Player>(`/players/${id}`)
    return response.data
  },

  create: async (data: CreatePlayerDto): Promise<Player> => {
    const response = await api.post<Player>('/platers', data)
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
