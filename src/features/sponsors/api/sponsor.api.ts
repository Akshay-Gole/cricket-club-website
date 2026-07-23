import api from '../../../services/api'
import type {
  AdminSponsor,
  SponsorFormState,
} from '../../admin/constants/adminSponsor.constants'

export interface PublicSponsor {
  id: string
  name: string
  industry: string
  website: string
  logoUrl: string
  featured: boolean
}

export const ADMIN_SPONSORS_QUERY_KEY = ['admin', 'sponsors'] as const
export const PUBLIC_SPONSORS_QUERY_KEY = ['sponsors'] as const

function sponsorPayload(form: SponsorFormState) {
  return {
    name: form.name.trim(),
    industry: form.industry.trim(),
    website: form.website.trim(),
    contactName: form.contactName.trim(),
    contactEmail: form.contactEmail.trim(),
    phone: form.phone.trim(),
    logoUrl: form.logoUrl.trim(),
    logoPublicId: form.logoPublicId.trim(),
    active: form.active,
    featured: form.featured,
    notes: form.notes.trim(),
  }
}

export async function getPublicSponsors() {
  const response = await api.get<{ data: PublicSponsor[] }>('/sponsors')
  return response.data.data
}

export async function getAdminSponsors() {
  const response = await api.get<{ data: AdminSponsor[] }>('/admin/sponsors')
  return response.data.data
}

export async function uploadSponsorLogo(file: File) {
  const response = await api.post<{
    data: { logoUrl: string; logoPublicId: string }
  }>('/admin/sponsors/logo', file, {
    headers: { 'Content-Type': file.type },
  })
  return response.data.data
}

export async function createSponsor(form: SponsorFormState) {
  const response = await api.post<{ data: AdminSponsor }>(
    '/admin/sponsors',
    sponsorPayload(form)
  )
  return response.data.data
}

export async function updateSponsor(id: string, form: SponsorFormState) {
  const response = await api.patch<{ data: AdminSponsor }>(
    `/admin/sponsors/${id}`,
    sponsorPayload(form)
  )
  return response.data.data
}

export async function deleteSponsor(id: string) {
  await api.delete(`/admin/sponsors/${id}`)
}
