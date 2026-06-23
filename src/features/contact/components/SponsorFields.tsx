import type { ContactFormData } from '../schema/contact.schema'
import {
  inputClass,
  type FormErrors,
  type UpdateContactField,
} from '../constants/contactForm.constants'
import Divider from './form/Divider'
import Field from './form/Field'

interface SponsorFieldsProps {
  form: ContactFormData
  errors: FormErrors
  update: UpdateContactField
}

function SponsorFields({ form, errors, update }: SponsorFieldsProps) {
  return (
    <>
      <Divider label="Sponsorship Details" />

      <div className="mb-3.5 grid grid-cols-1 gap-3.5 min-[641px]:mb-4 min-[641px]:grid-cols-2 min-[641px]:gap-4">
        <Field id="company" label="Company / Brand">
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            value={form.company}
            placeholder="Acme Sports Co."
            onChange={event => update('company', event.target.value)}
            className={inputClass(false)}
          />
        </Field>

        <Field id="interest" label="Interest Level">
          <select
            id="interest"
            name="interest"
            value={form.interest}
            onChange={event => update('interest', event.target.value)}
            className={inputClass(false)}
          >
            <option value="" disabled>
              What interests you?
            </option>
            <option>Gold Partner — Jersey + Signage</option>
            <option>Silver Partner — Signage only</option>
            <option>Bronze Partner — Digital only</option>
            <option>Custom arrangement</option>
            <option>Just exploring for now</option>
          </select>
        </Field>
      </div>

      <div className="mb-4">
        <Field id="website" label="Website" error={errors.website}>
          <input
            id="website"
            name="website"
            type="url"
            autoComplete="url"
            value={form.website}
            placeholder="https://yourbrand.com.au"
            aria-invalid={Boolean(errors.website)}
            aria-describedby={errors.website ? 'website-error' : undefined}
            onChange={event => update('website', event.target.value)}
            className={inputClass(Boolean(errors.website))}
          />
        </Field>
      </div>
    </>
  )
}

export default SponsorFields
