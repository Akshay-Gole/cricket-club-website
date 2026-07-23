import api from '../../../services/api'
import type {
  AdminMessage,
  MessageStatus,
} from '../../admin/constants/adminMessage.constants'
import type { ContactFormData } from '../schema/contact.schema'
import type { IntentId } from '../intents'

export const CONTACT_SUBMISSIONS_QUERY_KEY = [
  'admin',
  'contact-submissions',
] as const

export async function submitContact(intent: IntentId, form: ContactFormData) {
  await api.post('/contact', { intent, ...form })
}

export async function getContactSubmissions() {
  const response = await api.get<{ data: AdminMessage[] }>(
    '/admin/contact-submissions'
  )
  return response.data.data
}

export async function updateContactSubmissionStatus(
  id: string,
  status: MessageStatus
) {
  const response = await api.patch<{ data: AdminMessage }>(
    `/admin/contact-submissions/${id}/status`,
    { status }
  )
  return response.data.data
}

export async function deleteContactSubmission(id: string) {
  await api.delete(`/admin/contact-submissions/${id}`)
}
