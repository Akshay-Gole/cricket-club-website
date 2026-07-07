function FixturesHeader() {
  return (
    <div
      data-animate="hero"
      className="relative overflow-hidden px-5 sm:px-7 lg:px-12 pt-10 sm:pt-12 lg:pt-14"
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(26,92,46,0.07)_0%,transparent_55%)] pointer-events-none" />
      <div className="relative">
        <div className="flex items-center gap-3.5 mb-3 font-heading text-[11px] font-semibold tracking-[4px] uppercase text-gold">
          <span className="block w-8 h-px bg-gold" />
          Season Schedule
        </div>
        <h1 className="font-display text-[#efe9dc] text-[44px] sm:text-[56px] lg:text-[84px] leading-[0.9] tracking-[2px]">
          Fixtures &amp;
          <br />
          Results
        </h1>
        <div
          className="font-display text-[44px] sm:text-[56px] lg:text-[84px] leading-[0.9] tracking-[2px] -mt-1.5 mb-8 sm:mb-9 text-gold/[0.035] pointer-events-none [-webkit-text-stroke:0.75px_rgba(201,168,76,0.22)] [text-shadow:0_0_28px_rgba(201,168,76,0.08)]"
          aria-hidden="true"
        >
          Fixtures &amp;
          <br />
          Results
        </div>
        <p className="font-body text-[13px] sm:text-[15px] font-light text-muted max-w-[520px] leading-[1.7] mb-8 sm:mb-12">
          Every match. Every ground. Every result. Follow Top G's CC through
          seasons and beyond.
        </p>
      </div>
    </div>
  )
}

export default FixturesHeader
