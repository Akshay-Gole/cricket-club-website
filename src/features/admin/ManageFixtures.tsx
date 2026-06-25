import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import FIXTURES from '../fixtures/data/fixturesData'
import type { Fixture, FixtureResult } from '../fixtures/types/fixture.types'
import {
  adminFixtureInputClass,
  EMPTY_FIXTURE_FORM,
  FIXTURE_FILTERS,
  RESULT_OPTIONS,
  resultBadgeClass,
  resultLabel,
  type FixtureFilter,
  type FixtureFormState,
} from './constants/adminFixture.constants'

function ManageFixtures() {
  const [fixtures, setFixtures] = useState<Fixture[]>(FIXTURES)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<FixtureFilter>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FixtureFormState>(EMPTY_FIXTURE_FORM)
  const [formError, setFormError] = useState('')

  const [searchParams, setSearchParams] = useSearchParams()

  const formPanelRef = useRef<HTMLElement | null>(null)
  const awayTeamInputRef = useRef<HTMLInputElement | null>(null)

  const filteredFixtures = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    return fixtures.filter(fixture => {
      const matchText = [
        fixture.homeTeam,
        fixture.awayTeam,
        fixture.venue,
        fixture.season,
        fixture.result,
      ]
        .join(' ')
        .toLowerCase()

      const matchesSearch = matchText.includes(searchValue)
      const matchesFilter =
        activeFilter === 'all' || fixture.result === activeFilter

      return matchesSearch && matchesFilter
    })
  }, [fixtures, search, activeFilter])

  const stats = useMemo(() => {
    return {
      total: fixtures.length,
      upcoming: fixtures.filter(fixture => fixture.result === 'upcoming')
        .length,
      won: fixtures.filter(fixture => fixture.result === 'won').length,
      lost: fixtures.filter(fixture => fixture.result === 'lost').length,
    }
  }, [fixtures])

  const updateForm = (
    field: keyof FixtureFormState,
    value: string | FixtureResult
  ) => {
    setForm(current => ({
      ...current,
      [field]: value,
    }))

    setFormError('')
  }

  const resetForm = () => {
    setForm(EMPTY_FIXTURE_FORM)
    setEditingId(null)
    setFormError('')
  }

  const focusForm = () => {
    formPanelRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })

    window.setTimeout(() => {
      awayTeamInputRef.current?.focus()
    }, 350)
  }

  useEffect(() => {
    if (searchParams.get('action') !== 'create') return

    const timeoutId = window.setTimeout(() => {
      resetForm()
      focusForm()

      setSearchParams({}, { replace: true })
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [searchParams, setSearchParams])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.homeTeam.trim()) {
      setFormError('Home team is required')
      return
    }

    if (!form.awayTeam.trim()) {
      setFormError('Away team is required')
      return
    }

    if (!form.date.trim()) {
      setFormError('Match date is required')
      return
    }

    if (!form.time.trim()) {
      setFormError('Match time is required')
      return
    }

    if (!form.venue.trim()) {
      setFormError('Venue is required')
      return
    }

    const date = new Date(form.date)
    const day = String(date.getDate()).padStart(2, '0')
    const monthShort = date.toLocaleString('en-AU', { month: 'short' })
    const monthLong = date.toLocaleString('en-AU', { month: 'long' })
    const year = date.getFullYear()

    const nextFixture: Fixture = {
      id: editingId ?? `fixture-${Date.now()}`,
      homeTeam: form.homeTeam.trim(),
      awayTeam: form.awayTeam.trim(),
      date: form.date,
      time: form.time,
      venue: form.venue.trim(),
      season: form.season.trim() || String(year),
      result: form.result,
      ourScore: form.ourScore.trim() || undefined,
      oppScore: form.oppScore.trim() || undefined,
      playHqUrl: form.playHqUrl.trim() || undefined,
      day,
      monthShort,
      month: `${monthLong} ${year}`,
      isHome: form.homeTeam.toLowerCase().includes('top g'),
      badge: createFixtureBadge(
        form.result,
        form.ourScore.trim(),
        form.oppScore.trim()
      ),
    }

    if (editingId) {
      setFixtures(current =>
        current.map(fixture =>
          fixture.id === editingId ? nextFixture : fixture
        )
      )
    } else {
      setFixtures(current => [nextFixture, ...current])
    }

    resetForm()
  }

  const handleEdit = (fixture: Fixture) => {
    setEditingId(fixture.id)

    setForm({
      homeTeam: fixture.homeTeam,
      awayTeam: fixture.awayTeam,
      date: fixture.date,
      time: fixture.time,
      venue: fixture.venue,
      season: fixture.season,
      result: fixture.result,
      ourScore: fixture.ourScore ?? '',
      oppScore: fixture.oppScore ?? '',
      playHqUrl: fixture.playHqUrl ?? '',
    })

    setFormError('')
    focusForm()
  }

  const handleDelete = (fixtureId: string) => {
    setFixtures(current => current.filter(fixture => fixture.id !== fixtureId))

    if (editingId === fixtureId) {
      resetForm()
    }
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="relative overflow-hidden rounded border border-white/[0.12] bg-[#1b241d] px-5 py-7 sm:px-7 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(45,138,71,0.14),transparent_34%)]"
        />

        <div className="relative flex flex-col gap-5 min-[901px]:flex-row min-[901px]:items-end min-[901px]:justify-between">
          <div>
            <div className="mb-3 font-heading text-[10px] font-bold uppercase tracking-[4px] text-gold">
              Match Operations
            </div>

            <h2 className="font-display text-[38px] leading-none tracking-[1px] text-white sm:text-[48px]">
              Manage Fixtures.
            </h2>

            <p className="mt-4 max-w-[620px] font-body text-sm font-light leading-[1.8] text-muted">
              Create upcoming matches, update results, add scorecards and keep
              the public fixtures page ready for supporters.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 min-[520px]:grid-cols-4 min-[901px]:w-[520px]">
            <StatCard label="Fixtures" value={stats.total} />
            <StatCard label="Upcoming" value={stats.upcoming} />
            <StatCard label="Won" value={stats.won} />
            <StatCard label="Lost" value={stats.lost} />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 sm:gap-6 min-[1180px]:grid-cols-[minmax(0,1fr)_410px]">
        <section className="overflow-hidden rounded border border-white/[0.12] bg-[#182119]">
          <div className="border-b border-white/[0.10] p-5 sm:p-6">
            <div className="flex flex-col gap-4 min-[901px]:flex-row min-[901px]:items-center min-[901px]:justify-between">
              <div>
                <p className="font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
                  Fixture List
                </p>

                <h3 className="mt-1 font-display text-2xl tracking-[1px] text-white">
                  {filteredFixtures.length} Matches
                </h3>
              </div>

              <div className="flex flex-col gap-3 min-[641px]:flex-row">
                <input
                  type="search"
                  value={search}
                  placeholder="Search team, venue, season..."
                  onChange={event => setSearch(event.target.value)}
                  className="h-11 rounded border border-white/[0.12] bg-white/[0.045] px-4 font-heading text-sm font-semibold tracking-[0.5px] text-white outline-none placeholder:text-muted focus:border-gold/40 min-[641px]:w-[280px]"
                />

                <div className="flex overflow-x-auto rounded border border-white/[0.12] bg-white/[0.035] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {FIXTURE_FILTERS.map(filter => {
                    const isActive = activeFilter === filter.value

                    return (
                      <button
                        key={filter.value}
                        type="button"
                        onClick={() => setActiveFilter(filter.value)}
                        className={`shrink-0 px-4 py-3 font-heading text-[10px] font-bold uppercase tracking-[2px] transition-colors ${
                          isActive
                            ? 'bg-gold text-black'
                            : 'text-muted hover:bg-white/[0.04] hover:text-white'
                        }`}
                      >
                        {filter.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="hidden min-[901px]:block">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/[0.10] text-left">
                  <TableHead>Match</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Actions</TableHead>
                </tr>
              </thead>

              <tbody>
                {filteredFixtures.map(fixture => (
                  <tr
                    key={fixture.id}
                    className="border-b border-white/[0.09] transition-colors last:border-b-0 hover:bg-white/[0.055]"
                  >
                    <td className="px-5 py-4">
                      <div className="font-heading text-sm font-bold text-white">
                        <span
                          className={
                            fixture.homeTeam.includes('Top G')
                              ? 'text-gold'
                              : ''
                          }
                        >
                          {fixture.homeTeam}
                        </span>{' '}
                        vs{' '}
                        <span
                          className={
                            fixture.awayTeam.includes('Top G')
                              ? 'text-gold'
                              : ''
                          }
                        >
                          {fixture.awayTeam}
                        </span>
                      </div>

                      <div className="mt-1 font-body text-xs font-light text-muted">
                        {fixture.venue}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-heading text-sm font-bold text-white">
                        {formatDate(fixture.date)}
                      </div>

                      <div className="mt-1 font-heading text-[10px] font-bold uppercase tracking-[2px] text-muted">
                        {fixture.time}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <ResultBadge result={fixture.result} />
                    </td>

                    <td className="px-5 py-4">
                      {fixture.result === 'upcoming' ? (
                        <span className="font-heading text-sm font-bold text-muted">
                          TBC
                        </span>
                      ) : (
                        <div>
                          <div className="font-heading text-sm font-bold text-gold">
                            {fixture.ourScore || '—'}
                          </div>
                          <div className="mt-1 font-heading text-xs font-bold text-muted">
                            {fixture.oppScore || '—'}
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(fixture)}
                          className="rounded border border-white/[0.08] px-3 py-2 font-heading text-[10px] font-bold uppercase tracking-[2px] text-muted transition-colors hover:border-gold/30 hover:text-gold"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(fixture.id)}
                          className="rounded border border-[#d86b5f]/20 px-3 py-2 font-heading text-[10px] font-bold uppercase tracking-[2px] text-[#ff9b8f] transition-colors hover:bg-[#d86b5f]/10"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 gap-px bg-white/[0.10] min-[901px]:hidden">
            {filteredFixtures.map(fixture => (
              <article key={fixture.id} className="bg-[#182119] p-5">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-heading text-[10px] font-bold uppercase tracking-[2px] text-muted">
                      {formatDate(fixture.date)} · {fixture.time}
                    </p>

                    <h4 className="mt-2 font-heading text-base font-bold leading-[1.3] text-white">
                      <span
                        className={
                          fixture.homeTeam.includes('Top G') ? 'text-gold' : ''
                        }
                      >
                        {fixture.homeTeam}
                      </span>{' '}
                      vs{' '}
                      <span
                        className={
                          fixture.awayTeam.includes('Top G') ? 'text-gold' : ''
                        }
                      >
                        {fixture.awayTeam}
                      </span>
                    </h4>

                    <p className="mt-2 font-body text-xs font-light text-muted">
                      {fixture.venue}
                    </p>
                  </div>

                  <ResultBadge result={fixture.result} />
                </div>

                <div className="grid grid-cols-3 border-y border-white/[0.10] py-4 text-center">
                  <MiniStat label="Season" value={fixture.season} />
                  <MiniStat
                    label="Our Score"
                    value={fixture.ourScore || 'TBC'}
                  />
                  <MiniStat
                    label="Opp Score"
                    value={fixture.oppScore || 'TBC'}
                  />
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(fixture)}
                    className="flex-1 rounded border border-white/[0.08] px-3 py-2.5 font-heading text-[10px] font-bold uppercase tracking-[2px] text-muted transition-colors hover:border-gold/30 hover:text-gold"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(fixture.id)}
                    className="flex-1 rounded border border-[#d86b5f]/20 px-3 py-2.5 font-heading text-[10px] font-bold uppercase tracking-[2px] text-[#ff9b8f] transition-colors hover:bg-[#d86b5f]/10"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredFixtures.length === 0 && (
            <div className="p-10 text-center">
              <p className="font-display text-2xl tracking-[1px] text-white">
                No fixtures found.
              </p>

              <p className="mt-2 font-body text-sm font-light text-muted">
                Try changing the search or result filter.
              </p>
            </div>
          )}
        </section>

        <aside
          ref={formPanelRef}
          className="rounded border border-white/[0.12] bg-[#182119] p-5 sm:p-6"
        >
          <div className="mb-6">
            <p className="font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
              {editingId ? 'Edit Fixture' : 'Create Fixture'}
            </p>

            <h3 className="mt-1 font-display text-2xl tracking-[1px] text-white">
              {editingId ? 'Update Match' : 'Add Match'}
            </h3>

            <p className="mt-2 font-body text-xs font-light leading-[1.7] text-muted">
              Create upcoming matches first. After the match, edit it and add
              result scores.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AdminField label="Home Team" required>
              <input
                type="text"
                value={form.homeTeam}
                placeholder="Top G's CC"
                onChange={event => updateForm('homeTeam', event.target.value)}
                className={adminFixtureInputClass}
              />
            </AdminField>

            <AdminField label="Away Team" required>
              <input
                ref={awayTeamInputRef}
                type="text"
                value={form.awayTeam}
                placeholder="Eastern Suburbs CC"
                onChange={event => updateForm('awayTeam', event.target.value)}
                className={adminFixtureInputClass}
              />
            </AdminField>

            <div className="grid grid-cols-2 gap-3">
              <AdminField label="Date" required>
                <input
                  type="date"
                  value={form.date}
                  onChange={event => updateForm('date', event.target.value)}
                  className={adminFixtureInputClass}
                />
              </AdminField>

              <AdminField label="Time" required>
                <input
                  type="time"
                  value={form.time}
                  onChange={event => updateForm('time', event.target.value)}
                  className={adminFixtureInputClass}
                />
              </AdminField>
            </div>

            <AdminField label="Venue" required>
              <input
                type="text"
                value={form.venue}
                placeholder="Kensington Oval, Adelaide"
                onChange={event => updateForm('venue', event.target.value)}
                className={adminFixtureInputClass}
              />
            </AdminField>

            <div className="grid grid-cols-2 gap-3">
              <AdminField label="Season">
                <input
                  type="text"
                  value={form.season}
                  placeholder="2026"
                  onChange={event => updateForm('season', event.target.value)}
                  className={adminFixtureInputClass}
                />
              </AdminField>

              <AdminField label="Result">
                <select
                  value={form.result}
                  onChange={event =>
                    updateForm('result', event.target.value as FixtureResult)
                  }
                  className={adminFixtureInputClass}
                >
                  {RESULT_OPTIONS.map(result => (
                    <option key={result.value} value={result.value}>
                      {result.label}
                    </option>
                  ))}
                </select>
              </AdminField>
            </div>

            {form.result !== 'upcoming' && (
              <div className="rounded border border-white/[0.12] bg-white/[0.035] p-4">
                <p className="mb-3 font-heading text-[10px] font-bold uppercase tracking-[2.5px] text-gold">
                  Result Details
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <AdminField label="Our Score">
                    <input
                      type="text"
                      value={form.ourScore}
                      placeholder="159 / 8"
                      onChange={event =>
                        updateForm('ourScore', event.target.value)
                      }
                      className={adminFixtureInputClass}
                    />
                  </AdminField>

                  <AdminField label="Opponent Score">
                    <input
                      type="text"
                      value={form.oppScore}
                      placeholder="112 / 10"
                      onChange={event =>
                        updateForm('oppScore', event.target.value)
                      }
                      className={adminFixtureInputClass}
                    />
                  </AdminField>
                </div>

                <div className="mt-4">
                  <AdminField label="PlayHQ Scorecard URL">
                    <input
                      type="url"
                      value={form.playHqUrl}
                      placeholder="https://www.playhq.com/..."
                      onChange={event =>
                        updateForm('playHqUrl', event.target.value)
                      }
                      className={adminFixtureInputClass}
                    />
                  </AdminField>
                </div>
              </div>
            )}

            {formError && (
              <div className="rounded border border-[#d86b5f]/25 bg-[#d86b5f]/[0.08] px-4 py-3 font-body text-xs text-[#ff9b8f]">
                {formError}
              </div>
            )}

            <div className="flex flex-col gap-3 min-[420px]:flex-row">
              <button
                type="submit"
                className="flex-1 rounded bg-gold px-5 py-3.5 font-heading text-[11px] font-bold uppercase tracking-[2.5px] text-black transition-colors hover:bg-gold/90"
              >
                {editingId ? 'Save Changes' : 'Add Fixture'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded border border-white/[0.08] px-5 py-3.5 font-heading text-[11px] font-bold uppercase tracking-[2.5px] text-muted transition-colors hover:text-white"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </aside>
      </div>
    </div>
  )
}

function createFixtureBadge(
  result: FixtureResult,
  ourScore: string,
  oppScore: string
) {
  if (result === 'upcoming') return 'Upcoming'
  if (result === 'draw') return 'Draw'

  const ourRuns = Number(ourScore.split('/')[0]?.trim())
  const oppRuns = Number(oppScore.split('/')[0]?.trim())

  if (Number.isNaN(ourRuns) || Number.isNaN(oppRuns)) {
    return resultLabel[result]
  }

  const margin = Math.abs(ourRuns - oppRuns)

  if (result === 'won') return `Won +${margin}`
  return `Lost −${margin}`
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

interface StatCardProps {
  label: string
  value: number
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded border border-white/[0.12] bg-white/[0.035] p-4">
      <div className="font-display text-3xl leading-none text-white">
        {value}
      </div>

      <div className="mt-1 font-heading text-[9px] font-bold uppercase tracking-[2px] text-muted">
        {label}
      </div>
    </div>
  )
}

interface TableHeadProps {
  children: ReactNode
}

function TableHead({ children }: TableHeadProps) {
  return (
    <th className="px-5 py-4 font-heading text-[10px] font-bold uppercase tracking-[2.5px] text-muted">
      {children}
    </th>
  )
}

interface ResultBadgeProps {
  result: FixtureResult
}

function ResultBadge({ result }: ResultBadgeProps) {
  return (
    <span
      className={`inline-flex rounded border px-2.5 py-1.5 font-heading text-[9px] font-bold uppercase tracking-[2px] ${resultBadgeClass[result]}`}
    >
      {resultLabel[result]}
    </span>
  )
}

interface MiniStatProps {
  label: string
  value: string | number
}

function MiniStat({ label, value }: MiniStatProps) {
  return (
    <div className="border-r border-white/[0.10] last:border-r-0">
      <div className="font-display text-xl leading-none text-white">
        {value}
      </div>

      <div className="mt-1 font-heading text-[8px] font-bold uppercase tracking-[2px] text-muted">
        {label}
      </div>
    </div>
  )
}

interface AdminFieldProps {
  label: string
  required?: boolean
  children: ReactNode
}

function AdminField({ label, required, children }: AdminFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block font-heading text-[10px] font-bold uppercase tracking-[2.5px] text-muted">
        {label}
        {required ? <span className="text-gold"> *</span> : null}
      </span>

      {children}
    </label>
  )
}

export default ManageFixtures
