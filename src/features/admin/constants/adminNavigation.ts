import { ROUTES } from '../../../constants/routes'

export type AdminIconName =
  | 'dashboard'
  | 'players'
  | 'fixtures'
  | 'news'
  | 'sponsors'
  | 'messages'

export interface AdminNavigationItem {
  label: string
  to: string
  icon: AdminIconName
  badge?: string
}

export const ADMIN_NAVIGATION: AdminNavigationItem[] = [
  {
    label: 'Dashboard',
    to: ROUTES.ADMIN_DASHBOARD,
    icon: 'dashboard',
  },
  {
    label: 'Players',
    to: ROUTES.ADMIN_PLAYERS,
    icon: 'players',
  },
  {
    label: 'Fixtures',
    to: ROUTES.ADMIN_FIXTURES,
    icon: 'fixtures',
  },
  {
    label: 'News',
    to: ROUTES.ADMIN_NEWS,
    icon: 'news',
  },
  {
    label: 'Sponsors',
    to: ROUTES.ADMIN_SPONSORS,
    icon: 'sponsors',
  },
  {
    label: 'Messages',
    to: ROUTES.ADMIN_MESSAGES,
    icon: 'messages',
    badge: '4',
  },
]

export const ADMIN_PAGE_META = [
  {
    path: ROUTES.ADMIN_DASHBOARD,
    eyebrow: 'Command Centre',
    title: 'Dashboard',
    actionLabel: '+ Add Fixture',
    actionTo: ROUTES.ADMIN_FIXTURES,
  },
  {
    path: ROUTES.ADMIN_PLAYERS,
    eyebrow: 'Squad Operations',
    title: 'Players',
    actionLabel: '+ Add Player',
    actionTo: `${ROUTES.ADMIN_PLAYERS}?action=create`,
  },
  {
    path: ROUTES.ADMIN_FIXTURES,
    eyebrow: 'Match Operations',
    title: 'Fixtures & Results',
    actionLabel: '+ Add Fixture',
    actionTo: ROUTES.ADMIN_FIXTURES,
  },
  {
    path: ROUTES.ADMIN_NEWS,
    eyebrow: 'Club Publishing',
    title: 'News & Articles',
    actionLabel: '+ New Article',
    actionTo: `${ROUTES.ADMIN_NEWS}?action=create`,
  },
  {
    path: ROUTES.ADMIN_SPONSORS,
    eyebrow: 'Club Partners',
    title: 'Sponsors',
    actionLabel: '+ Add Sponsor',
    actionTo: `${ROUTES.ADMIN_SPONSORS}?action=create`,
  },
  {
    path: ROUTES.ADMIN_MESSAGES,
    eyebrow: 'Club Inbox',
    title: 'Messages',
  },
]
