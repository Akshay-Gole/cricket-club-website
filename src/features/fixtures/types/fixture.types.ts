export type FixtureResult =
  | 'won'
  | 'lost'
  | 'draw'
  | 'upcoming'
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
  playHqUrl?: string
}

export interface CreateFixtureDto {
  homeTeam: string
  awayTeam: string
  date: string
  time: string
  venue: string
  result: FixtureResult
  ourScore?: string
  oppScore?: string
  venueGoogleUrl?: string
  scoreboardUrl?: string
}
