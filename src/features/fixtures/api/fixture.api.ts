import api from '../../../services/api'
import type {
  Fixture,
  CreateFixtureDto,
  FixtureResult,
} from '../types/fixture.types'

export const fixturesApi = {
  getUpcoming: async (): Promise<Fixture[]> => {
    const response = await api.get<Fixture[]>('/fixtures/upcoming')
    return response.data
  },

  getResults: async (season?: string): Promise<Fixture[]> => {
    const url = season
      ? `/fixtures/results?season=${season}`
      : '/fixtures/results'
    const response = await api.get<Fixture[]>(url)
    return response.data
  },

  getById: async (id: string): Promise<Fixture> => {
    const response = await api.get<Fixture>(`/fixtures/${id}`)
    return response.data
  },

  create: async (data: CreateFixtureDto): Promise<Fixture> => {
    const response = await api.post<Fixture>('/fixtures', data)
    return response.data
  },

  update: async (
    id: string,
    data: Partial<CreateFixtureDto>
  ): Promise<Fixture> => {
    const response = await api.put<Fixture>(`/fixtures/${id}`, data)
    return response.data
  },

  updateResult: async (id: string, result: FixtureResult): Promise<Fixture> => {
    const response = await api.patch<Fixture>(`/fixtures/${id}/result`, {
      result,
    })
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/fixtures/${id}`)
  },
}

export default fixturesApi
