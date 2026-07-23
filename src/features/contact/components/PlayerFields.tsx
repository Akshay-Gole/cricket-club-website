import type { ContactFormData } from '../schema/contact.schema'
import {
  inputClass,
  type UpdateContactField,
} from '../constants/contactForm.constants'
import Divider from './form/Divider'
import Field from './form/Field'

interface PlayerFieldsProps {
  form: ContactFormData
  update: UpdateContactField
}

function PlayerFields({ form, update }: PlayerFieldsProps) {
  return (
    <>
      <Divider label="Playing Details" />

      <div className="mb-3.5 grid grid-cols-1 gap-3.5 min-[641px]:mb-4 min-[641px]:grid-cols-2 min-[641px]:gap-4">
        <Field id="role" label="Playing Role">
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={event => update('role', event.target.value)}
            className={inputClass(false)}
          >
            <option value="" disabled>
              Select role...
            </option>
            <option>Batsman</option>
            <option>Bowler</option>
            <option>All-Rounder</option>
            <option>Wicket-Keeper</option>
            <option>Batting All-Rounder</option>
            <option>Bowling All-Rounder</option>
          </select>
        </Field>

        <Field id="experience" label="Experience Level">
          <select
            id="experience"
            name="experience"
            value={form.experience}
            onChange={event => update('experience', event.target.value)}
            className={inputClass(false)}
          >
            <option value="" disabled>
              Select level...
            </option>
            <option>Beginner</option>
            <option>Casual Club</option>
            <option>Regular Club</option>
            <option>Experienced Club</option>
            <option>Highly Experienced</option>
          </select>
        </Field>
      </div>
    </>
  )
}

export default PlayerFields
