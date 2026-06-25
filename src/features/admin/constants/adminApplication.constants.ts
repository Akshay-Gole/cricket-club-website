export type ApplicationType = 'player' | 'social' | 'volunteer' | 'junior'

export type ApplicationStatus =
  | 'new'
  | 'reviewing'
  | 'contacted'
  | 'approved'
  | 'rejected'
  | 'archived'

export type ApplicationFilter = 'all' | ApplicationType | ApplicationStatus

export interface AdminApplication {
  id: string
  type: ApplicationType
  status: ApplicationStatus
  name: string
  email: string
  phone: string
  age: string
  preferredRole: string
  experience: string
  availability: string
  message: string
  submittedAt: string
}

export const APPLICATION_FILTERS: {
  value: ApplicationFilter
  label: string
}[] = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'player', label: 'Players' },
  { value: 'social', label: 'Social' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'junior', label: 'Junior' },
]

export const applicationTypeLabel: Record<ApplicationType, string> = {
  player: 'Player',
  social: 'Social Member',
  volunteer: 'Volunteer',
  junior: 'Junior',
}

export const applicationStatusLabel: Record<ApplicationStatus, string> = {
  new: 'New',
  reviewing: 'Reviewing',
  contacted: 'Contacted',
  approved: 'Approved',
  rejected: 'Rejected',
  archived: 'Archived',
}

export const applicationTypeClass: Record<ApplicationType, string> = {
  player: 'border-green-light/25 bg-green-light/[0.08] text-green-light',
  social: 'border-[#6f8cff]/25 bg-[#6f8cff]/[0.08] text-[#9aaeff]',
  volunteer: 'border-gold/25 bg-gold/[0.08] text-gold',
  junior: 'border-white/[0.12] bg-white/[0.05] text-muted',
}

export const applicationStatusClass: Record<ApplicationStatus, string> = {
  new: 'border-gold/25 bg-gold/[0.08] text-gold',
  reviewing: 'border-[#6f8cff]/25 bg-[#6f8cff]/[0.08] text-[#9aaeff]',
  contacted: 'border-white/[0.12] bg-white/[0.05] text-muted',
  approved: 'border-green-light/25 bg-green-light/[0.08] text-green-light',
  rejected: 'border-[#d86b5f]/25 bg-[#d86b5f]/[0.08] text-[#ff9b8f]',
  archived: 'border-white/[0.08] bg-white/[0.03] text-muted',
}

export const MOCK_APPLICATIONS: AdminApplication[] = [
  {
    id: 'app-1',
    type: 'player',
    status: 'new',
    name: 'Ryan Smith',
    email: 'ryan.smith@email.com',
    phone: '0400 111 222',
    age: '27',
    preferredRole: 'Top order batsman',
    experience: 'Played senior cricket for 4 seasons in Victoria.',
    availability: 'Available Saturdays and Wednesday training.',
    message:
      'I recently moved to Adelaide and would like to join a competitive but social club.',
    submittedAt: '2026-06-24T09:35:00',
  },
  {
    id: 'app-2',
    type: 'social',
    status: 'reviewing',
    name: 'Jordan Lee',
    email: 'jordan@email.com',
    phone: '0400 555 777',
    age: '31',
    preferredRole: 'Supporter',
    experience: 'No playing experience. Long-time cricket fan.',
    availability: 'Available for events and match days.',
    message:
      'I would like to join as a social member and help support the club during home games.',
    submittedAt: '2026-06-23T16:20:00',
  },
  {
    id: 'app-3',
    type: 'volunteer',
    status: 'contacted',
    name: 'Sarah Jones',
    email: 'sarah@email.com',
    phone: '0400 333 444',
    age: '29',
    preferredRole: 'Event support',
    experience: 'Helped organise community sporting events previously.',
    availability: 'Mostly weekends.',
    message:
      'I am interested in helping with club events, fundraising and match day setup.',
    submittedAt: '2026-06-22T11:05:00',
  },
  {
    id: 'app-4',
    type: 'junior',
    status: 'approved',
    name: 'Amit Patel',
    email: 'parent@email.com',
    phone: '0400 888 999',
    age: '15',
    preferredRole: 'Bowler',
    experience: 'School cricket for 3 years.',
    availability: 'Training after school and weekend matches.',
    message:
      'Application submitted by parent. Looking for junior cricket pathway.',
    submittedAt: '2026-06-19T14:40:00',
  },
]
