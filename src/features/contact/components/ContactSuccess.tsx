interface ContactSuccessProps {
  name: string
  onReset: () => void
}

function ContactSuccess({ name, onReset }: ContactSuccessProps) {
  return (
    <section className="px-5 py-8 pb-14 sm:px-7 sm:py-10 sm:pb-16 lg:px-12 lg:py-12 lg:pb-20">
      <div className="flex min-h-[300px] w-full flex-col items-center justify-center rounded border-[0.5px] border-white/[0.06] bg-card px-6 py-10 text-center sm:min-h-[380px] sm:px-10 sm:py-14">
        <div className="mb-5 flex h-[68px] w-[68px] items-center justify-center rounded-full border border-green-light/35 bg-green-light/15">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2d8a47"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2 className="mb-2.5 font-display text-[38px] tracking-[2px] text-white sm:text-5xl">
          Message Sent.
        </h2>

        <p className="max-w-[280px] font-body text-sm font-light leading-[1.7] text-muted sm:text-[15px]">
          Thanks <span className="text-gold">{name}</span>. We'll be back to you
          within 48 hours.
        </p>

        <button
          type="button"
          onClick={onReset}
          className="mt-7 cursor-pointer rounded-sm bg-gold px-7 py-[13px] font-heading text-xs font-bold uppercase tracking-[2.5px] text-black transition-colors hover:bg-gold-light"
        >
          Send Another →
        </button>
      </div>
    </section>
  )
}

export default ContactSuccess
