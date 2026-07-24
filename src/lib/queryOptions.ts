import { queryOptions } from '@tanstack/react-query'
import fixturesApi from '../features/fixtures/api/fixture.api'
import homeContentApi from '../features/home/api/homeContent.api'
import honoursApi from '../features/honours/api/honours.api'
import playersApi from '../features/players/api/players.api'

export const queryKeys = {
  fixtures: ['fixtures'] as const,
  adminFixtures: ['admin', 'fixtures'] as const,
  players: ['players'] as const,
  player: (id: string) => ['players', id] as const,
  adminPlayers: ['admin', 'players'] as const,
  honours: ['honours'] as const,
  adminHonours: ['admin', 'honours'] as const,
  homeContent: ['home-content'] as const,
  adminHomeContent: ['admin', 'home-content'] as const,
}

export const fixturesQuery = queryOptions({
  queryKey: queryKeys.fixtures,
  queryFn: () => fixturesApi.getAll(),
})

export const playersQuery = queryOptions({
  queryKey: queryKeys.players,
  queryFn: playersApi.getAll,
})

export const playerQuery = (id: string) =>
  queryOptions({
    queryKey: queryKeys.player(id),
    queryFn: () => playersApi.getById(id),
    enabled: Boolean(id),
  })

export const honoursQuery = queryOptions({
  queryKey: queryKeys.honours,
  queryFn: honoursApi.getPublic,
})

export const homeContentQuery = queryOptions({
  queryKey: queryKeys.homeContent,
  queryFn: homeContentApi.getPublic,
})

export const adminFixturesQuery = queryOptions({
  queryKey: queryKeys.adminFixtures,
  queryFn: fixturesApi.getAdmin,
})

export const adminHonoursQuery = queryOptions({
  queryKey: queryKeys.adminHonours,
  queryFn: honoursApi.getAdmin,
})

export const adminHomeContentQuery = queryOptions({
  queryKey: queryKeys.adminHomeContent,
  queryFn: homeContentApi.getAdmin,
})
