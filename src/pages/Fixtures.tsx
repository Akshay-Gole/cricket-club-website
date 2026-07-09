import { useEffect, useMemo, useState } from 'react'
import fixturesApi from '../features/fixtures/api/fixture.api'
import type {
  Fixture,
  FixtureResult,
} from '../features/fixtures/types/fixture.types'
import logger from '../services/logger'
import FixturesHeader from '../features/fixtures/components/FixturesHeader'
import FixturesControls from '../features/fixtures/components/FixturesControls'
import FixtureList from '../features/fixtures/components/FixtureList'

type FilterValue = 'all' | FixtureResult

function Fixtures() {
  const [fixtures, setFixtures] = useState<Fixture[]>([])
  const [activeSeason, setActiveSeason] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const seasons = useMemo(() => {
    const uniqueSeasons = Array.from(
      new Set(fixtures.map(fixture => fixture.season))
    )

    return uniqueSeasons.sort((a, b) => Number(b) - Number(a))
  }, [fixtures])

  const selectedSeason =
    activeSeason || seasons[0] || String(new Date().getFullYear())

  useEffect(() => {
    const loadFixtures = async () => {
      try {
        setError('')
        const nextFixtures = await fixturesApi.getAll()
        setFixtures(nextFixtures)
      } catch {
        setError('Please check that the backend is running.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadFixtures()
  }, [])

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
          seasons={seasons}
          activeSeason={selectedSeason}
          activeFilter={activeFilter}
          onSeasonChange={handleSeasonChange}
          onFilterChange={handleFilterChange}
        />
        <FixtureList
          fixtures={fixtures}
          season={selectedSeason}
          filter={activeFilter}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  )
}

export default Fixtures
