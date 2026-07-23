import { useState } from 'react'
import type { FormEvent } from 'react'
import { INTENTS, type IntentId } from '../intents'
import { contactSchema, type ContactFormData } from '../schema/contact.schema'
import {
  EMPTY_FORM,
  type ErrorField,
  type FormErrors,
} from '../constants/contactForm.constants'
import logger from '../../../services/logger'
import ContactFormFields from './ContactFormFields'
import ContactSuccess from './ContactSuccess'
import PlayerFields from './PlayerFields'
import SponsorFields from './SponsorFields'
import { submitContact } from '../api/contact.api'

interface ContactFormProps {
  intent: IntentId | null
}

function ContactForm({ intent }: ContactFormProps) {
  const [form, setForm] = useState<ContactFormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const intentMeta = INTENTS.find(item => item.id === intent)

  const update = (field: keyof ContactFormData, value: string) => {
    setForm(previous => ({
      ...previous,
      [field]: value,
    }))

    setErrors(previous => {
      if (!(field in previous)) return previous

      const next = { ...previous }
      delete next[field as ErrorField]
      return next
    })
  }

  const validate = () => {
    const result = contactSchema.safeParse(form)

    if (result.success) {
      setErrors({})
      return true
    }

    const fieldErrors = result.error.flatten().fieldErrors
    const next: FormErrors = {}

    if (fieldErrors.name) next.name = fieldErrors.name[0]
    if (fieldErrors.email) next.email = fieldErrors.email[0]
    if (fieldErrors.subject) next.subject = fieldErrors.subject[0]
    if (fieldErrors.message) next.message = fieldErrors.message[0]
    if (fieldErrors.website) next.website = fieldErrors.website[0]

    setErrors(next)
    return false
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validate()) {
      logger.action('Contact form validation failed')
      return
    }

    if (!intent) return

    setIsSubmitting(true)
    setSubmitError('')

    try {
      await submitContact(intent, form)
      logger.action('Contact form submitted', {
        intent,
        name: form.name,
        subject: form.subject,
      })
      setSubmitted(true)
    } catch (error) {
      logger.error('Contact form submission failed', error)
      setSubmitError('Could not send your message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setForm(EMPTY_FORM)
    setErrors({})
    setSubmitError('')
    setSubmitted(false)
  }

  if (submitted) {
    return <ContactSuccess name={form.name} onReset={handleReset} />
  }

  return (
    <section
      id="contact-form"
      className="scroll-mt-20 px-5 py-8 pb-14 sm:px-7 sm:py-10 sm:pb-16 lg:px-12 lg:py-12 lg:pb-20"
    >
      <form
        data-animate="reveal"
        onSubmit={handleSubmit}
        noValidate
        className="w-full overflow-hidden rounded border-[0.5px] border-white/[0.1] bg-[#0d0f0e] shadow-[0_18px_52px_rgba(0,0,0,0.38)]"
      >
        <div className="flex flex-col items-start gap-2.5 border-b-[0.5px] border-white/[0.1] bg-[radial-gradient(circle_at_8%_0%,rgba(201,168,76,0.11),transparent_35%),linear-gradient(135deg,#15130d_0%,#101210_62%,#0b0d0c_100%)] px-[22px] py-5 min-[641px]:flex-row min-[641px]:items-center min-[641px]:justify-between min-[641px]:px-8 min-[641px]:py-6">
          <h2 className="font-display text-[26px] tracking-[1px] text-[#efe9dc] min-[641px]:text-[32px]">
            Send a Message
          </h2>

          {intentMeta && (
            <div className="rounded-sm border-[0.5px] border-gold/20 bg-gold/10 px-3 py-[5px] font-heading text-[10px] font-bold uppercase tracking-[2px] text-gold">
              {intentMeta.emoji} {intentMeta.name}
            </div>
          )}
        </div>

        <div className="p-[22px] min-[641px]:p-7 min-[1025px]:p-8">
          <ContactFormFields form={form} errors={errors} update={update}>
            {intent === 'player' && (
              <PlayerFields form={form} update={update} />
            )}

            {intent === 'sponsor' && (
              <SponsorFields form={form} errors={errors} update={update} />
            )}
          </ContactFormFields>

          <input
            type="text"
            name="nickname"
            value={form.nickname ?? ''}
            onChange={event => update('nickname', event.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px]"
          />

          {submitError && (
            <p role="alert" className="mt-4 font-body text-sm text-[#ff9b8f]">
              {submitError}
            </p>
          )}

          <div className="mt-6 flex flex-col items-stretch gap-4 min-[641px]:flex-row min-[641px]:items-center min-[641px]:justify-between">
            <p className="max-w-none font-body text-xs font-light leading-[1.5] text-muted min-[641px]:max-w-[220px]">
              We'll reply within 48 hours. No spam, ever.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex cursor-pointer justify-center rounded-sm bg-gold px-6 py-3.5 font-heading text-xs font-bold uppercase tracking-[3px] text-black transition-colors hover:bg-gold-light disabled:cursor-wait disabled:opacity-60 min-[641px]:px-9 min-[641px]:py-[15px]"
            >
              {isSubmitting ? 'Sending…' : 'Send Message →'}
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}

export default ContactForm
