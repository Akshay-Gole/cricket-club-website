export type HonourTab = 'trophies' | 'awards' | 'records'

export interface AdminTrophy {
  id: string
  year: string
  title: string
  type: string
  description: string
  featured: boolean
}

export interface AdminAward {
  id: string
  season: string
  award: string
  name: string
  detail: string
  featured: boolean
}

export interface AdminRecord {
  id: string
  label: string
  value: string
  meta: string
  featured: boolean
}

export interface TrophyFormState {
  year: string
  title: string
  type: string
  description: string
  featured: boolean
}

export interface AwardFormState {
  season: string
  award: string
  name: string
  detail: string
  featured: boolean
}

export interface RecordFormState {
  label: string
  value: string
  meta: string
  featured: boolean
}

export const HONOUR_TABS: { value: HonourTab; label: string }[] = [
  { value: 'trophies', label: 'Trophies' },
  { value: 'awards', label: 'Awards' },
  { value: 'records', label: 'Records' },
]

export const EMPTY_TROPHY_FORM: TrophyFormState = {
  year: '2026',
  title: '',
  type: 'Trophy',
  description: '',
  featured: true,
}

export const EMPTY_AWARD_FORM: AwardFormState = {
  season: '2026',
  award: '',
  name: '',
  detail: '',
  featured: true,
}

export const EMPTY_RECORD_FORM: RecordFormState = {
  label: '',
  value: '',
  meta: '',
  featured: true,
}

export const adminHonoursInputClass =
  'h-11 w-full rounded border border-white/[0.12] bg-white/[0.045] px-4 font-heading text-sm font-semibold tracking-[0.5px] text-white outline-none placeholder:text-muted focus:border-gold/40'

export const adminHonoursTextareaClass =
  'min-h-[120px] w-full resize-y rounded border border-white/[0.12] bg-white/[0.045] px-4 py-3 font-body text-sm font-light leading-[1.7] text-white outline-none placeholder:text-muted focus:border-gold/40'

export const MOCK_TROPHIES: AdminTrophy[] = [
  {
    id: 'trophy-1',
    year: '2026',
    title: 'Senior Division Finalists',
    type: 'Season Honour',
    description:
      'A breakout campaign built on consistent batting, disciplined bowling and a fearless new squad identity.',
    featured: true,
  },
  {
    id: 'trophy-2',
    year: '2025',
    title: 'Community Club Award',
    type: 'Club Honour',
    description:
      'Recognised for growing participation and supporting local cricket.',
    featured: true,
  },
  {
    id: 'trophy-3',
    year: '2024',
    title: 'T20 Shield Winners',
    type: 'Trophy',
    description:
      'Top G’s CC lifted the short-format shield after a dominant unbeaten run.',
    featured: true,
  },
  {
    id: 'trophy-4',
    year: '2023',
    title: 'Best New Club Program',
    type: 'Milestone',
    description:
      'The club’s player pathway became a foundation for long-term growth.',
    featured: false,
  },
]

export const MOCK_AWARDS: AdminAward[] = [
  {
    id: 'award-1',
    season: '2026',
    award: 'Player of the Season',
    name: 'Akshay Gole',
    detail: '847 runs',
    featured: true,
  },
  {
    id: 'award-2',
    season: '2026',
    award: 'Bowler of the Season',
    name: 'Ryan Smith',
    detail: '34 wickets',
    featured: true,
  },
  {
    id: 'award-3',
    season: '2025',
    award: 'Club Champion',
    name: 'James Catto',
    detail: 'All-round impact',
    featured: true,
  },
  {
    id: 'award-4',
    season: '2025',
    award: 'Best Batter',
    name: 'Jones',
    detail: '612 runs',
    featured: false,
  },
]

export const MOCK_RECORDS: AdminRecord[] = [
  {
    id: 'record-1',
    label: 'Highest team score',
    value: '212/5',
    meta: 'vs Norwood CC',
    featured: true,
  },
  {
    id: 'record-2',
    label: 'Best bowling',
    value: '6/22',
    meta: 'Ryan Smith',
    featured: true,
  },
  {
    id: 'record-3',
    label: 'Highest partnership',
    value: '138',
    meta: 'Gole / Jones',
    featured: true,
  },
  {
    id: 'record-4',
    label: 'Fastest fifty',
    value: '24b',
    meta: 'James Catto',
    featured: true,
  },
]
