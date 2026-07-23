import type { ContactFormData } from '../schema/contact.schema'

export const EMPTY_FORM: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  role: '',
  experience: '',
  company: '',
  interest: '',
  website: '',
  nickname: '',
}

export type ErrorField = 'name' | 'email' | 'subject' | 'message' | 'website'

export type FormErrors = Partial<Record<ErrorField, string>>

export type UpdateContactField = (
  field: keyof ContactFormData,
  value: string
) => void

export function inputClass(hasError: boolean): string {
  return `
    w-full appearance-none rounded-sm border-[0.5px]
    bg-[#1c1f1d] px-3.5 py-[11px]
    font-heading text-[15px] font-semibold tracking-[0.5px] text-[#e7e0d1]
    outline-none transition-colors
    placeholder:font-normal placeholder:text-muted
    focus:bg-[#22251f]
    ${
      hasError
        ? 'border-[#c94c4c] bg-[#c94c4c]/[0.08] focus:border-[#c94c4c]'
        : 'border-white/[0.14] focus:border-gold/45'
    }
  `
}
