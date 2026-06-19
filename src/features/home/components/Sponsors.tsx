function Sponsors() {
  // STATIC placeholder data — swap for real sponsors from API later
  const sponsors = ['Spicy Chick', 'SA Cricket', 'SG Cricket', 'SS Cricket']

  return (
    <div className="px-7 sm:px-12 py-16 border-t-[0.5px] border-gold/15">
      <div className="font-heading text-muted text-[11px] font-semibold tracking-[4px] uppercase text-center mb-9">
        Our Partners &amp; Sponsors
      </div>
      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12">
        {sponsors.map(sponsor => (
          <div
            key={sponsor}
            className="font-heading text-muted text-[15px] font-bold tracking-[2px] uppercase px-6 py-2.5 border-[0.5px] border-white/[0.08] rounded-sm hover:text-gold hover:border-gold/30 transition-colors cursor-pointer"
          >
            {sponsor}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sponsors
