export type GallerySource = 'admin' | 'instagram'

export interface GalleryImage {
  id: string
  alt: string
  tone: 'green' | 'gold' | 'blue' | 'red'
}

export interface GalleryItem {
  id: string
  year: string
  title: string
  date: string
  description: string
  source: GallerySource
  coverTone: GalleryImage['tone']
  instagramUrl?: string
  images?: GalleryImage[]
}
