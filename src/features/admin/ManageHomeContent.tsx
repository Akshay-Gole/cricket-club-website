import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import homeContentApi from '../home/api/homeContent.api'
import { EMPTY_HOME_CONTENT } from '../home/api/homeContent.api'
import type { HomeContent } from '../home/api/homeContent.api'

const STAT_FIELDS: {
  key: keyof Pick<
    HomeContent,
    'matchesPlayed' | 'victories' | 'trophies' | 'activePlayers' | 'yearsActive'
  >
  label: string
}[] = [
  {
    key: 'matchesPlayed',
    label: 'Matches Played',
  },
  {
    key: 'victories',
    label: 'Victories',
  },
  {
    key: 'trophies',
    label: 'Trophies',
  },
  {
    key: 'activePlayers',
    label: 'Active Players',
  },
  {
    key: 'yearsActive',
    label: 'Years Active',
  },
]

function ManageHomeContent() {
  const [form, setForm] = useState<HomeContent>(EMPTY_HOME_CONTENT)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadContent() {
      try {
        setIsLoading(true)
        setError('')

        const content = await homeContentApi.getAdmin()
        setForm(content)
      } catch {
        setError('Could not load home content.')
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
  }, [])

  const updateField = (field: keyof HomeContent, value: string) => {
    setForm(current => ({
      ...current,
      [field]: value,
    }))
    setMessage('')
    setError('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setIsSaving(true)
      setError('')
      setMessage('')

      const savedContent = await homeContentApi.update({
        tickerText: form.tickerText,
      })
      setForm(savedContent)
      setMessage('Home content saved.')
    } catch {
      setError('Could not save home content.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded border border-white/[0.1] bg-[#161616] p-5 sm:p-7">
        <p className="font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
          Homepage Control
        </p>

        <div className="mt-2 flex flex-col gap-4 min-[901px]:flex-row min-[901px]:items-end min-[901px]:justify-between">
          <div>
            <h1 className="font-display text-4xl tracking-[1px] text-white">
              Home Content
            </h1>
            <p className="mt-3 max-w-[620px] font-body text-sm leading-[1.7] text-muted">
              Homepage stats are calculated automatically from players and
              fixtures. Admin only controls the latest ticker text.
            </p>
          </div>
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        className="rounded border border-white/[0.1] bg-[#161616] p-5 sm:p-7"
      >
        <div className="grid grid-cols-1 gap-4 min-[641px]:grid-cols-2 min-[1180px]:grid-cols-5">
          {STAT_FIELDS.map(field => (
            <div
              key={field.key}
              className="rounded border border-white/[0.1] bg-white/[0.035] p-4"
            >
              <span className="font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold/80">
                {field.label}
              </span>
              <strong className="mt-3 block font-display text-4xl leading-none text-white">
                {form[field.key] || '0'}
              </strong>
              <span className="mt-2 block font-body text-xs leading-[1.6] text-muted">
                Calculated automatically
              </span>
            </div>
          ))}
        </div>

        <label className="mt-6 block">
          <span className="font-heading text-[10px] font-bold uppercase tracking-[3px] text-muted">
            Latest Ticker Text
          </span>
          <textarea
            value={form.tickerText}
            rows={5}
            placeholder="Write ticker text here..."
            onChange={event => updateField('tickerText', event.target.value)}
            className="mt-2 w-full resize-y rounded border border-white/[0.12] bg-white/[0.045] px-4 py-3 font-heading text-sm font-semibold leading-[1.7] tracking-[0.5px] text-white outline-none placeholder:text-muted focus:border-gold/40"
          />
        </label>

        <div className="mt-5 rounded border border-gold/15 bg-gold/[0.04] p-4">
          <p className="font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
            Preview
          </p>
          <p className="mt-2 font-body text-sm leading-[1.7] text-muted">
            Latest · {form.tickerText}
          </p>
        </div>

        {error && (
          <p className="mt-5 rounded border border-[#d86b5f]/30 bg-[#d86b5f]/10 px-4 py-3 font-heading text-[11px] font-bold uppercase tracking-[2px] text-[#ff9b8f]">
            {error}
          </p>
        )}

        {message && (
          <p className="mt-5 rounded border border-green-light/25 bg-green-light/10 px-4 py-3 font-heading text-[11px] font-bold uppercase tracking-[2px] text-green-light">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading || isSaving || Boolean(error)}
          className="mt-6 min-h-12 w-full rounded-sm bg-gold px-5 font-heading text-[11px] font-bold uppercase tracking-[3px] text-black transition-colors hover:bg-[#d8b95c] disabled:cursor-not-allowed disabled:opacity-60 min-[641px]:w-auto"
        >
          {isSaving ? 'Saving...' : 'Save Home Content'}
        </button>
      </form>
    </div>
  )
}

export default ManageHomeContent
