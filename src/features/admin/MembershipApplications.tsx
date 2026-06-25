import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  applicationStatusClass,
  applicationStatusLabel,
  applicationTypeClass,
  applicationTypeLabel,
  APPLICATION_FILTERS,
  MOCK_APPLICATIONS,
  type AdminApplication,
  type ApplicationFilter,
  type ApplicationStatus,
} from './constants/adminApplication.constants'

function MembershipApplications() {
  const [applications, setApplications] =
    useState<AdminApplication[]>(MOCK_APPLICATIONS)
  const [activeFilter, setActiveFilter] = useState<ApplicationFilter>('all')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(
    MOCK_APPLICATIONS[0]?.id ?? null
  )

  const filteredApplications = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    return applications.filter(application => {
      const applicationText = [
        application.name,
        application.email,
        application.type,
        application.status,
        application.preferredRole,
        application.experience,
      ]
        .join(' ')
        .toLowerCase()

      const matchesSearch = applicationText.includes(searchValue)

      const matchesFilter =
        activeFilter === 'all' ||
        application.type === activeFilter ||
        application.status === activeFilter

      return matchesSearch && matchesFilter
    })
  }, [applications, search, activeFilter])

  const selectedApplication = useMemo(() => {
    return (
      applications.find(application => application.id === selectedId) ??
      filteredApplications[0] ??
      null
    )
  }, [applications, selectedId, filteredApplications])

  const stats = useMemo(() => {
    return {
      total: applications.length,
      new: applications.filter(application => application.status === 'new')
        .length,
      approved: applications.filter(
        application => application.status === 'approved'
      ).length,
      reviewing: applications.filter(
        application => application.status === 'reviewing'
      ).length,
    }
  }, [applications])

  const updateStatus = (applicationId: string, status: ApplicationStatus) => {
    setApplications(current =>
      current.map(application =>
        application.id === applicationId
          ? { ...application, status }
          : application
      )
    )
  }

  const handleDelete = (applicationId: string) => {
    setApplications(current =>
      current.filter(application => application.id !== applicationId)
    )

    if (selectedId === applicationId) {
      const nextApplication = applications.find(
        application => application.id !== applicationId
      )
      setSelectedId(nextApplication?.id ?? null)
    }
  }

  const handleEmail = (application: AdminApplication) => {
    const subject = encodeURIComponent(`Top G's CC Membership Application`)
    const body = encodeURIComponent(
      `Hi ${application.name},\n\nThanks for your membership application to Top G's CC.\n\n`
    )

    window.location.href = `mailto:${application.email}?subject=${subject}&body=${body}`

    updateStatus(application.id, 'contacted')
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
              Membership
            </div>

            <h2 className="font-display text-[38px] leading-none tracking-[1px] text-white sm:text-[48px]">
              Applications.
            </h2>

            <p className="mt-4 max-w-[620px] font-body text-sm font-light leading-[1.8] text-muted">
              Review new player, social, junior and volunteer applications. This
              queue uses mock data until backend storage is ready.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 min-[520px]:grid-cols-4 min-[901px]:w-[520px]">
            <StatCard label="Total" value={stats.total} />
            <StatCard label="New" value={stats.new} />
            <StatCard label="Reviewing" value={stats.reviewing} />
            <StatCard label="Approved" value={stats.approved} />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 sm:gap-6 min-[1180px]:grid-cols-[minmax(0,1fr)_430px]">
        <section className="overflow-hidden rounded border border-white/[0.12] bg-[#182119]">
          <div className="border-b border-white/[0.10] p-5 sm:p-6">
            <div className="flex flex-col gap-4 min-[901px]:flex-row min-[901px]:items-center min-[901px]:justify-between">
              <div>
                <p className="font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
                  Application Queue
                </p>

                <h3 className="mt-1 font-display text-2xl tracking-[1px] text-white">
                  {filteredApplications.length} Applications
                </h3>
              </div>

              <div className="flex flex-col gap-3 min-[641px]:flex-row">
                <input
                  type="search"
                  value={search}
                  placeholder="Search name, role..."
                  onChange={event => setSearch(event.target.value)}
                  className="h-11 rounded border border-white/[0.12] bg-white/[0.045] px-4 font-heading text-sm font-semibold tracking-[0.5px] text-white outline-none placeholder:text-muted focus:border-gold/40 min-[641px]:w-[280px]"
                />

                <div className="flex overflow-x-auto rounded border border-white/[0.12] bg-white/[0.035] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {APPLICATION_FILTERS.map(filter => {
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

          <div className="divide-y divide-white/[0.10]">
            {filteredApplications.map(application => {
              const isSelected = selectedApplication?.id === application.id

              return (
                <button
                  key={application.id}
                  type="button"
                  onClick={() => setSelectedId(application.id)}
                  className={`block w-full p-5 text-left transition-colors hover:bg-white/[0.055] ${
                    isSelected ? 'bg-gold/[0.09]' : ''
                  }`}
                >
                  <div className="flex flex-col gap-4 min-[641px]:flex-row min-[641px]:items-start min-[641px]:justify-between">
                    <div className="min-w-0">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <TypeBadge type={application.type} />
                        <StatusBadge status={application.status} />
                      </div>

                      <h4 className="line-clamp-1 font-heading text-base font-bold text-white">
                        {application.name}
                      </h4>

                      <p className="mt-2 font-heading text-xs font-bold text-muted">
                        {application.email} · {application.phone}
                      </p>

                      <p className="mt-2 line-clamp-2 font-body text-sm font-light leading-[1.7] text-muted">
                        {application.preferredRole} — {application.experience}
                      </p>
                    </div>

                    <div className="shrink-0 font-heading text-[10px] font-bold uppercase tracking-[2px] text-muted">
                      {formatDate(application.submittedAt)}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {filteredApplications.length === 0 && (
            <div className="p-10 text-center">
              <p className="font-display text-2xl tracking-[1px] text-white">
                No applications found.
              </p>

              <p className="mt-2 font-body text-sm font-light text-muted">
                Try changing the search or filter.
              </p>
            </div>
          )}
        </section>

        <aside className="rounded border border-white/[0.12] bg-[#182119] p-5 sm:p-6">
          {selectedApplication ? (
            <ApplicationDetails
              application={selectedApplication}
              onEmail={() => handleEmail(selectedApplication)}
              onReview={() => updateStatus(selectedApplication.id, 'reviewing')}
              onContacted={() =>
                updateStatus(selectedApplication.id, 'contacted')
              }
              onApprove={() => updateStatus(selectedApplication.id, 'approved')}
              onReject={() => updateStatus(selectedApplication.id, 'rejected')}
              onArchive={() => updateStatus(selectedApplication.id, 'archived')}
              onDelete={() => handleDelete(selectedApplication.id)}
            />
          ) : (
            <div className="py-12 text-center">
              <p className="font-display text-2xl tracking-[1px] text-white">
                Select an application.
              </p>

              <p className="mt-2 font-body text-sm font-light text-muted">
                Application details will appear here.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

interface ApplicationDetailsProps {
  application: AdminApplication
  onEmail: () => void
  onReview: () => void
  onContacted: () => void
  onApprove: () => void
  onReject: () => void
  onArchive: () => void
  onDelete: () => void
}

function ApplicationDetails({
  application,
  onEmail,
  onReview,
  onContacted,
  onApprove,
  onReject,
  onArchive,
  onDelete,
}: ApplicationDetailsProps) {
  return (
    <div>
      <div className="mb-6">
        <p className="font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
          Application Details
        </p>

        <h3 className="mt-1 font-display text-2xl tracking-[1px] text-white">
          {application.name}
        </h3>

        <div className="mt-3 flex flex-wrap gap-2">
          <TypeBadge type={application.type} />
          <StatusBadge status={application.status} />
        </div>
      </div>

      <div className="space-y-4">
        <InfoBlock label="Email" value={application.email} />
        <InfoBlock label="Phone" value={application.phone} />
        <InfoBlock label="Age" value={application.age || 'Not provided'} />
        <InfoBlock
          label="Submitted"
          value={formatLongDate(application.submittedAt)}
        />
      </div>

      <div className="mt-5 rounded border border-white/[0.12] bg-white/[0.035] p-4">
        <p className="mb-3 font-heading text-[10px] font-bold uppercase tracking-[2.5px] text-gold">
          Cricket / Club Details
        </p>

        <div className="space-y-4">
          <InfoBlock label="Preferred Role" value={application.preferredRole} />
          <InfoBlock label="Experience" value={application.experience} />
          <InfoBlock label="Availability" value={application.availability} />
        </div>
      </div>

      <div className="mt-5 rounded border border-white/[0.12] bg-white/[0.035] p-4">
        <p className="mb-2 font-heading text-[10px] font-bold uppercase tracking-[2.5px] text-muted">
          Message
        </p>

        <p className="whitespace-pre-line font-body text-sm font-light leading-[1.8] text-white">
          {application.message}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
        <button
          type="button"
          onClick={onEmail}
          className="rounded bg-gold px-5 py-3.5 font-heading text-[11px] font-bold uppercase tracking-[2.5px] text-black transition-colors hover:bg-gold/90"
        >
          Email
        </button>

        <button
          type="button"
          onClick={onReview}
          className="rounded border border-[#6f8cff]/25 px-5 py-3.5 font-heading text-[11px] font-bold uppercase tracking-[2.5px] text-[#9aaeff] transition-colors hover:bg-[#6f8cff]/10"
        >
          Review
        </button>

        <button
          type="button"
          onClick={onContacted}
          className="rounded border border-white/[0.08] px-5 py-3.5 font-heading text-[11px] font-bold uppercase tracking-[2.5px] text-muted transition-colors hover:text-white"
        >
          Contacted
        </button>

        <button
          type="button"
          onClick={onApprove}
          className="rounded border border-green-light/25 px-5 py-3.5 font-heading text-[11px] font-bold uppercase tracking-[2.5px] text-green-light transition-colors hover:bg-green-light/10"
        >
          Approve
        </button>

        <button
          type="button"
          onClick={onReject}
          className="rounded border border-[#d86b5f]/25 px-5 py-3.5 font-heading text-[11px] font-bold uppercase tracking-[2.5px] text-[#ff9b8f] transition-colors hover:bg-[#d86b5f]/10"
        >
          Reject
        </button>

        <button
          type="button"
          onClick={onArchive}
          className="rounded border border-white/[0.08] px-5 py-3.5 font-heading text-[11px] font-bold uppercase tracking-[2.5px] text-muted transition-colors hover:text-white"
        >
          Archive
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="min-[420px]:col-span-2 rounded border border-[#d86b5f]/25 px-5 py-3.5 font-heading text-[11px] font-bold uppercase tracking-[2.5px] text-[#ff9b8f] transition-colors hover:bg-[#d86b5f]/10"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-AU', {
    day: '2-digit',
    month: 'short',
  })
}

function formatLongDate(date: string) {
  return new Date(date).toLocaleString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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

interface TypeBadgeProps {
  type: AdminApplication['type']
}

function TypeBadge({ type }: TypeBadgeProps) {
  return (
    <span
      className={`inline-flex rounded border px-2.5 py-1.5 font-heading text-[9px] font-bold uppercase tracking-[2px] ${applicationTypeClass[type]}`}
    >
      {applicationTypeLabel[type]}
    </span>
  )
}

interface StatusBadgeProps {
  status: ApplicationStatus
}

function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded border px-2.5 py-1.5 font-heading text-[9px] font-bold uppercase tracking-[2px] ${applicationStatusClass[status]}`}
    >
      {applicationStatusLabel[status]}
    </span>
  )
}

interface InfoBlockProps {
  label: string
  value: ReactNode
}

function InfoBlock({ label, value }: InfoBlockProps) {
  return (
    <div>
      <p className="font-heading text-[9px] font-bold uppercase tracking-[2px] text-muted">
        {label}
      </p>

      <p className="mt-1 break-words font-body text-sm font-light leading-[1.6] text-white">
        {value}
      </p>
    </div>
  )
}

export default MembershipApplications
