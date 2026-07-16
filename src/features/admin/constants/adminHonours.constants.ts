export type HonourTab = 'trophies' | 'awards' | 'records'

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
