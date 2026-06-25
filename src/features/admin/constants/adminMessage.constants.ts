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

export const MOCK_MESSAGES: AdminMessage[] = [
  {
    id: 'msg-1',
    intent: 'player',
    status: 'unread',
    name: 'Ryan Smith',
    email: 'ryan.smith@email.com',
    phone: '0400 111 222',
    subject: 'Interested in joining trials',
    message:
      'Hi Top G’s CC, I recently moved to Adelaide and I am looking for a local cricket club. I mostly bat top order but can bowl medium pace. Can you please share trial details?',
    submittedAt: '2026-06-24T09:35:00',
    role: 'Batsman',
    experience: 'Played senior cricket for 4 seasons',
    trialDate: '2026-07-06',
  },
  {
    id: 'msg-2',
    intent: 'sponsor',
    status: 'unread',
    name: 'Sarah Jones',
    email: 'sarah@localcafe.com',
    phone: '0400 333 444',
    subject: 'Sponsorship opportunity',
    message:
      'We run a local cafe near the club and would like to support the team this season. Please send sponsorship details and packages.',
    submittedAt: '2026-06-23T17:10:00',
    company: 'Local Cafe Co',
    interest: 'Homepage and social media promotion',
    website: 'https://example.com',
  },
  {
    id: 'msg-3',
    intent: 'general',
    status: 'read',
    name: 'Amit Patel',
    email: 'amit@email.com',
    phone: '',
    subject: 'Junior cricket question',
    message:
      'Do you currently run junior cricket programs or only senior teams? I am asking for my younger brother.',
    submittedAt: '2026-06-22T12:25:00',
  },
  {
    id: 'msg-4',
    intent: 'social',
    status: 'replied',
    name: 'Jordan Lee',
    email: 'jordan@email.com',
    phone: '',
    subject: 'Following fixtures',
    message:
      'I am a supporter and want to know the best place to follow fixtures and updates during the season.',
    submittedAt: '2026-06-20T08:45:00',
  },
]
