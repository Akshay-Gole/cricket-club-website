import { useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  intentBadgeClass,
  intentLabel,
  MESSAGE_FILTERS,
  MOCK_MESSAGES,
  statusBadgeClass,
  statusLabel,
  type AdminMessage,
  type MessageFilter,
  type MessageStatus,
} from './constants/adminMessage.constants'

function ContactSubmissions() {
  const [messages, setMessages] = useState<AdminMessage[]>(MOCK_MESSAGES)
  const [activeFilter, setActiveFilter] = useState<MessageFilter>('all')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(
    MOCK_MESSAGES[0]?.id ?? null
  )

  const detailPanelRef = useRef<HTMLElement | null>(null)

  const filteredMessages = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    return messages.filter(message => {
      const messageText = [
        message.name,
        message.email,
        message.subject,
        message.message,
        message.intent,
        message.status,
      ]
        .join(' ')
        .toLowerCase()

      const matchesSearch = messageText.includes(searchValue)

      const matchesFilter =
        activeFilter === 'all' ||
        message.status === activeFilter ||
        message.intent === activeFilter

      return matchesSearch && matchesFilter
    })
  }, [messages, search, activeFilter])

  const selectedMessage = useMemo(() => {
    return (
      messages.find(message => message.id === selectedId) ??
      filteredMessages[0] ??
      null
    )
  }, [messages, selectedId, filteredMessages])

  const stats = useMemo(() => {
    return {
      total: messages.length,
      unread: messages.filter(message => message.status === 'unread').length,
      replied: messages.filter(message => message.status === 'replied').length,
      archived: messages.filter(message => message.status === 'archived')
        .length,
    }
  }, [messages])

  const updateStatus = (messageId: string, status: MessageStatus) => {
    setMessages(current =>
      current.map(message =>
        message.id === messageId ? { ...message, status } : message
      )
    )
  }

  const handleSelect = (message: AdminMessage) => {
    setSelectedId(message.id)

    if (message.status === 'unread') {
      updateStatus(message.id, 'read')
    }

    const isBelowDesktopSplit = window.matchMedia('(max-width: 1179px)').matches

    if (isBelowDesktopSplit) {
      window.setTimeout(() => {
        detailPanelRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 80)
    }
  }

  const handleDelete = (messageId: string) => {
    setMessages(current => current.filter(message => message.id !== messageId))

    if (selectedId === messageId) {
      const nextMessage = messages.find(message => message.id !== messageId)
      setSelectedId(nextMessage?.id ?? null)
    }
  }

  const handleReply = (message: AdminMessage) => {
    const subject = encodeURIComponent(`Re: ${message.subject}`)
    const body = encodeURIComponent(
      `Hi ${message.name},\n\nThanks for contacting Top G's CC.\n\n`
    )

    window.location.href = `mailto:${message.email}?subject=${subject}&body=${body}`

    updateStatus(message.id, 'replied')
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="relative overflow-hidden rounded border border-white/[0.1] bg-[#181818] px-5 py-7 shadow-[0_20px_70px_rgba(0,0,0,0.24)] sm:px-7 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(111,140,255,0.12),transparent_34%)]"
        />

        <div className="relative flex flex-col gap-5 min-[901px]:flex-row min-[901px]:items-end min-[901px]:justify-between">
          <div>
            <div className="mb-3 font-heading text-[10px] font-bold uppercase tracking-[4px] text-gold">
              Club Inbox
            </div>

            <h2 className="font-display text-[38px] leading-none tracking-[1px] text-white sm:text-[48px]">
              Contact Messages.
            </h2>

            <p className="mt-4 max-w-[620px] font-body text-sm font-light leading-[1.8] text-muted">
              Review contact form submissions from players, sponsors, supporters
              and general enquiries. This is mock data until backend is ready.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 min-[520px]:grid-cols-4 min-[901px]:w-[520px]">
            <StatCard label="Messages" value={stats.total} />
            <StatCard label="Unread" value={stats.unread} />
            <StatCard label="Replied" value={stats.replied} />
            <StatCard label="Archived" value={stats.archived} />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 sm:gap-6 min-[1180px]:grid-cols-[minmax(0,1fr)_430px]">
        <section className="overflow-hidden rounded border border-white/[0.1] bg-[#161616]">
          <div className="border-b border-white/[0.10] p-5 sm:p-6">
            <div className="flex flex-col gap-4 min-[901px]:flex-row min-[901px]:items-center min-[901px]:justify-between">
              <div>
                <p className="font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
                  Inbox
                </p>

                <h3 className="mt-1 font-display text-2xl tracking-[1px] text-white">
                  {filteredMessages.length} Messages
                </h3>
              </div>

              <div className="flex flex-col gap-3 min-[641px]:flex-row">
                <input
                  type="search"
                  value={search}
                  placeholder="Search name, subject..."
                  onChange={event => setSearch(event.target.value)}
                  className="h-11 rounded border border-white/[0.12] bg-white/[0.045] px-4 font-heading text-sm font-semibold tracking-[0.5px] text-white outline-none placeholder:text-muted focus:border-gold/40 min-[641px]:w-[280px]"
                />

                <div className="flex overflow-x-auto rounded border border-white/[0.12] bg-white/[0.035] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {MESSAGE_FILTERS.map(filter => {
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
            {filteredMessages.map(message => {
              const isSelected = selectedMessage?.id === message.id

              return (
                <button
                  key={message.id}
                  type="button"
                  onClick={() => handleSelect(message)}
                  className={`block w-full p-5 text-left transition-colors hover:bg-white/[0.055] ${
                    isSelected ? 'bg-gold/[0.09]' : ''
                  }`}
                >
                  <div className="flex flex-col gap-4 min-[641px]:flex-row min-[641px]:items-start min-[641px]:justify-between">
                    <div className="min-w-0">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <IntentBadge intent={message.intent} />
                        <StatusBadge status={message.status} />
                      </div>

                      <div className="flex items-center gap-2">
                        {message.status === 'unread' && (
                          <span className="h-2 w-2 rounded-full bg-gold" />
                        )}

                        <h4 className="line-clamp-1 font-heading text-base font-bold text-white">
                          {message.subject}
                        </h4>
                      </div>

                      <p className="mt-2 font-heading text-xs font-bold text-muted">
                        {message.name} · {message.email}
                      </p>

                      <p className="mt-2 line-clamp-2 font-body text-sm font-light leading-[1.7] text-muted">
                        {message.message}
                      </p>
                    </div>

                    <div className="shrink-0 font-heading text-[10px] font-bold uppercase tracking-[2px] text-muted">
                      {formatDate(message.submittedAt)}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {filteredMessages.length === 0 && (
            <div className="p-10 text-center">
              <p className="font-display text-2xl tracking-[1px] text-white">
                No messages found.
              </p>

              <p className="mt-2 font-body text-sm font-light text-muted">
                Try changing the search or filter.
              </p>
            </div>
          )}
        </section>

        <aside
          ref={detailPanelRef}
          className="scroll-mt-24 rounded border border-white/[0.1] bg-[#161616] p-5 shadow-[0_14px_44px_rgba(0,0,0,0.22)] sm:p-6"
        >
          {selectedMessage ? (
            <MessageDetails
              message={selectedMessage}
              onReply={() => handleReply(selectedMessage)}
              onMarkUnread={() => updateStatus(selectedMessage.id, 'unread')}
              onMarkRead={() => updateStatus(selectedMessage.id, 'read')}
              onArchive={() => updateStatus(selectedMessage.id, 'archived')}
              onDelete={() => handleDelete(selectedMessage.id)}
            />
          ) : (
            <div className="py-12 text-center">
              <p className="font-display text-2xl tracking-[1px] text-white">
                Select a message.
              </p>

              <p className="mt-2 font-body text-sm font-light text-muted">
                Message details will appear here.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

interface MessageDetailsProps {
  message: AdminMessage
  onReply: () => void
  onMarkUnread: () => void
  onMarkRead: () => void
  onArchive: () => void
  onDelete: () => void
}

function MessageDetails({
  message,
  onReply,
  onMarkUnread,
  onMarkRead,
  onArchive,
  onDelete,
}: MessageDetailsProps) {
  return (
    <div>
      <div className="mb-6">
        <p className="font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
          Message Details
        </p>

        <h3 className="mt-1 font-display text-2xl tracking-[1px] text-white">
          {message.name}
        </h3>

        <div className="mt-3 flex flex-wrap gap-2">
          <IntentBadge intent={message.intent} />
          <StatusBadge status={message.status} />
        </div>
      </div>

      <div className="space-y-4">
        <InfoBlock label="Subject" value={message.subject} />
        <InfoBlock label="Email" value={message.email} />
        <InfoBlock label="Phone" value={message.phone || 'Not provided'} />
        <InfoBlock
          label="Submitted"
          value={formatLongDate(message.submittedAt)}
        />
      </div>

      {(message.role ||
        message.experience ||
        message.trialDate ||
        message.company ||
        message.interest ||
        message.website) && (
        <div className="mt-5 rounded border border-white/[0.12] bg-white/[0.035] p-4">
          <p className="mb-3 font-heading text-[10px] font-bold uppercase tracking-[2.5px] text-gold">
            Extra Details
          </p>

          <div className="space-y-3">
            {message.role && <InfoBlock label="Role" value={message.role} />}
            {message.experience && (
              <InfoBlock label="Experience" value={message.experience} />
            )}
            {message.trialDate && (
              <InfoBlock label="Trial Date" value={message.trialDate} />
            )}
            {message.company && (
              <InfoBlock label="Company" value={message.company} />
            )}
            {message.interest && (
              <InfoBlock label="Interest" value={message.interest} />
            )}
            {message.website && (
              <InfoBlock label="Website" value={message.website} />
            )}
          </div>
        </div>
      )}

      <div className="mt-5 rounded border border-white/[0.12] bg-white/[0.035] p-4">
        <p className="mb-2 font-heading text-[10px] font-bold uppercase tracking-[2.5px] text-muted">
          Message
        </p>

        <p className="whitespace-pre-line font-body text-sm font-light leading-[1.8] text-white">
          {message.message}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
        <button
          type="button"
          onClick={onReply}
          className="rounded bg-gold px-5 py-3.5 font-heading text-[11px] font-bold uppercase tracking-[2.5px] text-black transition-colors hover:bg-gold/90"
        >
          Reply
        </button>

        {message.status === 'unread' ? (
          <button
            type="button"
            onClick={onMarkRead}
            className="rounded border border-white/[0.08] px-5 py-3.5 font-heading text-[11px] font-bold uppercase tracking-[2.5px] text-muted transition-colors hover:text-white"
          >
            Mark Read
          </button>
        ) : (
          <button
            type="button"
            onClick={onMarkUnread}
            className="rounded border border-white/[0.08] px-5 py-3.5 font-heading text-[11px] font-bold uppercase tracking-[2.5px] text-muted transition-colors hover:text-white"
          >
            Mark Unread
          </button>
        )}

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
          className="rounded border border-[#d86b5f]/25 px-5 py-3.5 font-heading text-[11px] font-bold uppercase tracking-[2.5px] text-[#ff9b8f] transition-colors hover:bg-[#d86b5f]/10"
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

interface IntentBadgeProps {
  intent: AdminMessage['intent']
}

function IntentBadge({ intent }: IntentBadgeProps) {
  return (
    <span
      className={`inline-flex rounded border px-2.5 py-1.5 font-heading text-[9px] font-bold uppercase tracking-[2px] ${intentBadgeClass[intent]}`}
    >
      {intentLabel[intent]}
    </span>
  )
}

interface StatusBadgeProps {
  status: MessageStatus
}

function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded border px-2.5 py-1.5 font-heading text-[9px] font-bold uppercase tracking-[2px] ${statusBadgeClass[status]}`}
    >
      {statusLabel[status]}
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

export default ContactSubmissions
