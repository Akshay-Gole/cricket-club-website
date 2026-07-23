import type { IntentId } from '../../contact/intents'

export type MessageStatus = 'unread' | 'read' | 'replied' | 'archived'

export type MessageFilter = 'all' | 'unread' | 'replied' | 'archived' | IntentId

export interface AdminMessage {
  id: string
  intent: IntentId
  status: MessageStatus
  name: string
  email: string
  phone: string
  subject: string
  message: string
  submittedAt: string

  // Player enquiry fields
  role?: string
  experience?: string
  trialDate?: string

  // Sponsor enquiry fields
  company?: string
  interest?: string
  website?: string
}

export const MESSAGE_FILTERS: { value: MessageFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'replied', label: 'Replied' },
  { value: 'player', label: 'Players' },
  { value: 'sponsor', label: 'Sponsors' },
  { value: 'general', label: 'General' },
  { value: 'social', label: 'Social' },
  { value: 'archived', label: 'Archived' },
]

export const intentLabel: Record<IntentId, string> = {
  player: 'Player Enquiry',
  sponsor: 'Sponsor Enquiry',
  general: 'General',
  social: 'Social',
}

export const intentBadgeClass: Record<IntentId, string> = {
  player: 'border-green-light/25 bg-green-light/[0.08] text-green-light',
  sponsor: 'border-gold/25 bg-gold/[0.08] text-gold',
  general: 'border-[#6f8cff]/25 bg-[#6f8cff]/[0.08] text-[#9aaeff]',
  social: 'border-white/[0.12] bg-white/[0.05] text-muted',
}

export const statusLabel: Record<MessageStatus, string> = {
  unread: 'Unread',
  read: 'Read',
  replied: 'Replied',
  archived: 'Archived',
}

export const statusBadgeClass: Record<MessageStatus, string> = {
  unread: 'border-gold/25 bg-gold/[0.08] text-gold',
  read: 'border-white/[0.12] bg-white/[0.05] text-muted',
  replied: 'border-green-light/25 bg-green-light/[0.08] text-green-light',
  archived: 'border-[#d86b5f]/25 bg-[#d86b5f]/[0.08] text-[#ff9b8f]',
}
