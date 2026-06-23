import type { ReactNode } from 'react'
import type { ContactFormData } from '../schema/contact.schema'
import {
  inputClass,
  type FormErrors,
  type UpdateContactField,
} from '../constants/contactForm.constants'
import Field from './form/Field'

interface ContactFormFieldsProps {
  form: ContactFormData
  errors: FormErrors
  update: UpdateContactField
  children?: ReactNode
}

function ContactFormFields({
  form,
  errors,
  update,
  children,
}: ContactFormFieldsProps) {
  return (
    <>
      <div className="mb-3.5 grid grid-cols-1 gap-3.5 min-[641px]:mb-4 min-[641px]:grid-cols-2 min-[641px]:gap-4">
        <Field id="name" label="Name" required error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={form.name}
            placeholder="Akshay Gole"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            onChange={event => update('name', event.target.value)}
            className={inputClass(Boolean(errors.name))}
          />
        </Field>

        <Field id="email" label="Email" required error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            placeholder="akshay@email.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            onChange={event => update('email', event.target.value)}
            className={inputClass(Boolean(errors.email))}
          />
        </Field>
      </div>

      <div className="mb-3.5 grid grid-cols-1 gap-3.5 min-[641px]:mb-4 min-[641px]:grid-cols-2 min-[641px]:gap-4">
        <Field id="phone" label="Phone">
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            placeholder="0400 000 000"
            onChange={event => update('phone', event.target.value)}
            className={inputClass(false)}
          />
        </Field>

        <Field id="subject" label="Subject" required error={errors.subject}>
          <input
            id="subject"
            name="subject"
            type="text"
            value={form.subject}
            placeholder="e.g. Trial enquiry"
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? 'subject-error' : undefined}
            onChange={event => update('subject', event.target.value)}
            className={inputClass(Boolean(errors.subject))}
          />
        </Field>
      </div>

      {children}

      <div className="mt-4">
        <Field id="message" label="Message" required error={errors.message}>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={form.message}
            placeholder="Tell us what's on your mind..."
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-error' : undefined}
            onChange={event => update('message', event.target.value)}
            className={`${inputClass(Boolean(errors.message))} min-h-[100px] resize-y leading-[1.6]`}
          />
        </Field>
      </div>
    </>
  )
}

export default ContactFormFields
