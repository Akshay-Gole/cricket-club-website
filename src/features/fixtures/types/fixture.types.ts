export type FixtureResult =
  | 'won'
  | 'lost'
  | 'draw'
  | 'upcoming'
  | 'pending'
  | 'abandoned'
  | 'forfeited'

export interface Fixture {
  id: string
  homeTeam: string
  awayTeam: string
  date: string
  time: string
  venue: string
  venueGoogleUrl?: string
  season: string
  result: FixtureResult
  ourScore?: string
  oppScore?: string
  month?: string
  day?: string
  monthShort?: string
  isHome?: boolean
  badge?: string
  scoreboardUrl?: string
  matchLabel?: string | null
}

export interface CreateFixtureDto {
  homeTeam: string
  awayTeam: string
  date: string
  time: string
  venue: string
  venueGoogleUrl?: string
  scoreboardUrl?: string
}
