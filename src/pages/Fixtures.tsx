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
    <div>
      <FixturesHeader />
      <FixturesControls
        activeSeason={activeSeason}
        activeFilter={activeFilter}
        onSeasonChange={handleSeasonChange}
        onFilterChange={handleFilterChange}
      />
      <FixtureList season={activeSeason} filter={activeFilter} />
    </div>
  )
}

export default Fixtures
