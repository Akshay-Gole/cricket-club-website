import type { PlayerRole } from './player.types'

// Provisional type for the detailed player profile page.
// Align with PlayHQ's real fields later (enhancement pass).
export interface InningsScore {
  match: string // 'M1'
  opponent: string // 'NOR'
  runs: number
  notOut?: boolean // ★ highlight (e.g. high score / not out)
}

export interface PlayerProfile {
  id: string
  name: string // 'CATTO' (display)
  fullName: string // 'James Catto'
  jerseyNumber: number
  role: PlayerRole
  isCaptain?: boolean

  // Hero quick stats
  runs: number
  wickets: number
  highScore: number
  battingAverage: number
  bowlingAverage: number
  matches: number

  // Meta
  battingStyle: string
  bowlingStyle: string
  debut: string
  bestBowling: string
  fiftiesHundreds: string // '6 / 0'
  catches: number

  // Batting career summary (table row)
  batting: {
    innings: number
    runs: number
    highScore: number
    average: number
    strikeRate: number
    fifties: number
    hundreds: number
  }

  // Bowling career summary (table row)
  bowling: {
    overs: number
    wickets: number
    bestBowling: string
    average: number
    economy: number
    fiveWickets: number
  }

  // Form chart — last innings
  recentInnings: InningsScore[]
}
