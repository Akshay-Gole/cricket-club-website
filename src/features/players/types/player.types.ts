export type PlayerRole = 'batsman' | 'bowler' | 'all-rounder' | 'wicket-keeper'

export interface Player {
  id: string
  name: string
  role: PlayerRole
  jerseyNumber: number
  battingAverage: number
  bestBowling: string
  imageUrl?: string
}
