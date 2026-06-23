import type { ReactNode } from 'react'

interface FieldProps {
  id: string
  label: string
  required?: boolean
  error?: string
  children: ReactNode
}

function Field({ id, label, required = false, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="flex items-center gap-1 font-heading text-[10px] font-bold uppercase tracking-[2.5px] text-muted"
      >
        {label}

        {required && (
          <span className="text-[13px] leading-none text-gold">*</span>
        )}
      </label>

      {children}

      {error && (
        <p
          id={`${id}-error`}
          className="font-heading text-[11px] font-semibold tracking-[1px] text-[#c94c4c]"
        >
          {error}
        </p>
      )}
    </div>
  )
}

export default Field
