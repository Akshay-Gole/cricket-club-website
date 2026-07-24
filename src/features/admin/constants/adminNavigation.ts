import { ROUTES } from '../../../constants/routes'

export type AdminIconName =
  | 'dashboard'
  | 'home'
  | 'players'
  | 'fixtures'
  | 'honours'
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
    label: 'Home Content',
    to: ROUTES.ADMIN_HOME_CONTENT,
    icon: 'home',
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
    label: 'Honours',
    to: ROUTES.ADMIN_HONOURS,
    icon: 'honours',
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
    path: ROUTES.ADMIN_HOME_CONTENT,
    eyebrow: 'Homepage Control',
    title: 'Home Content',
  },
  {
    path: ROUTES.ADMIN_FIXTURES,
    eyebrow: 'Match Operations',
    title: 'Fixtures & Results',
    actionLabel: '+ Add Fixture',
    actionTo: ROUTES.ADMIN_FIXTURES,
  },
  {
    path: ROUTES.ADMIN_HONOURS,
    eyebrow: 'Club Legacy',
    title: 'Honours',
    actionLabel: '+ Add Honour',
    actionTo: `${ROUTES.ADMIN_HONOURS}?action=create`,
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
