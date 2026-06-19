function Ticker() {
  // STATIC placeholder text — swap for real latest-news ticker from API later
  const messages =
    "Top G's CC def. Norwood CC by 47 runs    ·    Catto named Player of the Match    ·    Next fixture: Top G's CC vs Riverside CC — Sat 31 May    ·    U18s training every Thursday 5PM    ·    Season 2026 registrations now open    ·    "

  return (
    <div className="bg-gold px-12 py-3 flex items-center gap-8 overflow-hidden">
      <div className="font-heading text-[11px] font-bold tracking-[3px] uppercase text-black shrink-0 pr-8 border-r border-black/20">
        Latest
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="inline-flex w-max animate-scroll-ticker">
          <span className="font-heading text-[13px] font-semibold tracking-[1px] text-black whitespace-pre">
            {messages}
          </span>
          <span
            className="font-heading text-[13px] font-semibold tracking-[1px] text-black whitespace-pre"
            aria-hidden="true"
          >
            {messages}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Ticker
