export type HonourPanel = 'trophies' | 'awards' | 'records'

export interface HonourSnapshot {
  clubTrophies: number
  finalsPlayed: number
  awardWinners: number
}

export interface HonourTrophy {
  id: string
  year: string
  title: string
  type: string
  description: string
  featured: boolean
}

export interface HonourAwardWinner {
  id: string
  season: string
  award: string
  name: string
  detail: string
  featured: boolean
}

export interface HonourRecord {
  id: string
  label: string
  value: string
  meta: string
  featured: boolean
  source: 'automatic' | 'manual'
  sortOrder?: number
}

export interface HonourManualRecordTemplate {
  id: string
  label: string
  sortOrder: number
}

export interface HonoursData {
  snapshot: HonourSnapshot
  trophies: HonourTrophy[]
  awardWinners: HonourAwardWinner[]
  records: HonourRecord[]
  manualRecordTemplates: HonourManualRecordTemplate[]
}

export type HonourTrophyInput = Omit<HonourTrophy, 'id'>
export type HonourAwardInput = Omit<HonourAwardWinner, 'id'>
export type HonourManualRecordInput = Pick<
  HonourRecord,
  'label' | 'value' | 'meta' | 'featured'
> & {
  sortOrder: number
}
