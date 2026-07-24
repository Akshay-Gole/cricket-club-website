export const ROUTES = {
  HOME: '/',
  SQUAD: '/squad',
  FIXTURES: '/fixtures',
  HONOURS: '/honours',
  GALLERY: '/gallery',
  CONTACT: '/contact',
  ABOUT: '/about',
  PLAYER_PROFILE: '/players/:id',

  // Admin
  ADMIN_ROOT: '/admin',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_HOME_CONTENT: '/admin/home-content',
  ADMIN_PLAYERS: '/admin/players',
  ADMIN_FIXTURES: '/admin/fixtures',
  ADMIN_HONOURS: '/admin/honours',
  ADMIN_SPONSORS: '/admin/sponsors',
  ADMIN_MESSAGES: '/admin/messages',

  NOT_FOUND: '*',
} as const
