import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../../services/api'
import logger from '../../../services/logger'
import type { Player } from '../types/player.types'
import playersApi from '../api/players.api'

interface PlayersState {
  list: Player[]
  selectedPlayer: Player | null
  isLoading: boolean
  error: string | null
}

const initialState: PlayersState = {
  list: [],
  selectedPlayer: null,
  isLoading: false,
  error: null,
}

export const fetchAllPlayers = createAsyncThunk(
  'players/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const players = await playersApi.getAll()
      logger.info('All Players fetched', { count: players.length })
      return players
    } catch (error) {
      logger.error('Failed to fetch all players', error)
      return rejectWithValue('Could not load players')
    }
  }
)

export const fetchPlayerById = createAsyncThunk(
  'players/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const player = await playersApi.getById(id)
      logger.info('Single Player fetched', { id })
      return player
    } catch (error) {
      logger.error('Failed to fetch single player', error)
      return rejectWithValue('Could not load player')
    }
  }
)

export const deletePlayer = createAsyncThunk(
  'players/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/players/${id}`)
      logger.info('Player deleted', { id })
      return id
    } catch (error) {
      logger.error('Failed to delete player', error)
      return rejectWithValue('Could not delete player')
    }
  }
)

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    selectPlayer: (state, action) => {
      state.selectedPlayer = action.payload
    },
    clearSelectedPlayer: state => {
      state.selectedPlayer = null
    },
    clearError: state => {
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllPlayers.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAllPlayers.fulfilled, (state, action) => {
        state.isLoading = false
        state.list = action.payload
      })
      .addCase(fetchAllPlayers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchPlayerById.fulfilled, (state, action) => {
        state.selectedPlayer = action.payload
      })
      .addCase(deletePlayer.fulfilled, (state, action) => {
        state.list = state.list.filter(player => player.id !== action.payload)
      })
  },
})

export const { selectPlayer, clearSelectedPlayer, clearError } =
  playersSlice.actions

export default playersSlice.reducer
