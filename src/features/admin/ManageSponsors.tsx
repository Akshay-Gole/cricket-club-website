import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent, ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  adminSponsorInputClass,
  adminSponsorTextareaClass,
  EMPTY_SPONSOR_FORM,
  sponsorStatusClass,
  SPONSOR_FILTERS,
  type AdminSponsor,
  type SponsorFilter,
  type SponsorFormState,
} from './constants/adminSponsor.constants'
import {
  ADMIN_SPONSORS_QUERY_KEY,
  PUBLIC_SPONSORS_QUERY_KEY,
  createSponsor,
  deleteSponsor,
  getAdminSponsors,
  uploadSponsorLogo,
  updateSponsor,
} from '../sponsors/api/sponsor.api'

function ManageSponsors() {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<SponsorFilter>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<SponsorFormState>(EMPTY_SPONSOR_FORM)
  const [formError, setFormError] = useState('')

  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const {
    data: sponsors = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ADMIN_SPONSORS_QUERY_KEY,
    queryFn: getAdminSponsors,
  })

  const logoInputRef = useRef<HTMLInputElement | null>(null)
  const formPanelRef = useRef<HTMLElement | null>(null)
  const nameInputRef = useRef<HTMLInputElement | null>(null)

  const saveMutation = useMutation({
    mutationFn: async () => {
      let sponsorForm = form

      if (form.logoFile) {
        const uploadedLogo = await uploadSponsorLogo(form.logoFile)
        sponsorForm = {
          ...form,
          ...uploadedLogo,
        }
      }

      return editingId
        ? updateSponsor(editingId, sponsorForm)
        : createSponsor(sponsorForm)
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ADMIN_SPONSORS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: PUBLIC_SPONSORS_QUERY_KEY }),
      ])
      resetForm()
    },
    onError: () => {
      setFormError('Could not save sponsor. Check the details and try again.')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteSponsor,
    onSuccess: async (_data, sponsorId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ADMIN_SPONSORS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: PUBLIC_SPONSORS_QUERY_KEY }),
      ])

      if (editingId === sponsorId) resetForm()
    },
  })

  const filteredSponsors = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    return sponsors.filter(sponsor => {
      const sponsorText = [
        sponsor.name,
        sponsor.industry,
        sponsor.contactName,
        sponsor.contactEmail,
      ]
        .join(' ')
        .toLowerCase()

      const matchesSearch = sponsorText.includes(searchValue)

      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'active' && sponsor.active) ||
        (activeFilter === 'inactive' && !sponsor.active) ||
        (activeFilter === 'featured' && sponsor.featured)

      return matchesSearch && matchesFilter
    })
  }, [sponsors, search, activeFilter])

  const stats = useMemo(() => {
    return {
      total: sponsors.length,
      active: sponsors.filter(sponsor => sponsor.active).length,
      inactive: sponsors.filter(sponsor => !sponsor.active).length,
      featured: sponsors.filter(sponsor => sponsor.featured).length,
    }
  }, [sponsors])

  const updateForm = (
    field: keyof SponsorFormState,
    value: string | boolean | File | null
  ) => {
    setForm(current => ({
      ...current,
      [field]: value,
    }))

    setFormError('')
  }

  const revokeBlobPreview = (previewUrl: string) => {
    if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
  }

  const handleLogoSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid logo image')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError('Sponsor logo must be smaller than 5 MB')
      return
    }

    revokeBlobPreview(form.logoPreviewUrl)
    setForm(current => ({
      ...current,
      logoFile: file,
      logoPreviewUrl: URL.createObjectURL(file),
    }))
    setFormError('')
  }

  const removeLogo = () => {
    revokeBlobPreview(form.logoPreviewUrl)
    setForm(current => ({
      ...current,
      logoFile: null,
      logoPreviewUrl: '',
      logoUrl: '',
      logoPublicId: '',
    }))

    if (logoInputRef.current) logoInputRef.current.value = ''
  }

  const resetForm = () => {
    revokeBlobPreview(form.logoPreviewUrl)
    setForm(EMPTY_SPONSOR_FORM)
    setEditingId(null)
    setFormError('')
  }

  const focusForm = () => {
    formPanelRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })

    window.setTimeout(() => {
      nameInputRef.current?.focus()
    }, 350)
  }

  useEffect(() => {
    if (searchParams.get('action') !== 'create') return

    const timeoutId = window.setTimeout(() => {
      setForm(EMPTY_SPONSOR_FORM)
      setEditingId(null)
      setFormError('')

      formPanelRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })

      window.setTimeout(() => {
        nameInputRef.current?.focus()
      }, 350)

      setSearchParams({}, { replace: true })
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [searchParams, setSearchParams])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.name.trim()) {
      setFormError('Sponsor name is required')
      return
    }

    if (!form.industry.trim()) {
      setFormError('Industry is required')
      return
    }

    if (!form.contactEmail.trim()) {
      setFormError('Contact email is required')
      return
    }

    saveMutation.mutate()
  }

  const handleEdit = (sponsor: AdminSponsor) => {
    setEditingId(sponsor.id)

    setForm({
      name: sponsor.name,
      industry: sponsor.industry,
      website: sponsor.website,
      contactName: sponsor.contactName,
      contactEmail: sponsor.contactEmail,
      phone: sponsor.phone,
      logoFile: null,
      logoPreviewUrl: sponsor.logoUrl,
      logoUrl: sponsor.logoUrl,
      logoPublicId: sponsor.logoPublicId,
      active: sponsor.active,
      featured: sponsor.featured,
      notes: sponsor.notes,
    })

    setFormError('')

    focusForm()
  }

  const handleDelete = (sponsorId: string) => {
    deleteMutation.mutate(sponsorId)
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
              Club Partners
            </div>

            <h2 className="font-display text-[38px] leading-none tracking-[1px] text-white sm:text-[48px]">
              Manage Sponsors.
            </h2>

            <p className="mt-4 max-w-[620px] font-body text-sm font-light leading-[1.8] text-muted">
              Add club partners, control public visibility and feature sponsors
              on the homepage.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 min-[520px]:grid-cols-4 min-[901px]:w-[520px]">
            <StatCard label="Sponsors" value={stats.total} />
            <StatCard label="Active" value={stats.active} />
            <StatCard label="Inactive" value={stats.inactive} />
            <StatCard label="Featured" value={stats.featured} />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 sm:gap-6 min-[1180px]:grid-cols-[minmax(0,1fr)_430px]">
        <section className="overflow-hidden rounded border border-white/[0.1] bg-[#161616]">
          <div className="border-b border-white/[0.10] p-5 sm:p-6">
            <div className="flex flex-col gap-4">
              <div>
                <p className="font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
                  Sponsor List
                </p>

                <h3 className="mt-1 font-display text-2xl tracking-[1px] text-white">
                  {isLoading
                    ? 'Loading...'
                    : `${filteredSponsors.length} Sponsors`}
                </h3>
              </div>

              <div className="flex min-w-0 flex-col gap-3">
                <input
                  type="search"
                  value={search}
                  placeholder="Search sponsor, industry..."
                  onChange={event => setSearch(event.target.value)}
                  className="h-11 w-full rounded border border-white/[0.12] bg-white/[0.045] px-4 font-heading text-sm font-semibold tracking-[0.5px] text-white outline-none placeholder:text-muted focus:border-gold/40"
                />

                <div className="flex min-w-0 flex-wrap overflow-hidden rounded border border-white/[0.12] bg-white/[0.035]">
                  {SPONSOR_FILTERS.map(filter => {
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

          {isError && (
            <div className="border-b border-[#d86b5f]/25 bg-[#d86b5f]/[0.08] p-5">
              <p className="font-body text-sm text-[#ff9b8f]">
                Could not load sponsors.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-2 font-heading text-[10px] font-bold uppercase tracking-[2px] text-gold"
              >
                Try again
              </button>
            </div>
          )}

          <div className="hidden min-[901px]:block">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/[0.10] text-left">
                  <TableHead>Sponsor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Actions</TableHead>
                </tr>
              </thead>

              <tbody>
                {filteredSponsors.map(sponsor => (
                  <tr
                    key={sponsor.id}
                    className="border-b border-white/[0.09] transition-colors last:border-b-0 hover:bg-white/[0.055]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <SponsorLogo sponsor={sponsor} />

                        <div className="min-w-0">
                          <h4 className="font-heading text-sm font-bold text-white">
                            {sponsor.name}
                          </h4>

                          <p className="mt-1 font-body text-xs font-light text-muted">
                            {sponsor.industry}
                          </p>

                          {sponsor.featured && (
                            <p className="mt-2 font-heading text-[9px] font-bold uppercase tracking-[2px] text-gold">
                              Featured Partner
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge active={sponsor.active} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-heading text-xs font-bold text-white">
                        {sponsor.contactName || '—'}
                      </div>

                      <div className="mt-1 font-body text-xs font-light text-muted">
                        {sponsor.contactEmail}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="max-w-[180px] truncate font-body text-xs font-light text-muted">
                        {sponsor.website || '—'}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(sponsor)}
                          className="rounded border border-white/[0.08] px-3 py-2 font-heading text-[10px] font-bold uppercase tracking-[2px] text-muted transition-colors hover:border-gold/30 hover:text-gold"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(sponsor.id)}
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
            {filteredSponsors.map(sponsor => (
              <article key={sponsor.id} className="bg-[#161616] p-5">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <SponsorLogo sponsor={sponsor} large />

                    <div>
                      <h4 className="font-heading text-base font-bold text-white">
                        {sponsor.name}
                      </h4>

                      <p className="mt-1 font-body text-xs font-light text-muted">
                        {sponsor.industry}
                      </p>
                    </div>
                  </div>

                  <StatusBadge active={sponsor.active} />
                </div>

                {sponsor.featured && (
                  <div className="mb-4">
                    <span className="inline-flex rounded border border-gold/25 bg-gold/[0.08] px-2.5 py-1.5 font-heading text-[9px] font-bold uppercase tracking-[2px] text-gold">
                      Featured Partner
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-3 border-y border-white/[0.10] py-4 text-center">
                  <MiniStat
                    label="Contact"
                    value={sponsor.contactName || '—'}
                  />
                  <MiniStat
                    label="Joined"
                    value={formatShortDate(sponsor.joinedAt)}
                  />
                  <MiniStat label="Phone" value={sponsor.phone || '—'} />
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(sponsor)}
                    className="flex-1 rounded border border-white/[0.08] px-3 py-2.5 font-heading text-[10px] font-bold uppercase tracking-[2px] text-muted transition-colors hover:border-gold/30 hover:text-gold"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(sponsor.id)}
                    className="flex-1 rounded border border-[#d86b5f]/20 px-3 py-2.5 font-heading text-[10px] font-bold uppercase tracking-[2px] text-[#ff9b8f] transition-colors hover:bg-[#d86b5f]/10"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredSponsors.length === 0 && (
            <div className="p-10 text-center">
              <p className="font-display text-2xl tracking-[1px] text-white">
                No sponsors found.
              </p>

              <p className="mt-2 font-body text-sm font-light text-muted">
                Try changing the search or sponsor filter.
              </p>
            </div>
          )}
        </section>

        <aside
          ref={formPanelRef}
          className="rounded border border-white/[0.1] bg-[#161616] p-5 shadow-[0_14px_44px_rgba(0,0,0,0.22)] sm:p-6"
        >
          <div className="mb-6">
            <p className="font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
              {editingId ? 'Edit Sponsor' : 'Create Sponsor'}
            </p>

            <h3 className="mt-1 font-display text-2xl tracking-[1px] text-white">
              {editingId ? 'Update Partner' : 'Add Partner'}
            </h3>

            <p className="mt-2 font-body text-xs font-light leading-[1.7] text-muted">
              Sponsor details and logo images are saved through the backend.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AdminField label="Sponsor Name" required>
              <input
                ref={nameInputRef}
                type="text"
                value={form.name}
                placeholder="e.g. Spicy Chick"
                onChange={event => updateForm('name', event.target.value)}
                className={adminSponsorInputClass}
              />
            </AdminField>

            <AdminField label="Industry" required>
              <input
                type="text"
                value={form.industry}
                placeholder="Restaurant"
                onChange={event => updateForm('industry', event.target.value)}
                className={adminSponsorInputClass}
              />
            </AdminField>

            <AdminField label="Website">
              <input
                type="url"
                value={form.website}
                placeholder="https://example.com"
                onChange={event => updateForm('website', event.target.value)}
                className={adminSponsorInputClass}
              />
            </AdminField>

            <div className="grid grid-cols-1 gap-3 min-[641px]:grid-cols-2 min-[1180px]:grid-cols-1">
              <AdminField label="Contact Name">
                <input
                  type="text"
                  value={form.contactName}
                  placeholder="Sam Patel"
                  onChange={event =>
                    updateForm('contactName', event.target.value)
                  }
                  className={adminSponsorInputClass}
                />
              </AdminField>

              <AdminField label="Contact Email" required>
                <input
                  type="email"
                  value={form.contactEmail}
                  placeholder="sam@example.com"
                  onChange={event =>
                    updateForm('contactEmail', event.target.value)
                  }
                  className={adminSponsorInputClass}
                />
              </AdminField>
            </div>

            <AdminField label="Phone">
              <input
                type="tel"
                value={form.phone}
                placeholder="+61 400 000 000"
                onChange={event => updateForm('phone', event.target.value)}
                className={adminSponsorInputClass}
              />
            </AdminField>

            <div>
              <span className="mb-2 block font-heading text-[10px] font-bold uppercase tracking-[2.5px] text-muted">
                Sponsor Logo
              </span>

              <div className="overflow-hidden rounded border border-white/[0.12] bg-white/[0.035]">
                {form.logoPreviewUrl ? (
                  <div>
                    <div className="flex h-40 items-center justify-center bg-white p-6">
                      <img
                        src={form.logoPreviewUrl}
                        alt="Sponsor logo preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3 px-4 py-3">
                      <span className="truncate font-body text-xs text-muted">
                        {form.logoFile?.name ?? 'Current sponsor logo'}
                      </span>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => logoInputRef.current?.click()}
                          className="font-heading text-[9px] font-bold uppercase tracking-[2px] text-gold"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={removeLogo}
                          className="font-heading text-[9px] font-bold uppercase tracking-[2px] text-[#ff9b8f]"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="flex min-h-32 w-full flex-col items-center justify-center gap-2 p-6 text-center hover:bg-white/[0.04]"
                  >
                    <span className="font-heading text-sm font-bold uppercase tracking-[2px] text-white">
                      Upload Sponsor Logo
                    </span>
                    <span className="font-body text-xs text-muted">
                      PNG, JPG, WebP or SVG · maximum 5 MB
                    </span>
                  </button>
                )}

                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleLogoSelect}
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
              <ToggleCard
                title="Active Sponsor"
                description="Show this sponsor publicly."
                checked={form.active}
                onChange={value => updateForm('active', value)}
              />

              <ToggleCard
                title="Featured"
                description="Highlight on homepage."
                checked={form.featured}
                onChange={value => updateForm('featured', value)}
              />
            </div>

            <AdminField label="Notes">
              <textarea
                value={form.notes}
                placeholder="Internal notes about agreement, benefits, renewal..."
                onChange={event => updateForm('notes', event.target.value)}
                className={adminSponsorTextareaClass}
              />
            </AdminField>

            {formError && (
              <div className="rounded border border-[#d86b5f]/25 bg-[#d86b5f]/[0.08] px-4 py-3 font-body text-xs text-[#ff9b8f]">
                {formError}
              </div>
            )}

            <div className="flex flex-col gap-3 min-[420px]:flex-row">
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="flex-1 rounded bg-gold px-5 py-3.5 font-heading text-[11px] font-bold uppercase tracking-[2.5px] text-black transition-colors hover:bg-gold/90 disabled:cursor-wait disabled:opacity-60"
              >
                {saveMutation.isPending
                  ? 'Saving...'
                  : editingId
                    ? 'Save Changes'
                    : 'Add Sponsor'}
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

function formatShortDate(date: string) {
  return new Date(date).toLocaleDateString('en-AU', {
    day: '2-digit',
    month: 'short',
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

interface StatusBadgeProps {
  active: boolean
}

function StatusBadge({ active }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded border px-2.5 py-1.5 font-heading text-[9px] font-bold uppercase tracking-[2px] ${
        active ? sponsorStatusClass.active : sponsorStatusClass.inactive
      }`}
    >
      {active ? 'Active' : 'Inactive'}
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
      <div className="truncate px-1 font-display text-base leading-none text-white">
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

interface SponsorLogoProps {
  sponsor: AdminSponsor
  large?: boolean
}

function SponsorLogo({ sponsor, large = false }: SponsorLogoProps) {
  const sizeClass = large ? 'h-14 w-14' : 'h-12 w-12'

  if (sponsor.logoUrl) {
    return (
      <div
        className={`${sizeClass} flex shrink-0 items-center justify-center rounded border border-white/[0.12] bg-white p-2`}
      >
        <img
          src={sponsor.logoUrl}
          alt={sponsor.name}
          className="max-h-full max-w-full object-contain"
        />
      </div>
    )
  }

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded border border-gold/25 bg-gold/[0.08] font-heading text-[10px] font-bold uppercase tracking-[1.5px] text-gold`}
    >
      {sponsor.name.slice(0, 2)}
    </div>
  )
}

interface ToggleCardProps {
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function ToggleCard({
  title,
  description,
  checked,
  onChange,
}: ToggleCardProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded border border-white/[0.12] bg-white/[0.035] px-4 py-3">
      <span>
        <span className="block font-heading text-[11px] font-bold uppercase tracking-[2px] text-white">
          {title}
        </span>

        <span className="mt-1 block font-body text-[11px] font-light leading-[1.4] text-muted">
          {description}
        </span>
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={event => onChange(event.target.checked)}
        className="h-4 w-4 shrink-0 accent-gold"
      />
    </label>
  )
}

export default ManageSponsors
