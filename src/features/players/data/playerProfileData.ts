import type { PlayerProfile } from '../types/playerProfile.types'

// STATIC placeholder — hardcoded Catto profile from the mockup.
// Swap for real fetched data (by :id) later (enhancement pass).
export const CATTO_PROFILE: PlayerProfile = {
  id: '1',
  name: 'CATTO',
  fullName: 'James Catto',
  jerseyNumber: 3,
  role: 'all-rounder',
  isCaptain: true,

  runs: 847,
  wickets: 18,
  highScore: 94,
  battingAverage: 42.3,
  bowlingAverage: 18.6,
  matches: 14,

  battingStyle: 'Right-hand bat',
  bowlingStyle: 'Right-arm medium',
  debut: 'March 2026',
  bestBowling: '4 / 22',
  fiftiesHundreds: '6 / 0',
  catches: 11,

  batting: {
    innings: 14,
    runs: 847,
    highScore: 94,
    average: 42.3,
    strikeRate: 138.4,
    fifties: 6,
    hundreds: 0,
  },

  bowling: {
    overs: 96.2,
    wickets: 18,
    bestBowling: '4 / 22',
    average: 18.6,
    economy: 6.2,
    fiveWickets: 0,
  },

  recentInnings: [
    { match: 'M1', opponent: 'NOR', runs: 38 },
    { match: 'M2', opponent: 'RIV', runs: 94, notOut: true },
    { match: 'M3', opponent: 'GLE', runs: 12 },
    { match: 'M4', opponent: 'EAS', runs: 67 },
    { match: 'M5', opponent: 'WES', runs: 55 },
    { match: 'M6', opponent: 'HEN', runs: 82 },
    { match: 'M7', opponent: 'STI', runs: 29 },
    { match: 'M8', opponent: 'KEN', runs: 71 },
  ],
}

export default CATTO_PROFILE
