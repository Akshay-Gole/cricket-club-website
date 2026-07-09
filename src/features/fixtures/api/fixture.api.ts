import api from '../../../services/api'
import type {
  Fixture,
  CreateFixtureDto,
  FixtureResult,
} from '../types/fixture.types'

type ApiListResponse<T> = {
  data: T[]
}

type ApiItemResponse<T> = {
  data: T
}

type FixtureFilter = 'all' | FixtureResult

export const fixturesApi = {
  getAll: async (params?: {
    season?: string
    result?: FixtureFilter
  }): Promise<Fixture[]> => {
    const response = await api.get<ApiListResponse<Fixture>>('/fixtures', {
      params,
    })
    return response.data.data
  },

  getUpcoming: async (): Promise<Fixture[]> => {
    const fixtures = await fixturesApi.getAll({ result: 'upcoming' })
    return fixtures
  },

  getResults: async (season?: string): Promise<Fixture[]> => {
    const fixtures = await fixturesApi.getAll({ season })
    return fixtures.filter(fixture => fixture.result !== 'upcoming')
  },

  getById: async (id: string): Promise<Fixture> => {
    const response = await api.get<ApiItemResponse<Fixture>>(`/fixtures/${id}`)
    return response.data.data
  },

  getAdmin: async (): Promise<Fixture[]> => {
    const response = await api.get<ApiListResponse<Fixture>>('/admin/fixtures')
    return response.data.data
  },

  create: async (data: CreateFixtureDto): Promise<Fixture> => {
    const response = await api.post<ApiItemResponse<Fixture>>(
      '/admin/fixtures',
      data
    )
    return response.data.data
  },

  update: async (id: string, data: CreateFixtureDto): Promise<Fixture> => {
    const response = await api.patch<ApiItemResponse<Fixture>>(
      `/admin/fixtures/${id}`,
      data
    )
    return response.data.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/fixtures/${id}`)
  },
}

export default fixturesApi
