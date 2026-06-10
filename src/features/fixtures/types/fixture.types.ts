export type FixtureResult = 'won' | 'lost' | 'upcoming'

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
}
