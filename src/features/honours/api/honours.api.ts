import api from '../../../services/api'
import type {
  HonourAwardInput,
  HonourManualRecordInput,
  HonoursData,
  HonourTrophyInput,
} from '../types/honour.types'

type ApiResponse<T> = {
  data: T
}

const honoursApi = {
  getPublic: async (): Promise<HonoursData> => {
    const response = await api.get<ApiResponse<HonoursData>>('/honours')
    return response.data.data
  },

  getAdmin: async (): Promise<HonoursData> => {
    const response = await api.get<ApiResponse<HonoursData>>('/admin/honours')
    return response.data.data
  },

  createTrophy: async (data: HonourTrophyInput): Promise<HonoursData> => {
    const response = await api.post<ApiResponse<HonoursData>>(
      '/admin/honours/trophies',
      data
    )
    return response.data.data
  },

  updateTrophy: async (
    id: string,
    data: HonourTrophyInput
  ): Promise<HonoursData> => {
    const response = await api.patch<ApiResponse<HonoursData>>(
      `/admin/honours/trophies/${id}`,
      data
    )
    return response.data.data
  },

  deleteTrophy: async (id: string): Promise<void> => {
    await api.delete(`/admin/honours/trophies/${id}`)
  },

  createAward: async (data: HonourAwardInput): Promise<HonoursData> => {
    const response = await api.post<ApiResponse<HonoursData>>(
      '/admin/honours/awards',
      data
    )
    return response.data.data
  },

  updateAward: async (
    id: string,
    data: HonourAwardInput
  ): Promise<HonoursData> => {
    const response = await api.patch<ApiResponse<HonoursData>>(
      `/admin/honours/awards/${id}`,
      data
    )
    return response.data.data
  },

  deleteAward: async (id: string): Promise<void> => {
    await api.delete(`/admin/honours/awards/${id}`)
  },

  updateManualRecord: async (
    id: string,
    data: HonourManualRecordInput
  ): Promise<HonoursData> => {
    const response = await api.put<ApiResponse<HonoursData>>(
      `/admin/honours/manual-records/${id}`,
      data
    )
    return response.data.data
  },

  deleteManualRecord: async (id: string): Promise<void> => {
    await api.delete(`/admin/honours/manual-records/${id}`)
  },
}

export default honoursApi
