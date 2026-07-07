function AchievementsTab() {
  // STATIC achievements + records (Catto). Swap for real data later.
  const achievements = [
    {
      icon: '🏆',
      year: '2026',
      title: 'Player of the Season',
      desc: "Top G's CC inaugural season award — voted by coaching staff and playing squad.",
      ghost: '★',
    },
    {
      icon: '⭐',
      year: '2026',
      title: 'Player of the Match × 4',
      desc: 'Awarded POTM in four separate fixtures across the 2026 season including the season opener.',
      ghost: '4',
    },
    {
      icon: '🏏',
      year: '2026',
      title: 'Club Top Run-scorer',
      desc: 'Lead the club batting charts with 847 runs across 14 appearances in the inaugural season.',
      ghost: '1',
    },
    {
      icon: '🎯',
      year: '2026',
      title: '4-Wicket Haul',
      desc: "Returned 4/22 against Henley CC — best bowling figures of the season for any Top G's bowler.",
      ghost: '4',
    },
    {
      icon: '🫡',
      year: '2026',
      title: 'Founding Captain',
      desc: "Appointed club captain unanimously by the founding committee before Top G's CC played a single match.",
      ghost: 'C',
    },
    {
      icon: '🔥',
      year: '2026',
      title: '6 Half-Centuries',
      desc: "Scored six 50+ innings across the season — the most by any player in the Top G's squad.",
      ghost: '6',
    },
  ]

  const records = [
    { label: 'Highest Score', sub: 'vs Riverside CC · May 2026', val: '94' },
    {
      label: 'Best Bowling Figures',
      sub: 'vs Henley CC · Apr 2026',
      val: '4 / 22',
    },
    {
      label: 'Most Runs in a Season',
      sub: 'Season 2026 — Club record',
      val: '847',
    },
  ]

  return (
    <div className="pb-14 sm:pb-16">
      {/* ACHIEVEMENTS GRID */}
      <div className="grid grid-cols-1 min-[641px]:grid-cols-2 min-[901px]:grid-cols-3 gap-px bg-white/[0.06] mb-12 rounded overflow-hidden">
        {achievements.map(ach => (
          <div
            key={ach.title}
            data-animate="card"
            className="relative bg-card p-6 sm:p-7 overflow-hidden"
          >
            {/* Ghost watermark */}
            <div className="absolute -bottom-4 -right-1 font-display text-[80px] text-white/[0.03] leading-none pointer-events-none">
              {ach.ghost}
            </div>
            <div className="relative">
              <span className="block font-display text-4xl mb-3">
                {ach.icon}
              </span>
              <div className="font-heading text-[11px] font-bold tracking-[2px] uppercase text-gold mb-1.5">
                {ach.year}
              </div>
              <div className="font-heading text-lg sm:text-xl font-bold text-white leading-[1.2] mb-1.5">
                {ach.title}
              </div>
              <div className="font-body text-[13px] font-light text-muted leading-[1.5]">
                {ach.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RECORDS LIST */}
      <div
        data-animate="reveal"
        className="font-heading text-[15px] font-semibold tracking-[3px] uppercase text-gold mb-4"
      >
        Personal Club Records
      </div>
      <div className="flex flex-col gap-px bg-white/[0.06] rounded overflow-hidden">
        {records.map(rec => (
          <div
            key={rec.label}
            data-animate="card"
            className="flex items-center justify-between bg-card px-5 sm:px-6 py-4"
          >
            <div>
              <div className="font-heading text-[15px] font-semibold text-white tracking-[0.5px]">
                {rec.label}
              </div>
              <div className="font-heading text-[10px] font-semibold tracking-[1.5px] uppercase text-muted mt-0.5">
                {rec.sub}
              </div>
            </div>
            <div className="font-display text-[28px] text-gold">{rec.val}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AchievementsTab
