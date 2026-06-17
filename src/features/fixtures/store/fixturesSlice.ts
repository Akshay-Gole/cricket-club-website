import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../../services/api'
import logger from '../../../services/logger'
import type { Fixture } from '../types/fixture.types'

interface FixturesState {
  upcoming: Fixture[]
  results: Fixture[]
  selectedFixture: Fixture | null
  selectedSeason: string
  isLoading: boolean
  error: string | null
}

const initialState: FixturesState = {
  upcoming: [],
  results: [],
  selectedFixture: null,
  selectedSeason: String(new Date().getFullYear()),
  isLoading: false,
  error: null,
}

export const fetchUpcomingFixtures = createAsyncThunk(
  'fixtures/fetchUpcoming',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/fixtures/upcoming')
      logger.info('Upcoming fixtures fetched', { count: response.data.length })
      return response.data as Fixture[]
    } catch (error) {
      logger.error('Failed to fetch upcoming fixtures', error)
      return rejectWithValue('Could not load upcoming fixtures')
    }
  }
)

export const fetchResults = createAsyncThunk(
  'fixtures/fetchResults',
  async (season: string | undefined, { rejectWithValue }) => {
    try {
      const url = season
        ? `/fixtures/results?season=${season}`
        : '/fixtures/results'
      const response = await api.get(url)
      logger.info('Results fetched', { season, count: response.data.length })
      return response.data as Fixture[]
    } catch (error) {
      logger.error('Failed to fetch results', error)
      return rejectWithValue('Could not load results')
    }
  }
)

export const fetchFixtureById = createAsyncThunk(
  'fixtures/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/fixtures/${id}`)
      logger.info('Fixture fetched', { id })
      return response.data as Fixture
    } catch (error) {
      logger.error('Failed to fetch fixture', error)
      return rejectWithValue('Could not load fixture')
    }
  }
)

const fixturesSlice = createSlice({
  name: 'fixtures',
  initialState,
  reducers: {
    setSeason: (state, action) => {
      state.selectedSeason = action.payload
    },
    selectFixture: (state, action) => {
      state.selectedFixture = action.payload
    },
    clearError: state => {
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUpcomingFixtures.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUpcomingFixtures.fulfilled, (state, action) => {
        state.isLoading = false
        state.upcoming = action.payload
      })
      .addCase(fetchUpcomingFixtures.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchResults.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchResults.fulfilled, (state, action) => {
        state.isLoading = false
        state.results = action.payload
      })
      .addCase(fetchResults.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchFixtureById.fulfilled, (state, action) => {
        state.selectedFixture = action.payload
      })
  },
})

export const { setSeason, selectFixture, clearError } = fixturesSlice.actions
export default fixturesSlice.reducer
