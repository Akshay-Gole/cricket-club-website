import axios from 'axios'
import logger from './logger'

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number
    }
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
})

api.interceptors.request.use(
  config => {
    config.metadata = { startTime: Date.now() }

    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    logger.debug(`[API Request] ${config.method?.toUpperCase()} ${config.url}`)

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  response => {
    const ms = Date.now() - (response.config.metadata?.startTime ?? Date.now())
    logger.api(
      response.config.method?.toUpperCase() ?? 'GET',
      response.config.url ?? '',
      response.status,
      ms
    )
    return response
  },
  error => {
    const ms = Date.now() - (error.config?.metadata?.startTime ?? Date.now())

    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/admin/login'
    }

    logger.error(
      `[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
      error,
      { status: error.response?.status, durationMs: ms }
    )

    return Promise.reject(error)
  }
)

export default api
