export type PlayerRole = 'batsman' | 'bowler' | 'all-rounder' | 'wicket-keeper'

export interface Player {
  id: string
  name: string
  role: PlayerRole
  jerseyNumber: number
  battingAverage: number
  bestBowling: string
  imageUrl?: string
  imagePublicId?: string
  playCricketPlayerId?: string
  careerStats?: PlayerCareerStats | null
  recentPerformances?: PlayerMatchPerformance[]
  isCaptain?: boolean
  isFeatured?: boolean
  featuredStatValue?: string
  featuredStatLabel?: string
  active?: boolean
}

export interface PlayerCareerStats {
  matches: number
  battingInnings: number
  battingAggregate: number
  battingNotOuts: number
  batting50s: number
  batting100s: number
  batting0s: number
  battingHighScore: number
  isBattingHSNotOut: boolean
  battingAverage: number
  battingStrikeRate: number
  battingFours: number
  battingSixes: number
  bowlingWickets: number
  bowlingMaidens: number
  bowlingRuns: number
  bowlingBalls: number
  bowling5WIs: number
  bowling10WMs: number
  bowlingOvers: string
  bowlingBestInnings: string
  bowlingAverage: number
  bowlingStrikeRate: number
  bowlingEconomyRate: number
  bowlingWides: number
  bowlingNoBalls: number
  fieldingCatchesNonWK: number
  fieldingCatchesWK: number
  fieldingTotalCatches: number
  fieldingStumpings: number
  fieldingRunOuts: number
  syncedAt: string
}

export interface PlayerMatchPerformance {
  id: string
  externalMatchId: string
  matchDate: string
  matchType?: string | null
  gradeName?: string | null
  homeTeam?: string | null
  awayTeam?: string | null
  battingRuns?: number | null
  battingBalls?: number | null
  battingFours?: number | null
  battingSixes?: number | null
  battingStrikeRate?: number | null
  battingDismissalTypeId?: number | null
  bowlingOvers?: string | null
  bowlingMaidens?: number | null
  bowlingRuns?: number | null
  bowlingWickets?: number | null
  bowlingWides?: number | null
  bowlingNoBalls?: number | null
  bowlingEconomy?: number | null
  fieldingCatches?: number | null
  fieldingStumpings?: number | null
}

export interface CreatePlayerDto {
  name: string
  role: PlayerRole
  jerseyNumber: number
  imageUrl?: string
  playCricketPlayerId?: string
  isCaptain?: boolean
  isFeatured?: boolean
  featuredStatValue?: string
  featuredStatLabel?: string
  active?: boolean
}
