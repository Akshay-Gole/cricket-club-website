import type { Player, PlayerRole } from '../types/player.types'

type FilterValue = 'all' | PlayerRole

interface PlayerFilterProps {
  players: Player[]
  active: FilterValue
  onChange: (filter: FilterValue) => void
}

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'batsman', label: 'Batsman' },
  { value: 'bowler', label: 'Bowler' },
  { value: 'all-rounder', label: 'All-Rounder' },
  { value: 'wicket-keeper', label: 'Keeper' },
]

function PlayerFilter({ players, active, onChange }: PlayerFilterProps) {
  // Count how many players match each filter
  const countFor = (value: FilterValue) =>
    value === 'all'
      ? players.length
      : players.filter(p => p.role === value).length

  return (
    // <div className="flex w-full min-w-0 overflow-x-auto [scrollbar-width:none] min-[640px]:col-span-2 min-[1080px]:col-span-1 min-[1080px]:w-max [&::-webkit-scrollbar]:hidden">
    <div className="flex w-full min-w-0 overflow-x-auto [scrollbar-width:none] min-[640px]:col-span-2 min-[1080px]:col-span-1 min-[1080px]:w-max [&::-webkit-scrollbar]:hidden">
      {FILTERS.map((filter, i) => {
        const isActive = active === filter.value
        return (
          <button
            key={filter.value}
            onClick={() => onChange(filter.value)}
            aria-pressed={isActive}
            className={`shrink-0 cursor-pointer px-5 py-2.5 font-heading text-xs font-bold tracking-[2.5px] uppercase whitespace-nowrap border-[0.5px] transition-all min-[640px]:flex-1 min-[1080px]:flex-none
              ${i === 0 ? 'rounded-l-sm' : ''}
              ${i === FILTERS.length - 1 ? 'rounded-r-sm' : ''}
              ${
                isActive
                  ? 'bg-gold text-black border-gold'
                  : 'bg-card text-muted border-white/5 hover:text-white hover:border-white/15'
              }`}
          >
            {filter.label}
            <span className={isActive ? 'text-black/60' : 'text-muted/60'}>
              {' '}
              {countFor(filter.value)}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default PlayerFilter
