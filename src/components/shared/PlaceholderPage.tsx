interface PlaceholderPageProps {
  eyebrow: string
  title: string
  description: string
  ghost: string
}

function PlaceholderPage({
  eyebrow,
  title,
  description,
  ghost,
}: PlaceholderPageProps) {
  return (
    <div className="relative min-h-[calc(100vh-72px)] overflow-hidden px-5 py-16 sm:px-7 sm:py-20 lg:px-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.13] [background-image:linear-gradient(rgba(201,168,76,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(201,168,76,0.7)_1px,transparent_1px)] [background-size:88px_88px]"
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(52,160,88,0.16),transparent_34%),radial-gradient(circle_at_82%_20%,rgba(201,168,76,0.11),transparent_32%)]" />

      <div
        data-animate="hero"
        className="relative mx-auto flex min-h-[520px] max-w-[1180px] flex-col justify-end rounded border border-white/[0.1] bg-[#101310]/85 p-6 shadow-[0_22px_70px_rgba(0,0,0,0.34)] sm:p-9 lg:p-12"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-4 top-8 font-display text-[clamp(92px,18vw,220px)] leading-none tracking-[4px] text-gold/[0.055] [-webkit-text-stroke:0.75px_rgba(201,168,76,0.16)]"
        >
          {ghost}
        </div>

        <div className="relative max-w-[720px]">
          <div className="mb-4 flex items-center gap-3 font-heading text-[11px] font-bold uppercase tracking-[4px] text-gold">
            <span className="h-px w-8 bg-gold" />
            {eyebrow}
          </div>

          <h1 className="font-display text-[clamp(54px,9vw,96px)] leading-[0.9] tracking-[2px] text-[#efe9dc]">
            {title}
          </h1>

          <p className="mt-6 max-w-[560px] font-body text-sm font-light leading-[1.85] text-muted sm:text-base">
            {description}
          </p>

          <div
            data-animate="stagger"
            className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-3"
          >
            {['Design ready', 'Content pending', 'Animation active'].map(
              item => (
                <div
                  key={item}
                  className="rounded border border-white/[0.1] bg-white/[0.035] px-4 py-3 font-heading text-[10px] font-bold uppercase tracking-[2.5px] text-muted"
                >
                  {item}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaceholderPage
