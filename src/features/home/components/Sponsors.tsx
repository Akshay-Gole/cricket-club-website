function Sponsors() {
  // STATIC placeholder data — swap for real sponsors from API later
  const sponsors = ['Spicy Chick', 'SA Cricket', 'SG Cricket', 'SS Cricket']

  return (
    <section
      data-animate="reveal"
      className="relative overflow-hidden border-t border-gold/20 bg-[#080806] px-7 py-14 sm:px-12 sm:py-16"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(201,168,76,0.1),transparent_35%)]" />

      <div className="relative z-[1] font-heading text-muted text-[11px] font-semibold tracking-[4px] uppercase text-center mb-9">
        Our Partners &amp; Sponsors
      </div>
      <div className="relative z-[1] flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        {sponsors.map(sponsor => (
          <div
            key={sponsor}
            data-animate="card"
            className="font-heading text-muted text-[15px] font-bold tracking-[2px] uppercase px-6 py-3 border-[0.5px] border-white/[0.1] bg-white/[0.025] rounded-sm hover:bg-gold/10 hover:text-gold hover:border-gold/35 transition-colors cursor-pointer"
          >
            {sponsor}
          </div>
        ))}
      </div>
    </section>
  )
}

export default Sponsors
