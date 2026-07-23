import { ROUTES } from '../../../constants/routes'
import type {
  DashboardStat,
  NextFixtureData,
  QuickAction,
  RecentActivityItem,
  RecentMessage,
} from '../types/admin.types'

export const dashboardStats: DashboardStat[] = [
  {
    label: 'Squad Members',
    value: '24',
    change: '+3 this month',
    hint: 'Active registered players',
    tone: 'gold',
  },
  {
    label: 'Fixtures',
    value: '18',
    change: '6 upcoming',
    hint: 'Season 2026 matches',
    tone: 'green',
  },
  {
    label: 'Messages',
    value: '12',
    change: '4 unread',
    hint: 'Contact form enquiries',
    tone: 'blue',
  },
  {
    label: 'Applications',
    value: '7',
    change: '2 need review',
    hint: 'New member requests',
    tone: 'red',
  },
]

export const nextFixture: NextFixtureData = {
  opponent: 'Eastern Suburbs CC',
  date: '14 Jun 2026',
  time: '10:00 AM',
  ground: 'Kensington Oval, Adelaide',
  competition: 'Senior Division',
  status: 'Upcoming',
}

export const recentMessages: RecentMessage[] = [
  {
    id: 'msg-1',
    name: 'Ryan Smith',
    intent: 'Player enquiry',
    preview: 'I would like to join trials for the upcoming season...',
    time: '12 min ago',
    unread: true,
  },
  {
    id: 'msg-2',
    name: 'Sarah Jones',
    intent: 'Sponsorship',
    preview: 'We are interested in supporting the club this season...',
    time: '1 hr ago',
    unread: true,
  },
  {
    id: 'msg-3',
    name: 'Amit Patel',
    intent: 'General enquiry',
    preview: 'Can you share more details about junior cricket?',
    time: 'Yesterday',
    unread: false,
  },
]

export const recentActivity: RecentActivityItem[] = [
  {
    id: 'act-1',
    title: 'Fixture updated',
    detail: 'Top G’s CC vs Eastern Suburbs CC',
    time: '20 min ago',
    tone: 'green',
  },
  {
    id: 'act-2',
    title: 'New player added',
    detail: 'James Catto was added to squad',
    time: '2 hrs ago',
    tone: 'gold',
  },
  {
    id: 'act-3',
    title: 'Message received',
    detail: 'New sponsorship enquiry',
    time: 'Today',
    tone: 'blue',
  },
  {
    id: 'act-4',
    title: 'Application pending',
    detail: '2 membership forms need review',
    time: 'Yesterday',
    tone: 'red',
  },
]

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
  // News is paused for now.
  // {
  //   label: 'Write News',
  //   description: 'Publish a club update',
  //   to: ROUTES.ADMIN_NEWS,
  //   tone: 'blue',
  // },
  {
    label: 'Review Messages',
    description: 'Check unread enquiries',
    to: ROUTES.ADMIN_MESSAGES,
    tone: 'red',
  },
]
