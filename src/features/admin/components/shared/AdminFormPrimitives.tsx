import type { ReactNode } from 'react'

export function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border border-white/[0.12] bg-white/[0.035] p-4">
      <div className="font-display text-3xl leading-none text-white">
        {value}
      </div>
      <div className="mt-1 font-heading text-[9px] font-bold uppercase tracking-[2px] text-muted">
        {label}
      </div>
    </div>
  )
}

export function Badge({
  children,
  className,
}: {
  children: ReactNode
  className: string
}) {
  return (
    <span
      className={`inline-flex rounded border px-2.5 py-1.5 font-heading text-[9px] font-bold uppercase tracking-[2px] ${className}`}
    >
      {children}
    </span>
  )
}

export function MiniStat({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="border-r border-white/[0.1] last:border-r-0">
      <div className="truncate px-1 font-display text-base leading-none text-white">
        {value}
      </div>
      <div className="mt-1 font-heading text-[8px] font-bold uppercase tracking-[2px] text-muted">
        {label}
      </div>
    </div>
  )
}

export function AdminField({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-heading text-[10px] font-bold uppercase tracking-[2.5px] text-muted">
        {label}
        {required ? <span className="text-gold"> *</span> : null}
      </span>
      {children}
    </label>
  )
}

export function ToggleCard({
  title,
  description,
  checked,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded border border-white/[0.12] bg-white/[0.035] px-4 py-3">
      <span>
        <span className="block font-heading text-[11px] font-bold uppercase tracking-[2px] text-white">
          {title}
        </span>
        <span className="mt-1 block font-body text-[11px] font-light leading-[1.4] text-muted">
          {description}
        </span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={event => onChange(event.target.checked)}
        className="h-4 w-4 shrink-0 accent-gold"
      />
    </label>
  )
}

export function FormActions({
  error,
  editing,
  submitLabel,
  onCancel,
}: {
  error: string
  editing: boolean
  submitLabel: string
  onCancel: () => void
}) {
  return (
    <>
      {error && (
        <div className="rounded border border-[#d86b5f]/25 bg-[#d86b5f]/[0.08] px-4 py-3 font-body text-xs text-[#ff9b8f]">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 min-[420px]:flex-row">
        <button
          type="submit"
          className="flex-1 rounded bg-gold px-5 py-3.5 font-heading text-[11px] font-bold uppercase tracking-[2.5px] text-black transition-colors hover:bg-gold/90"
        >
          {submitLabel}
        </button>

        {editing && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-white/[0.08] px-5 py-3.5 font-heading text-[11px] font-bold uppercase tracking-[2.5px] text-muted transition-colors hover:text-white"
          >
            Cancel
          </button>
        )}
      </div>
    </>
  )
}
