export type AdminTone = 'gold' | 'green' | 'blue' | 'red' | 'neutral'

export interface DashboardStat {
  label: string
  value: string
  change: string
  hint: string
  tone: AdminTone
}

export interface NextFixtureData {
  opponent: string
  date: string
  time: string
  ground: string
  competition: string
  status: 'Upcoming' | 'Live' | 'Completed'
}

export interface RecentMessage {
  id: string
  name: string
  intent: string
  preview: string
  time: string
  unread: boolean
}

export interface RecentActivityItem {
  id: string
  title: string
  detail: string
  time: string
  tone: AdminTone
}

export interface QuickAction {
  label: string
  description: string
  to: string
  tone: AdminTone
}
