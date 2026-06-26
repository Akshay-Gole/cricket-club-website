const QUICK_ITEMS = [
  {
    icon: '✉️',
    iconClass: 'bg-gold/10 border-gold/20',
    label: 'Email',
    value: 'hello@topgscc.com.au',
    href: 'mailto:hello@topgscc.com.au',
  },
  {
    icon: '📞',
    iconClass: 'bg-green-light/10 border-green-light/25',
    label: 'Phone',
    value: '+61 400 000 000',
    href: 'tel:+61400000000',
  },
  {
    icon: '📍',
    iconClass: 'bg-[#6482c8]/[0.08] border-[#6482c8]/[0.18]',
    label: 'Home Ground',
    value: 'Lundie Gardens, Adelaide SA',
    href: 'https://www.google.com/maps?q=Lundie+Gardens+Adelaide+SA',
  },
]

function ContactHero() {
  return (
    <section
      data-animate="hero"
      className="relative grid grid-cols-1 overflow-hidden min-[901px]:min-h-[340px] min-[901px]:grid-cols-2"
    >
      {/* Left hero */}
      <div
        className="
          relative min-h-[220px] px-5 pb-10 pt-12
          bg-[#101310]/80
          min-[641px]:min-h-[280px] min-[641px]:px-7 min-[641px]:pb-12 min-[641px]:pt-16
          min-[901px]:min-h-0 min-[901px]:pt-[60px]
          min-[901px]:after:absolute min-[901px]:after:inset-y-0
          min-[901px]:after:right-0 min-[901px]:after:w-px
          min-[901px]:after:content-['']
          min-[901px]:after:[background:linear-gradient(to_bottom,transparent,rgba(201,168,76,0.2),transparent)]
          min-[1025px]:px-12 min-[1025px]:pb-[60px] min-[1025px]:pt-[72px]
        "
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 48px,
                rgba(201,168,76,1) 48px,
                rgba(201,168,76,1) 49px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 64px,
                rgba(201,168,76,1) 64px,
                rgba(201,168,76,1) 65px
              )
            `,
          }}
        />

        <div className="relative">
          <div
            className="
              mb-3 flex items-center gap-3 font-heading text-[10px]
              font-semibold uppercase tracking-[3px] text-gold
              min-[641px]:mb-4 min-[641px]:text-[11px] min-[641px]:tracking-[4px]
            "
          >
            <span className="h-px w-7 bg-gold" />
            Get in Touch
          </div>

          <h1
            className="
              relative z-[1] font-display text-[42px] leading-[0.9]
              tracking-[2px] text-[#efe9dc]
              min-[641px]:text-[56px]
              min-[901px]:text-[64px]
              min-[1025px]:text-[80px]
            "
          >
            Talk
            <br />
            To <span className="text-gold">Us.</span>
          </h1>

          <span
            aria-hidden="true"
            className="
              -mt-1 block font-display text-[42px] leading-[0.9]
              tracking-[2px] text-gold/[0.035]
              [-webkit-text-stroke:0.75px_rgba(201,168,76,0.2)]
              [text-shadow:0_0_28px_rgba(201,168,76,0.08)]
              min-[641px]:text-[56px]
              min-[901px]:text-[64px]
              min-[1025px]:text-[80px]
            "
          >
            Talk
            <br />
            To Us.
          </span>
        </div>
      </div>

      {/* Quick contact links */}
      <div className="grid grid-rows-[auto_auto_auto] border-t-[0.5px] border-white/[0.1] bg-[#121512]/90 min-[901px]:grid-rows-3 min-[901px]:border-t-0">
        {QUICK_ITEMS.map((item, index) => (
          <a
            key={item.label}
            href={item.href}
            target={item.label === 'Home Ground' ? '_blank' : undefined}
            rel={item.label === 'Home Ground' ? 'noreferrer' : undefined}
            className={`
              group relative flex min-w-0 items-center gap-3.5 overflow-hidden
              px-5 py-4 pr-14 transition-colors hover:bg-white/[0.035]
              min-[641px]:gap-5 min-[641px]:px-7 min-[641px]:py-[18px] min-[641px]:pr-16
              min-[901px]:gap-3.5 min-[901px]:px-7 min-[901px]:py-0
              min-[1025px]:gap-5 min-[1025px]:px-10
              ${
                index !== QUICK_ITEMS.length - 1
                  ? 'border-b-[0.5px] border-white/[0.1]'
                  : ''
              }
            `}
          >
            <span
              className={`
                flex h-11 w-11 shrink-0 items-center justify-center rounded-sm
                border-[0.5px] text-xl
                ${item.iconClass}
              `}
            >
              {item.icon}
            </span>

            <span className="min-w-0">
              <span
                className="
                  mb-[3px] block font-heading text-[9px] font-bold uppercase
                  tracking-[2px] text-muted
                  min-[641px]:text-[10px] min-[641px]:tracking-[2.5px]
                "
              >
                {item.label}
              </span>

              <span
                className="
                  block font-heading text-[13px] font-bold tracking-[0.5px]
                  text-[#e7e0d1] min-[641px]:text-sm min-[1025px]:text-base
                "
              >
                {item.value}
              </span>
            </span>

            <span
              aria-hidden="true"
              className="
                absolute right-[18px] font-heading text-base text-muted
                transition-all duration-200
                group-hover:translate-x-1 group-hover:text-gold
                min-[641px]:right-6 min-[641px]:text-lg
                min-[1025px]:right-8
              "
            >
              →
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}

export default ContactHero
