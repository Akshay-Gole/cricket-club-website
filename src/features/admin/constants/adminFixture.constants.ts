import type { FixtureResult } from '../../fixtures/types/fixture.types'

export type FixtureFilter = 'all' | FixtureResult

export interface FixtureFormState {
  homeTeam: string
  awayTeam: string
  date: string
  time: string
  venue: string
  season: string
  result: FixtureResult
  ourScore: string
  oppScore: string
  playHqUrl: string
}

export const EMPTY_FIXTURE_FORM: FixtureFormState = {
  homeTeam: "Top G's CC",
  awayTeam: '',
  date: '',
  time: '',
  venue: '',
  season: '2026',
  result: 'upcoming',
  ourScore: '',
  oppScore: '',
  playHqUrl: '',
}

export const RESULT_OPTIONS: { value: FixtureResult; label: string }[] = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
  { value: 'draw', label: 'Draw' },
]

export const FIXTURE_FILTERS: { value: FixtureFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  ...RESULT_OPTIONS,
]

export const resultLabel: Record<FixtureResult, string> = {
  upcoming: 'Upcoming',
  won: 'Won',
  lost: 'Lost',
  draw: 'Draw',
}

export const resultBadgeClass: Record<FixtureResult, string> = {
  upcoming: 'border-gold/25 bg-gold/[0.08] text-gold',
  won: 'border-green-light/25 bg-green-light/[0.08] text-green-light',
  lost: 'border-[#d86b5f]/25 bg-[#d86b5f]/[0.08] text-[#ff9b8f]',
  draw: 'border-white/[0.12] bg-white/[0.05] text-muted',
}

export const adminFixtureInputClass =
  'h-11 w-full rounded border border-white/[0.12] bg-white/[0.045] px-4 font-heading text-sm font-semibold tracking-[0.5px] text-white outline-none placeholder:text-muted focus:border-gold/40'
