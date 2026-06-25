export type SponsorFilter = 'all' | 'active' | 'inactive' | 'featured'

export interface AdminSponsor {
  id: string
  name: string
  industry: string
  website: string
  contactName: string
  contactEmail: string
  phone: string
  logoUrl: string
  active: boolean
  featured: boolean
  joinedAt: string
  notes: string
}

export interface SponsorFormState {
  name: string
  industry: string
  website: string
  contactName: string
  contactEmail: string
  phone: string
  logoFile: File | null
  logoPreviewUrl: string
  active: boolean
  featured: boolean
  notes: string
}

export const EMPTY_SPONSOR_FORM: SponsorFormState = {
  name: '',
  industry: '',
  website: '',
  contactName: '',
  contactEmail: '',
  phone: '',
  logoFile: null,
  logoPreviewUrl: '',
  active: true,
  featured: false,
  notes: '',
}

export const SPONSOR_FILTERS: { value: SponsorFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'featured', label: 'Featured' },
]

export const sponsorStatusClass = {
  active: 'border-green-light/25 bg-green-light/[0.08] text-green-light',
  inactive: 'border-[#d86b5f]/25 bg-[#d86b5f]/[0.08] text-[#ff9b8f]',
  featured: 'border-gold/25 bg-gold/[0.08] text-gold',
}

export const adminSponsorInputClass =
  'h-11 w-full rounded border border-white/[0.12] bg-white/[0.045] px-4 font-heading text-sm font-semibold tracking-[0.5px] text-white outline-none placeholder:text-muted focus:border-gold/40'

export const adminSponsorTextareaClass =
  'min-h-[110px] w-full resize-y rounded border border-white/[0.12] bg-white/[0.045] px-4 py-3 font-body text-sm font-light leading-[1.7] text-white outline-none placeholder:text-muted focus:border-gold/40'

export const MOCK_SPONSORS: AdminSponsor[] = [
  {
    id: 'sponsor-1',
    name: 'Spicy Chick',
    industry: 'Restaurant',
    website: 'https://example.com',
    contactName: 'Sam Patel',
    contactEmail: 'sam@spicychick.com',
    phone: '+61 400 111 222',
    logoUrl: '',
    active: true,
    featured: true,
    joinedAt: '2026-01-12',
    notes: 'Sponsor for season 2026.',
  },
  {
    id: 'sponsor-2',
    name: 'SA Cricket',
    industry: 'Sport',
    website: 'https://example.com',
    contactName: 'Emily Brown',
    contactEmail: 'emily@sacricket.com',
    phone: '+61 400 222 333',
    logoUrl: '',
    active: true,
    featured: true,
    joinedAt: '2026-02-04',
    notes: 'Supports club equipment and community events.',
  },
  {
    id: 'sponsor-3',
    name: 'SG Cricket',
    industry: 'Equipment',
    website: 'https://example.com',
    contactName: 'Rahul Mehta',
    contactEmail: 'rahul@sgcricket.com',
    phone: '+61 400 333 444',
    logoUrl: '',
    active: true,
    featured: false,
    joinedAt: '2026-03-18',
    notes: 'Provides match balls and training equipment.',
  },
  {
    id: 'sponsor-4',
    name: 'SS Cricket',
    industry: 'Equipment',
    website: 'https://example.com',
    contactName: 'Jordan Lee',
    contactEmail: 'jordan@sscricket.com',
    phone: '+61 400 444 555',
    logoUrl: '',
    active: false,
    featured: false,
    joinedAt: '2025-10-10',
    notes: 'Previous community partner.',
  },
]
