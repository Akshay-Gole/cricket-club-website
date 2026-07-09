import type { FixtureResult } from '../types/fixture.types'

type FilterValue = 'all' | FixtureResult

interface Props {
  seasons: string[]
  activeSeason: string
  activeFilter: FilterValue
  onSeasonChange: (season: string) => void
  onFilterChange: (filter: FilterValue) => void
}

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
  { value: 'draw', label: 'Draw' },
  { value: 'abandoned', label: 'Abandoned' },
  { value: 'forfeited', label: 'Forfeited' },
]

function FixturesControls({
  seasons,
  activeSeason,
  activeFilter,
  onSeasonChange,
  onFilterChange,
}: Props) {
  const visibleSeasons =
    seasons.length > 0 ? seasons : [String(new Date().getFullYear())]

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 px-5 sm:px-7 lg:px-12 flex-wrap">
      {/* Season tabs */}
      <div className="flex w-fit max-w-full self-start gap-px bg-white/[0.055] rounded-sm overflow-hidden overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {visibleSeasons.map(season => {
          const isActive = activeSeason === season
          return (
            <button
              key={season}
              onClick={() => onSeasonChange(season)}
              aria-pressed={isActive}
              className={`shrink-0 font-heading cursor-pointer text-xs font-bold tracking-[2.5px] uppercase px-5 sm:px-[22px] py-2.5 sm:py-[11px] whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-gold text-black'
                  : 'bg-card text-muted hover:text-white hover:bg-[#1c1c1c]'
              }`}
            >
              {season}
            </button>
          )
        })}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FILTERS.map(filter => {
          const isActive = activeFilter === filter.value
          return (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              aria-pressed={isActive}
              className={`shrink-0 font-heading cursor-pointer text-[11px] font-bold tracking-[2px] uppercase px-[18px] py-2.5 rounded-sm border-[0.5px] whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-gold/40 text-gold bg-gold/10'
                  : 'border-white/[0.055] text-muted hover:text-white hover:border-white/10'
              }`}
            >
              {filter.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default FixturesControls
