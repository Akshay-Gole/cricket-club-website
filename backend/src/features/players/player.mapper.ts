import {
  Player,
  PlayerCareerStats,
  PlayerMatchPerformance,
  PlayerRole,
} from '@prisma/client'

type ApiPlayerRole = 'batsman' | 'bowler' | 'all-rounder' | 'wicket-keeper'

const roleMap: Record<PlayerRole, ApiPlayerRole> = {
  batsman: 'batsman',
  bowler: 'bowler',
  all_rounder: 'all-rounder',
  wicket_keeper: 'wicket-keeper',
}

export const dbRoleMap: Record<ApiPlayerRole, PlayerRole> = {
  batsman: 'batsman',
  bowler: 'bowler',
  'all-rounder': 'all_rounder',
  'wicket-keeper': 'wicket_keeper',
}

type PlayerWithStats = Player & {
  careerStats?: PlayerCareerStats | null
  matchPerformances?: PlayerMatchPerformance[]
}

function toApiCareerStats(stats?: PlayerCareerStats | null) {
  if (!stats) return null

  return {
    matches: stats.matches,
    battingInnings: stats.battingInnings,
    battingAggregate: stats.battingAggregate,
    battingNotOuts: stats.battingNotOuts,
    batting50s: stats.batting50s,
    batting100s: stats.batting100s,
    batting0s: stats.batting0s,
    battingHighScore: stats.battingHighScore,
    isBattingHSNotOut: stats.isBattingHSNotOut,
    battingAverage: stats.battingAverage,
    battingStrikeRate: stats.battingStrikeRate,
    battingFours: stats.battingFours,
    battingSixes: stats.battingSixes,
    bowlingWickets: stats.bowlingWickets,
    bowlingMaidens: stats.bowlingMaidens,
    bowlingRuns: stats.bowlingRuns,
    bowlingBalls: stats.bowlingBalls,
    bowling5WIs: stats.bowling5WIs,
    bowling10WMs: stats.bowling10WMs,
    bowlingOvers: stats.bowlingOvers,
    bowlingBestInnings: stats.bowlingBestInnings,
    bowlingAverage: stats.bowlingAverage,
    bowlingStrikeRate: stats.bowlingStrikeRate,
    bowlingEconomyRate: stats.bowlingEconomyRate,
    bowlingWides: stats.bowlingWides,
    bowlingNoBalls: stats.bowlingNoBalls,
    fieldingCatchesNonWK: stats.fieldingCatchesNonWK,
    fieldingCatchesWK: stats.fieldingCatchesWK,
    fieldingTotalCatches: stats.fieldingTotalCatches,
    fieldingStumpings: stats.fieldingStumpings,
    fieldingRunOuts: stats.fieldingRunOuts,
    syncedAt: stats.syncedAt,
  }
}

function toApiPerformance(performance: PlayerMatchPerformance) {
  return {
    id: performance.id,
    externalMatchId: performance.externalMatchId,
    matchDate: performance.matchDate,
    matchType: performance.matchType,
    gradeName: performance.gradeName,
    homeTeam: performance.homeTeam,
    awayTeam: performance.awayTeam,
    battingRuns: performance.battingRuns,
    battingBalls: performance.battingBalls,
    battingFours: performance.battingFours,
    battingSixes: performance.battingSixes,
    battingStrikeRate: performance.battingStrikeRate,
    battingDismissalTypeId: performance.battingDismissalTypeId,
    bowlingOvers: performance.bowlingOvers,
    bowlingMaidens: performance.bowlingMaidens,
    bowlingRuns: performance.bowlingRuns,
    bowlingWickets: performance.bowlingWickets,
    bowlingWides: performance.bowlingWides,
    bowlingNoBalls: performance.bowlingNoBalls,
    bowlingEconomy: performance.bowlingEconomy,
    fieldingCatches: performance.fieldingCatches,
    fieldingStumpings: performance.fieldingStumpings,
  }
}

export function toApiPlayer(player: PlayerWithStats) {
  const careerStats = toApiCareerStats(player.careerStats)

  return {
    id: player.id,
    firstName: player.firstName,
    lastName: player.lastName,
    name: player.displayName,
    initials: player.initials,
    role: roleMap[player.role],
    jerseyNumber: player.jerseyNumber,
    imageUrl: player.imageUrl,
    playCricketPlayerId: player.playCricketPlayerId,
    stats: {
      battingAverage: careerStats?.battingAverage ?? player.battingAvg,
      bestBowling: careerStats?.bowlingBestInnings ?? player.bestBowl,
    },
    careerStats,
    recentPerformances: player.matchPerformances?.map(toApiPerformance) ?? [],
    isCaptain: player.isCaptain,
    isFeatured: player.isFeatured,
    active: player.active,
  }
}
