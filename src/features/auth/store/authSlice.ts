import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../../services/api'
import logger from '../../../services/logger'
import type { User, LoginDto } from '../types/auth.types'

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
}

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginDto, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials)
      const { user, token } = response.data

      localStorage.setItem('token', token)

      logger.info('Login successful', { email: user.email })

      return user as User
    } catch (error) {
      logger.error('Login failed', error)
      return rejectWithValue('Invalid email or password')
    }
  }
)

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  try {
    await api.post('/auth/logout')
  } catch (error) {
    logger.error('Logout API call failed', error)
  } finally {
    localStorage.removeItem('token')
    logger.info('Logout successful')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(logoutUser.fulfilled, state => {
        state.user = null
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
