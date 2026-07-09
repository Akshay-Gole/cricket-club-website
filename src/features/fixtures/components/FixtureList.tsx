import { useMemo } from 'react'
import PageLoader from '../../../components/shared/PageLoader'
import type { Fixture, FixtureResult } from '../types/fixture.types'
import FixtureRow from './FixtureRow'

type FilterValue = 'all' | FixtureResult

interface Props {
  fixtures: Fixture[]
  season: string
  filter: FilterValue
  isLoading?: boolean
  error?: string
}

function FixtureList({ fixtures, season, filter, isLoading, error }: Props) {
  // DERIVED: filter fixtures by season + result, then group by month
  const grouped = useMemo(() => {
    const filtered = fixtures.filter(f => {
      const matchesSeason = f.season === season
      const matchesFilter = filter === 'all' || f.result === filter
      return matchesSeason && matchesFilter
    })

    // Group into { month: fixtures[] }, preserving order
    const groups: { month: string; fixtures: Fixture[] }[] = []
    for (const fix of filtered) {
      const monthLabel = fix.month ?? ''
      const existing = groups.find(g => g.month === monthLabel)
      if (existing) {
        existing.fixtures.push(fix)
      } else {
        groups.push({ month: monthLabel, fixtures: [fix] })
      }
    }
    return groups
  }, [fixtures, season, filter])

  const totalCount = grouped.reduce((sum, g) => sum + g.fixtures.length, 0)

  return (
    <div className="px-5 pb-14 sm:px-7 sm:pb-16 lg:px-12 lg:pb-20">
      {isLoading ? (
        <PageLoader label="Loading fixtures..." variant="section" />
      ) : error ? (
        <div className="py-20 text-center">
          <p className="font-display text-4xl sm:text-5xl text-[#efe9dc] tracking-[3px]">
            Could Not Load Fixtures
          </p>
          <span className="block mt-4 font-heading text-[13px] tracking-[2px] uppercase text-muted">
            {error}
          </span>
        </div>
      ) : totalCount > 0 ? (
        grouped.map(group => (
          <div key={group.month}>
            {/* Month divider */}
            <div className="mb-3 mt-7 flex items-center gap-4 sm:mb-4 sm:mt-10">
              <span className="font-heading text-[10px] font-bold tracking-[4px] uppercase text-muted whitespace-nowrap">
                {group.month}
              </span>
              <span className="flex-1 h-px bg-white/[0.055]" />
            </div>

            {/* Rows for this month */}
            {group.fixtures.map(fixture => (
              <FixtureRow key={fixture.id} fixture={fixture} />
            ))}
          </div>
        ))
      ) : (
        <div className="py-20 text-center">
          <p className="font-display text-4xl sm:text-5xl text-gold/[0.22] tracking-[3px]">
            No Fixtures Found
          </p>
          <span className="block mt-4 font-heading text-[13px] tracking-[2px] uppercase text-muted">
            Try a different season or filter
          </span>
        </div>
      )}
    </div>
  )
}

export default FixtureList
