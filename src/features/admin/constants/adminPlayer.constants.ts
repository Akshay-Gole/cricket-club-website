import type { PlayerRole } from '../../players/types/player.types'

export interface PlayerFormState {
  name: string
  role: PlayerRole
  jerseyNumber: string
  battingAverage: string
  bestBowling: string
  playCricketPlayerId: string
  imageFile: File | null
  imagePreviewUrl: string
  isCaptain: boolean
}

export type RoleFilter = 'all' | PlayerRole

export const ROLE_OPTIONS: { value: PlayerRole; label: string }[] = [
  { value: 'batsman', label: 'Batsman' },
  { value: 'bowler', label: 'Bowler' },
  { value: 'all-rounder', label: 'All-Rounder' },
  { value: 'wicket-keeper', label: 'Wicket-Keeper' },
]

export const ROLE_FILTERS: { value: RoleFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  ...ROLE_OPTIONS,
]

export const EMPTY_PLAYER_FORM: PlayerFormState = {
  name: '',
  role: 'batsman',
  jerseyNumber: '',
  battingAverage: '',
  bestBowling: '',
  playCricketPlayerId: '',
  imageFile: null,
  imagePreviewUrl: '',
  isCaptain: false,
}

export const roleLabel: Record<PlayerRole, string> = {
  batsman: 'Batsman',
  bowler: 'Bowler',
  'all-rounder': 'All-Rounder',
  'wicket-keeper': 'Keeper',
}

export const roleBadgeClass: Record<PlayerRole, string> = {
  batsman: 'border-gold/25 bg-gold/[0.08] text-gold',
  bowler: 'border-[#d86b5f]/25 bg-[#d86b5f]/[0.08] text-[#ff9b8f]',
  'all-rounder': 'border-green-light/25 bg-green-light/[0.08] text-green-light',
  'wicket-keeper': 'border-[#6f8cff]/25 bg-[#6f8cff]/[0.08] text-[#9aaeff]',
}

export const adminInputClass =
  'h-11 w-full rounded border border-white/[0.12] bg-white/[0.045] px-4 font-heading text-sm font-semibold tracking-[0.5px] text-white outline-none placeholder:text-muted focus:border-gold/40'
