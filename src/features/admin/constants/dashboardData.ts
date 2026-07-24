import { ROUTES } from '../../../constants/routes'
import type { QuickAction } from '../types/admin.types'

export const quickActions: QuickAction[] = [
  {
    label: 'Add Player',
    description: 'Create a new squad profile',
    to: ROUTES.ADMIN_PLAYERS,
    tone: 'gold',
  },
  {
    label: 'Add Fixture',
    description: 'Schedule a new match',
    to: ROUTES.ADMIN_FIXTURES,
    tone: 'green',
  },
  {
    label: 'Review Messages',
    description: 'Check unread enquiries',
    to: ROUTES.ADMIN_MESSAGES,
    tone: 'red',
  },
]
