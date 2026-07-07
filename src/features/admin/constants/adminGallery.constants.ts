export type AdminGallerySource = 'admin' | 'instagram'
export type AdminGalleryStatus = 'published' | 'draft'
export type AdminGalleryTone = 'green' | 'gold' | 'blue' | 'red'
export type GalleryFilter =
  | 'all'
  | AdminGallerySource
  | AdminGalleryStatus
  | 'featured'

export interface AdminGalleryItem {
  id: string
  year: string
  title: string
  date: string
  description: string
  source: AdminGallerySource
  coverTone: AdminGalleryTone
  instagramUrl: string
  imageCount: number
  status: AdminGalleryStatus
  featured: boolean
}

export interface GalleryFormState {
  year: string
  title: string
  date: string
  description: string
  source: AdminGallerySource
  coverTone: AdminGalleryTone
  instagramUrl: string
  status: AdminGalleryStatus
  featured: boolean
  imageFiles: File[]
  imagePreviewUrls: string[]
}

export const EMPTY_GALLERY_FORM: GalleryFormState = {
  year: '2026',
  title: '',
  date: '',
  description: '',
  source: 'admin',
  coverTone: 'green',
  instagramUrl: '',
  status: 'published',
  featured: false,
  imageFiles: [],
  imagePreviewUrls: [],
}

export const GALLERY_FILTERS: { value: GalleryFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'admin', label: 'Bundles' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Drafts' },
  { value: 'featured', label: 'Featured' },
]

export const GALLERY_TONES: { value: AdminGalleryTone; label: string }[] = [
  { value: 'green', label: 'Green' },
  { value: 'gold', label: 'Gold' },
  { value: 'blue', label: 'Blue' },
  { value: 'red', label: 'Red' },
]

export const adminGalleryInputClass =
  'h-11 w-full rounded border border-white/[0.12] bg-white/[0.045] px-4 font-heading text-sm font-semibold tracking-[0.5px] text-white outline-none placeholder:text-muted focus:border-gold/40'

export const adminGalleryTextareaClass =
  'min-h-[110px] w-full resize-y rounded border border-white/[0.12] bg-white/[0.045] px-4 py-3 font-body text-sm font-light leading-[1.7] text-white outline-none placeholder:text-muted focus:border-gold/40'

export const galleryBadgeClass = {
  admin: 'border-gold/25 bg-gold/[0.08] text-gold',
  instagram: 'border-[#d66cff]/25 bg-[#d66cff]/[0.08] text-[#f0a6ff]',
  published: 'border-green-light/25 bg-green-light/[0.08] text-green-light',
  draft: 'border-white/[0.14] bg-white/[0.05] text-muted',
}

export const MOCK_ADMIN_GALLERY_ITEMS: AdminGalleryItem[] = [
  {
    id: 'gallery-1',
    year: '2026',
    title: 'Season Opener vs Norwood',
    date: '2026-05-22',
    description: 'Admin uploaded match-day bundle from the first senior game.',
    source: 'admin',
    coverTone: 'green',
    instagramUrl: '',
    imageCount: 6,
    status: 'published',
    featured: true,
  },
  {
    id: 'gallery-2',
    year: '2026',
    title: 'Thursday Training Night',
    date: '2026-06-06',
    description: 'Instagram post from nets, drills and pre-game preparation.',
    source: 'instagram',
    coverTone: 'gold',
    instagramUrl: 'https://www.instagram.com/',
    imageCount: 0,
    status: 'published',
    featured: false,
  },
  {
    id: 'gallery-3',
    year: '2026',
    title: 'Presentation Night',
    date: '2026-06-14',
    description: 'Club uploaded awards night, speeches and celebrations.',
    source: 'admin',
    coverTone: 'blue',
    instagramUrl: '',
    imageCount: 4,
    status: 'draft',
    featured: false,
  },
  {
    id: 'gallery-4',
    year: '2025',
    title: 'Junior Cricket Clinic',
    date: '2025-11-03',
    description: 'Photos from junior skills day and community coaching.',
    source: 'admin',
    coverTone: 'red',
    instagramUrl: '',
    imageCount: 5,
    status: 'published',
    featured: false,
  },
]
