export type FixtureResult = 'won' | 'lost' | 'draw' | 'upcoming'
export interface Fixture {
  id: string
  homeTeam: string
  awayTeam: string
  date: string
  time: string
  venue: string
  season: string
  result: FixtureResult
  ourScore?: string
  oppScore?: string
  month?: string
  day?: string
  monthShort?: string
  isHome?: boolean
  badge?: string
  playHqUrl?: string
}

export interface CreateFixtureDto {
  homeTeam: string
  awayTeam: string
  date: string
  time: string
  venue: string
  season: string
  result: FixtureResult
  ourScore?: string
  oppScore?: string
}
