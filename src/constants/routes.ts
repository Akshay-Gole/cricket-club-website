export const ROUTES = {
  HOME: '/',
  SQUAD: '/squad',
  FIXTURES: '/fixtures',
  HONOURS: '/honours',
  NEWS: '/news',
  NEWS_ARTICLE: '/news/:slug',
  GALLERY: '/gallery',
  CONTACT: '/contact',
  JOIN: '/join',
  ABOUT: '/about',
  SPONSORS: '/sponsors',
  PLAYER_PROFILE: '/players/:id',

  // Admin
  ADMIN_ROOT: '/admin',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PLAYERS: '/admin/players',
  ADMIN_FIXTURES: '/admin/fixtures',
  ADMIN_NEWS: '/admin/news',
  ADMIN_HONOURS: '/admin/honours',
  ADMIN_GALLERY: '/admin/gallery',
  ADMIN_SPONSORS: '/admin/sponsors',
  ADMIN_MESSAGES: '/admin/messages',

  NOT_FOUND: '*',
} as const
