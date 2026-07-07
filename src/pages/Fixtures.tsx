import { useState } from 'react'
import type { FixtureResult } from '../features/fixtures/types/fixture.types'
import logger from '../services/logger'
import FixturesHeader from '../features/fixtures/components/FixturesHeader'
import FixturesControls from '../features/fixtures/components/FixturesControls'
import FixtureList from '../features/fixtures/components/FixtureList'

type FilterValue = 'all' | FixtureResult

function Fixtures() {
  const [activeSeason, setActiveSeason] = useState('2026')
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all')

  const handleSeasonChange = (season: string) => {
    setActiveSeason(season)
    logger.action('Fixtures season changed', { season })
  }

  const handleFilterChange = (filter: FilterValue) => {
    setActiveFilter(filter)
    logger.action('Fixtures filter changed', { filter })
  }

  return (
    <div className="relative overflow-hidden bg-[#0b0f0d]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_10%,rgba(52,160,88,0.09),transparent_34%),radial-gradient(circle_at_18%_0%,rgba(201,168,76,0.06),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(201,168,76,0.9)_1px,transparent_1px),linear-gradient(90deg,rgba(201,168,76,0.9)_1px,transparent_1px)] [background-size:96px_96px]" />

      <div className="relative z-[1]">
        <FixturesHeader />
        <FixturesControls
          activeSeason={activeSeason}
          activeFilter={activeFilter}
          onSeasonChange={handleSeasonChange}
          onFilterChange={handleFilterChange}
        />
        <FixtureList season={activeSeason} filter={activeFilter} />
      </div>
    </div>
  )
}

export default Fixtures
