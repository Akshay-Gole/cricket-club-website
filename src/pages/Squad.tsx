import { useState, useMemo, useTransition } from 'react'
import SQUAD from '../features/players/data/squadData'
import type { PlayerRole } from '../features/players/types/player.types'
import PlayerCard from '../features/players/components/PlayerCard'
import PlayerFilter from '../features/players/components/PlayerFilter'
import { useDebounce } from '../hooks/useDebounce'
import logger from '../services/logger'

type FilterValue = 'all' | PlayerRole

function Squad() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all')
  const [searchInput, setSearchInput] = useState('')
  const [isPending, startTransition] = useTransition()

  // Debounced search — only updates 500ms after typing stops
  const debouncedSearch = useDebounce(searchInput, 500)

  // DERIVED STATE — the filtered list is computed from the source data + filters.
  // Not stored in state/Redux; recalculated when inputs change. (useMemo caches it.)
  const filtered = useMemo(() => {
    return SQUAD.filter(p => {
      const matchesRole = activeFilter === 'all' || p.role === activeFilter
      const matchesSearch = p.name
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase())
      return matchesRole && matchesSearch
    })
  }, [activeFilter, debouncedSearch])

  // Filter change — wrapped in startTransition so the UI stays responsive
  const handleFilterChange = (filter: FilterValue) => {
    startTransition(() => {
      setActiveFilter(filter)
      logger.action('Player filter changed', { filter })
    })
  }

  return (
    <div>
      {/* PAGE HEADER */}
      <div className="relative overflow-hidden px-5 sm:px-7 lg:px-12 pt-12 sm:pt-14 lg:pt-16">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(26,92,46,0.08)_0%,transparent_60%)] pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-heading text-[11px] font-semibold tracking-[4px] uppercase text-gold">
              All Season
            </span>
            <span className="flex-1 h-px bg-gold/[0.12]" />
            <span className="font-heading text-[11px] font-semibold tracking-[4px] uppercase text-gold">
              ADELAIDE, SA
            </span>
          </div>
          <h1 className="font-display text-white text-[56px] sm:text-[72px] lg:text-[88px] leading-[0.9] tracking-[2px] mb-1.5">
            The Squad
          </h1>
          <div
            className="font-display text-[56px] sm:text-[72px] lg:text-[88px] leading-[0.9] tracking-[2px] -mt-3 mb-8 text-transparent pointer-events-none [-webkit-text-stroke:0.5px_rgba(201,168,76,0.15)]"
            aria-hidden="true"
          >
            The Squad
          </div>
          <p className="font-body text-sm font-light text-muted max-w-[480px] leading-[1.7] mb-9 sm:mb-12">
            Meet the players who take the field for Top G's CC. A new breed of
            cricketer — committed, fearless, and hungry for the win.
          </p>
        </div>
      </div>

      {/* CONTROLS — filter + search + count */}
      <div className="grid grid-cols-1 items-center gap-4 px-5 pb-9 min-[640px]:grid-cols-[minmax(0,1fr)_max-content] sm:px-7 sm:pb-10 min-[1080px]:grid-cols-[max-content_minmax(280px,1fr)_max-content] lg:px-12 lg:pb-12">
        <PlayerFilter
          players={SQUAD}
          active={activeFilter}
          onChange={handleFilterChange}
        />
        {/* Search */}
        <div className="relative min-w-0 w-full min-[1080px]:max-w-[280px] min-[1080px]:justify-self-end">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search players..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="w-full bg-card border-[0.5px] border-white/5 rounded-sm py-2.5 pl-9 pr-3.5 font-heading text-[13px] font-semibold tracking-[1.5px] text-white outline-none placeholder:text-muted focus:border-gold/35"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              aria-label="Clear search"
              className="absolute cursor-pointer right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full text-muted hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="font-heading text-xs font-semibold tracking-[1.5px] uppercase text-muted whitespace-nowrap sm:text-right">
          {filtered.length} {filtered.length === 1 ? 'Player' : 'Players'}
        </div>
      </div>

      {/* SQUAD GRID */}
      <div
        className={`grid grid-cols-1 min-[641px]:grid-cols-2 min-[901px]:grid-cols-3 min-[1025px]:grid-cols-4 gap-px bg-white/5 pt-20 px-5 sm:px-7 lg:px-12 pb-20 lg:pb-24 transition-opacity ${
          isPending ? 'opacity-60' : 'opacity-100'
        }`}
      >
        {filtered.length > 0 ? (
          filtered.map(player => <PlayerCard key={player.id} player={player} />)
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="font-display text-5xl text-white/5 tracking-[3px]">
              No Players Found
            </p>
            <span className="block mt-4 font-heading text-[13px] tracking-[2px] uppercase text-muted">
              Try a different filter or search
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default Squad
