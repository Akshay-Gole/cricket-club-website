import api from '../../../services/api'
import type { DashboardSummary } from '../types/admin.types'

export const ADMIN_DASHBOARD_QUERY_KEY = ['admin', 'dashboard'] as const

export async function getAdminDashboard() {
  const response = await api.get<{ data: DashboardSummary }>('/admin/dashboard')
  return response.data.data
}

export function relativeTime(value: string) {
  const seconds = Math.max(
    0,
    Math.floor((Date.now() - new Date(value).getTime()) / 1000)
  )

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`
  if (seconds < 172800) return 'Yesterday'
  return `${Math.floor(seconds / 86400)} days ago`
}
