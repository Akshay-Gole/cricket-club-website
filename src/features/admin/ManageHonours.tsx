import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import honoursApi from '../honours/api/honours.api'
import type {
  HonourAwardWinner,
  HonourRecord,
  HonoursData,
  HonourTrophy,
} from '../honours/types/honour.types'
import {
  AdminField,
  FormActions,
  StatCard,
  ToggleCard,
} from './components/shared/AdminFormPrimitives'
import {
  adminHonoursInputClass,
  adminHonoursTextareaClass,
  EMPTY_AWARD_FORM,
  EMPTY_RECORD_FORM,
  EMPTY_TROPHY_FORM,
  HONOUR_TABS,
  type AwardFormState,
  type HonourTab,
  type RecordFormState,
  type TrophyFormState,
} from './constants/adminHonours.constants'

const EMPTY_HONOURS: HonoursData = {
  snapshot: {
    clubTrophies: 0,
    finalsPlayed: 0,
    awardWinners: 0,
  },
  trophies: [],
  awardWinners: [],
  records: [],
  manualRecordTemplates: [],
}

function ManageHonours() {
  const [activeTab, setActiveTab] = useState<HonourTab>('trophies')
  const [search, setSearch] = useState('')
  const [honours, setHonours] = useState<HonoursData>(EMPTY_HONOURS)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [editingTrophyId, setEditingTrophyId] = useState<string | null>(null)
  const [editingAwardId, setEditingAwardId] = useState<string | null>(null)
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null)

  const [trophyForm, setTrophyForm] =
    useState<TrophyFormState>(EMPTY_TROPHY_FORM)
  const [awardForm, setAwardForm] = useState<AwardFormState>(EMPTY_AWARD_FORM)
  const [recordForm, setRecordForm] =
    useState<RecordFormState>(EMPTY_RECORD_FORM)
  const [formError, setFormError] = useState('')

  const [searchParams, setSearchParams] = useSearchParams()

  const formPanelRef = useRef<HTMLElement | null>(null)
  const firstInputRef = useRef<HTMLInputElement | null>(null)

  const trophies = honours.trophies
  const awards = honours.awardWinners
  const records = honours.records
  const manualRecordTemplates = honours.manualRecordTemplates

  const stats = useMemo(
    () => ({
      trophies: trophies.length,
      awards: awards.length,
      records: records.length,
      featured:
        trophies.filter(item => item.featured).length +
        awards.filter(item => item.featured).length +
        records.filter(item => item.featured).length,
    }),
    [awards, records, trophies]
  )

  const filteredTrophies = useMemo(() => {
    const searchValue = search.trim().toLowerCase()
    return trophies.filter(trophy =>
      [trophy.year, trophy.title, trophy.type, trophy.description]
        .join(' ')
        .toLowerCase()
        .includes(searchValue)
    )
  }, [search, trophies])

  const filteredAwards = useMemo(() => {
    const searchValue = search.trim().toLowerCase()
    return awards.filter(award =>
      [award.season, award.award, award.name, award.detail]
        .join(' ')
        .toLowerCase()
        .includes(searchValue)
    )
  }, [awards, search])

  const filteredRecords = useMemo(() => {
    const searchValue = search.trim().toLowerCase()
    return records.filter(record =>
      [record.label, record.value, record.meta, record.source]
        .join(' ')
        .toLowerCase()
        .includes(searchValue)
    )
  }, [records, search])

  const focusForm = useCallback(() => {
    formPanelRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })

    window.setTimeout(() => {
      firstInputRef.current?.focus()
    }, 350)
  }, [])

  const resetCurrentForm = useCallback(() => {
    setFormError('')

    if (activeTab === 'trophies') {
      setTrophyForm(EMPTY_TROPHY_FORM)
      setEditingTrophyId(null)
    }

    if (activeTab === 'awards') {
      setAwardForm(EMPTY_AWARD_FORM)
      setEditingAwardId(null)
    }

    if (activeTab === 'records') {
      setRecordForm(EMPTY_RECORD_FORM)
      setEditingRecordId(null)
    }
  }, [activeTab])

  const loadHonours = useCallback(async () => {
    try {
      setIsLoading(true)
      setHonours(await honoursApi.getAdmin())
      setFormError('')
    } catch {
      setFormError('Could not load honours. Please check the backend.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadHonours()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [loadHonours])

  useEffect(() => {
    if (searchParams.get('action') !== 'create') return

    const timeoutId = window.setTimeout(() => {
      resetCurrentForm()
      focusForm()
      setSearchParams({}, { replace: true })
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [focusForm, resetCurrentForm, searchParams, setSearchParams])

  const handleTrophySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!trophyForm.year.trim() || !trophyForm.title.trim()) {
      setFormError('Year and title are required')
      return
    }

    if (!trophyForm.description.trim()) {
      setFormError('Description is required')
      return
    }

    try {
      setIsSaving(true)
      const payload = {
        year: trophyForm.year.trim(),
        title: trophyForm.title.trim(),
        type: trophyForm.type.trim() || 'Trophy',
        description: trophyForm.description.trim(),
        featured: trophyForm.featured,
      }

      const data = editingTrophyId
        ? await honoursApi.updateTrophy(editingTrophyId, payload)
        : await honoursApi.createTrophy(payload)

      setHonours(data)
      setTrophyForm(EMPTY_TROPHY_FORM)
      setEditingTrophyId(null)
      setFormError('')
    } catch {
      setFormError('Something went wrong while saving this trophy.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAwardSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (
      !awardForm.season.trim() ||
      !awardForm.award.trim() ||
      !awardForm.name.trim()
    ) {
      setFormError('Season, award and player name are required')
      return
    }

    try {
      setIsSaving(true)
      const payload = {
        season: awardForm.season.trim(),
        award: awardForm.award.trim(),
        name: awardForm.name.trim(),
        detail: awardForm.detail.trim(),
        featured: awardForm.featured,
      }

      const data = editingAwardId
        ? await honoursApi.updateAward(editingAwardId, payload)
        : await honoursApi.createAward(payload)

      setHonours(data)
      setAwardForm(EMPTY_AWARD_FORM)
      setEditingAwardId(null)
      setFormError('')
    } catch {
      setFormError('Something went wrong while saving this award.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleRecordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!recordForm.label.trim() || !recordForm.value.trim()) {
      setFormError('Record label and value are required')
      return
    }

    try {
      setIsSaving(true)
      const id = editingRecordId ?? slugify(recordForm.label)
      const template = manualRecordTemplates.find(item => item.id === id)
      const payload = {
        label: recordForm.label.trim(),
        value: recordForm.value.trim(),
        meta: recordForm.meta.trim(),
        featured: recordForm.featured,
        sortOrder: template?.sortOrder ?? 90,
      }

      setHonours(await honoursApi.updateManualRecord(id, payload))
      setRecordForm(EMPTY_RECORD_FORM)
      setEditingRecordId(null)
      setFormError('')
    } catch {
      setFormError('Something went wrong while saving this record.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditTrophy = (trophy: HonourTrophy) => {
    setActiveTab('trophies')
    setEditingTrophyId(trophy.id)
    setTrophyForm({
      year: trophy.year,
      title: trophy.title,
      type: trophy.type,
      description: trophy.description,
      featured: trophy.featured,
    })
    setFormError('')
    focusForm()
  }

  const handleEditAward = (award: HonourAwardWinner) => {
    setActiveTab('awards')
    setEditingAwardId(award.id)
    setAwardForm({
      season: award.season,
      award: award.award,
      name: award.name,
      detail: award.detail,
      featured: award.featured,
    })
    setFormError('')
    focusForm()
  }

  const handleEditRecord = (record: HonourRecord) => {
    if (record.source !== 'manual') return

    setActiveTab('records')
    setEditingRecordId(record.id)
    setRecordForm({
      label: record.label,
      value: record.value,
      meta: record.meta,
      featured: record.featured,
    })
    setFormError('')
    focusForm()
  }

  const handleDeleteTrophy = async (id: string) => {
    try {
      setIsSaving(true)
      await honoursApi.deleteTrophy(id)
      await loadHonours()
    } catch {
      setFormError('Something went wrong while deleting this trophy.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAward = async (id: string) => {
    try {
      setIsSaving(true)
      await honoursApi.deleteAward(id)
      await loadHonours()
    } catch {
      setFormError('Something went wrong while deleting this award.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteRecord = async (record: HonourRecord) => {
    if (record.source !== 'manual') return

    try {
      setIsSaving(true)
      await honoursApi.deleteManualRecord(record.id)
      await loadHonours()
    } catch {
      setFormError('Something went wrong while deleting this record.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="relative overflow-hidden rounded border border-white/[0.1] bg-[#181818] px-5 py-7 shadow-[0_20px_70px_rgba(0,0,0,0.24)] sm:px-7 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(201,168,76,0.12),transparent_34%)]"
        />

        <div className="relative flex flex-col gap-5 min-[901px]:flex-row min-[901px]:items-end min-[901px]:justify-between">
          <div>
            <div className="mb-3 font-heading text-[10px] font-bold uppercase tracking-[4px] text-gold">
              Club Legacy
            </div>
            <h2 className="font-display text-[38px] leading-none tracking-[1px] text-white sm:text-[48px]">
              Manage Honours.
            </h2>
            <p className="mt-4 max-w-[660px] font-body text-sm font-light leading-[1.8] text-muted">
              Add trophies and award winners manually. Club bests combine
              automatic fixture/player data with a few manual historical
              records.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 min-[520px]:grid-cols-4 min-[901px]:w-[520px]">
            <StatCard label="Trophies" value={stats.trophies} />
            <StatCard label="Awards" value={stats.awards} />
            <StatCard label="Records" value={stats.records} />
            <StatCard label="Featured" value={stats.featured} />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 sm:gap-6 min-[1180px]:grid-cols-[minmax(0,1fr)_430px]">
        <section className="overflow-hidden rounded border border-white/[0.1] bg-[#161616]">
          <div className="border-b border-white/[0.1] p-5 sm:p-6">
            <div className="flex flex-col gap-4 min-[901px]:flex-row min-[901px]:items-center min-[901px]:justify-between">
              <div>
                <p className="font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
                  Content Type
                </p>
                <div className="mt-3 flex overflow-x-auto rounded border border-white/[0.12] bg-white/[0.035] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {HONOUR_TABS.map(tab => (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.value)
                        setFormError('')
                      }}
                      className={`shrink-0 px-5 py-3 font-heading text-[10px] font-bold uppercase tracking-[2px] transition-colors ${
                        activeTab === tab.value
                          ? 'bg-gold text-black'
                          : 'text-muted hover:bg-white/[0.04] hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="search"
                value={search}
                placeholder="Search honours..."
                onChange={event => setSearch(event.target.value)}
                className="h-11 rounded border border-white/[0.12] bg-white/[0.045] px-4 font-heading text-sm font-semibold tracking-[0.5px] text-white outline-none placeholder:text-muted focus:border-gold/40 min-[641px]:w-[300px]"
              />
            </div>
          </div>

          {isLoading && (
            <div className="p-8 font-heading text-sm uppercase tracking-[2px] text-muted">
              Loading honours...
            </div>
          )}

          {!isLoading && activeTab === 'trophies' && (
            <div className="grid grid-cols-1 gap-px bg-white/[0.1] min-[760px]:grid-cols-2">
              {filteredTrophies.map(trophy => (
                <HonourCard
                  key={trophy.id}
                  eyebrow={`${trophy.year} · ${trophy.type}`}
                  title={trophy.title}
                  meta={trophy.description}
                  featured={trophy.featured}
                  onEdit={() => handleEditTrophy(trophy)}
                  onDelete={() => void handleDeleteTrophy(trophy.id)}
                />
              ))}
            </div>
          )}

          {!isLoading && activeTab === 'awards' && (
            <div className="grid grid-cols-1 gap-px bg-white/[0.1] min-[760px]:grid-cols-2">
              {filteredAwards.map(award => (
                <HonourCard
                  key={award.id}
                  eyebrow={`${award.season} · ${award.award}`}
                  title={award.name}
                  meta={award.detail}
                  featured={award.featured}
                  onEdit={() => handleEditAward(award)}
                  onDelete={() => void handleDeleteAward(award.id)}
                />
              ))}
            </div>
          )}

          {!isLoading && activeTab === 'records' && (
            <div className="grid grid-cols-1 gap-px bg-white/[0.1] min-[760px]:grid-cols-2">
              {filteredRecords.map(record => (
                <HonourCard
                  key={record.id}
                  eyebrow={
                    record.source === 'automatic'
                      ? `${record.label} · Auto`
                      : record.label
                  }
                  title={record.value}
                  meta={record.meta}
                  featured={record.featured}
                  readonly={record.source === 'automatic'}
                  onEdit={() => handleEditRecord(record)}
                  onDelete={() => void handleDeleteRecord(record)}
                />
              ))}
            </div>
          )}
        </section>

        <aside
          ref={formPanelRef}
          className="rounded border border-white/[0.1] bg-[#161616] p-5 shadow-[0_14px_44px_rgba(0,0,0,0.22)] sm:p-6"
        >
          <div className="mb-6">
            <p className="font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
              {formTitle(activeTab).eyebrow}
            </p>
            <h3 className="mt-1 font-display text-2xl tracking-[1px] text-white">
              {formTitle(activeTab).title}
            </h3>
            <p className="mt-2 font-body text-xs font-light leading-[1.7] text-muted">
              Featured items are the ones shown first on the public Honours
              page. Automatic records are calculated from fixtures and player
              stats.
            </p>
          </div>

          {activeTab === 'trophies' && (
            <form onSubmit={handleTrophySubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                <AdminField label="Year" required>
                  <input
                    ref={firstInputRef}
                    value={trophyForm.year}
                    onChange={event =>
                      setTrophyForm(current => ({
                        ...current,
                        year: event.target.value,
                      }))
                    }
                    className={adminHonoursInputClass}
                  />
                </AdminField>
                <AdminField label="Type">
                  <input
                    value={trophyForm.type}
                    placeholder="Trophy"
                    onChange={event =>
                      setTrophyForm(current => ({
                        ...current,
                        type: event.target.value,
                      }))
                    }
                    className={adminHonoursInputClass}
                  />
                </AdminField>
              </div>

              <AdminField label="Title" required>
                <input
                  value={trophyForm.title}
                  placeholder="T20 Shield Winners"
                  onChange={event =>
                    setTrophyForm(current => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  className={adminHonoursInputClass}
                />
              </AdminField>

              <AdminField label="Description" required>
                <textarea
                  value={trophyForm.description}
                  onChange={event =>
                    setTrophyForm(current => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  className={adminHonoursTextareaClass}
                />
              </AdminField>

              <ToggleCard
                title="Featured"
                description="Show this in the first preview cards."
                checked={trophyForm.featured}
                onChange={checked =>
                  setTrophyForm(current => ({
                    ...current,
                    featured: checked,
                  }))
                }
              />

              <FormActions
                error={formError}
                editing={Boolean(editingTrophyId)}
                submitLabel={editingTrophyId ? 'Save Trophy' : 'Add Trophy'}
                onCancel={() => {
                  setTrophyForm(EMPTY_TROPHY_FORM)
                  setEditingTrophyId(null)
                  setFormError('')
                }}
              />
            </form>
          )}

          {activeTab === 'awards' && (
            <form onSubmit={handleAwardSubmit} className="space-y-4">
              <AdminField label="Season" required>
                <input
                  ref={firstInputRef}
                  value={awardForm.season}
                  onChange={event =>
                    setAwardForm(current => ({
                      ...current,
                      season: event.target.value,
                    }))
                  }
                  className={adminHonoursInputClass}
                />
              </AdminField>

              <AdminField label="Award" required>
                <input
                  value={awardForm.award}
                  placeholder="Player of the Season"
                  onChange={event =>
                    setAwardForm(current => ({
                      ...current,
                      award: event.target.value,
                    }))
                  }
                  className={adminHonoursInputClass}
                />
              </AdminField>

              <AdminField label="Player Name" required>
                <input
                  value={awardForm.name}
                  placeholder="Akshay Gole"
                  onChange={event =>
                    setAwardForm(current => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  className={adminHonoursInputClass}
                />
              </AdminField>

              <AdminField label="Detail">
                <input
                  value={awardForm.detail}
                  placeholder="847 runs"
                  onChange={event =>
                    setAwardForm(current => ({
                      ...current,
                      detail: event.target.value,
                    }))
                  }
                  className={adminHonoursInputClass}
                />
              </AdminField>

              <ToggleCard
                title="Featured"
                description="Show this in the first preview cards."
                checked={awardForm.featured}
                onChange={checked =>
                  setAwardForm(current => ({
                    ...current,
                    featured: checked,
                  }))
                }
              />

              <FormActions
                error={formError}
                editing={Boolean(editingAwardId)}
                submitLabel={editingAwardId ? 'Save Award' : 'Add Award'}
                onCancel={() => {
                  setAwardForm(EMPTY_AWARD_FORM)
                  setEditingAwardId(null)
                  setFormError('')
                }}
              />
            </form>
          )}

          {activeTab === 'records' && (
            <form onSubmit={handleRecordSubmit} className="space-y-4">
              <AdminField label="Manual record type" required>
                <select
                  value={editingRecordId ?? ''}
                  onChange={event => {
                    const template = manualRecordTemplates.find(
                      item => item.id === event.target.value
                    )

                    if (!template) return

                    setEditingRecordId(template.id)
                    setRecordForm(current => ({
                      ...current,
                      label: template.label,
                    }))
                  }}
                  className={adminHonoursInputClass}
                >
                  <option value="">Custom record</option>
                  {manualRecordTemplates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.label}
                    </option>
                  ))}
                </select>
              </AdminField>

              <AdminField label="Record Label" required>
                <input
                  value={recordForm.label}
                  placeholder="Highest partnership"
                  onChange={event =>
                    setRecordForm(current => ({
                      ...current,
                      label: event.target.value,
                    }))
                  }
                  className={adminHonoursInputClass}
                />
              </AdminField>

              <AdminField label="Value" required>
                <input
                  value={recordForm.value}
                  placeholder="138"
                  onChange={event =>
                    setRecordForm(current => ({
                      ...current,
                      value: event.target.value,
                    }))
                  }
                  className={adminHonoursInputClass}
                />
              </AdminField>

              <AdminField label="Meta">
                <input
                  value={recordForm.meta}
                  placeholder="Gole / Jones"
                  onChange={event =>
                    setRecordForm(current => ({
                      ...current,
                      meta: event.target.value,
                    }))
                  }
                  className={adminHonoursInputClass}
                />
              </AdminField>

              <ToggleCard
                title="Featured"
                description="Show this in the first preview cards."
                checked={recordForm.featured}
                onChange={checked =>
                  setRecordForm(current => ({
                    ...current,
                    featured: checked,
                  }))
                }
              />

              <FormActions
                error={formError}
                editing={Boolean(editingRecordId)}
                submitLabel={editingRecordId ? 'Save Record' : 'Add Record'}
                onCancel={() => {
                  setRecordForm(EMPTY_RECORD_FORM)
                  setEditingRecordId(null)
                  setFormError('')
                }}
              />
            </form>
          )}

          {isSaving && (
            <p className="mt-4 font-heading text-[10px] uppercase tracking-[2px] text-muted">
              Saving...
            </p>
          )}
        </aside>
      </div>
    </div>
  )
}

function formTitle(tab: HonourTab) {
  const title: Record<HonourTab, { eyebrow: string; title: string }> = {
    trophies: { eyebrow: 'Trophy Entry', title: 'Add Honour' },
    awards: { eyebrow: 'Award Entry', title: 'Add Winner' },
    records: { eyebrow: 'Manual Record', title: 'Add Record' },
  }

  return title[tab]
}

function slugify(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || `record-${Date.now()}`
  )
}

function HonourCard({
  eyebrow,
  title,
  meta,
  featured,
  readonly = false,
  onEdit,
  onDelete,
}: {
  eyebrow: string
  title: string
  meta: string
  featured: boolean
  readonly?: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <article className="bg-[#161616] p-5">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded border border-gold/25 bg-gold/[0.08] px-2.5 py-1.5 font-heading text-[9px] font-bold uppercase tracking-[2px] text-gold">
          {eyebrow}
        </span>
        {featured && (
          <span className="rounded border border-green-light/25 bg-green-light/[0.08] px-2.5 py-1.5 font-heading text-[9px] font-bold uppercase tracking-[2px] text-green-light">
            Featured
          </span>
        )}
      </div>

      <h4 className="font-heading text-[26px] font-bold leading-[1.05] text-white">
        {title}
      </h4>
      <p className="mt-4 line-clamp-3 font-body text-sm font-light leading-[1.7] text-muted">
        {meta || 'No detail added yet.'}
      </p>

      {readonly ? (
        <div className="mt-6 rounded border border-white/[0.08] px-3 py-2.5 font-heading text-[10px] font-bold uppercase tracking-[2px] text-muted">
          Calculated automatically
        </div>
      ) : (
        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="flex-1 rounded border border-white/[0.08] px-3 py-2.5 font-heading text-[10px] font-bold uppercase tracking-[2px] text-muted transition-colors hover:border-gold/30 hover:text-gold"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex-1 rounded border border-[#d86b5f]/20 px-3 py-2.5 font-heading text-[10px] font-bold uppercase tracking-[2px] text-[#ff9b8f] transition-colors hover:bg-[#d86b5f]/10"
          >
            Delete
          </button>
        </div>
      )}
    </article>
  )
}

export default ManageHonours
