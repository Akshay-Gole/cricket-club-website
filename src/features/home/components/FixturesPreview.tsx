import { Link } from 'react-router-dom'
import { ROUTES } from '../../../constants/routes'

function FixturesPreview() {
  // STATIC placeholder data — swap for real fixtures from API later (fixturesApi.getUpcoming/getResults)
  // TODO: extract each row into a reusable <FixtureRow /> component (own ticket)
  const fixtures = [
    {
      date: '31 May',
      home: "Top G's CC",
      away: 'Riverside CC',
      venue: 'Norwood Oval',
      result: 'upcoming',
      badge: 'Upcoming',
    },
    {
      date: '22 May',
      home: "Top G's CC",
      away: 'Norwood CC',
      venue: 'Adelaide Oval No.2',
      result: 'won',
      badge: 'Won +47',
    },
    {
      date: '15 May',
      home: 'Eastern Suburbs CC',
      away: "Top G's CC",
      venue: 'Kensington Oval',
      result: 'won',
      badge: 'Won +23',
    },
    {
      date: '07 May',
      home: "Top G's CC",
      away: 'Glenelg CC',
      venue: 'Glenelg Oval',
      result: 'lost',
      badge: 'Lost −12',
    },
  ]

  const badgeStyles: Record<string, string> = {
    upcoming: 'bg-green/30 text-green-light border-green-light/40',
    won: 'bg-gold/15 text-gold border-gold/30',
    lost: 'bg-[#e74c3c]/10 text-[#e74c3c] border-[#e74c3c]/20',
  }

  return (
    <section data-animate="reveal" className="px-7 sm:px-12 py-16 sm:pb-24">
      {/* Section header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
        <div>
          <div className="font-heading text-gold text-[11px] font-semibold tracking-[4px] uppercase mb-2">
            On the Field
          </div>
          <h2 className="font-display text-[#efe9dc] text-[clamp(40px,7vw,56px)] tracking-[1px] leading-none">
            Fixtures &amp; Results
          </h2>
        </div>
        <Link
          to={ROUTES.FIXTURES}
          className="font-heading text-gold text-xs font-semibold tracking-[2.5px] uppercase border-b border-gold/30 pb-0.5 hover:border-gold transition-colors"
        >
          Full Schedule →
        </Link>
      </div>

      {/* Fixture rows */}
      <div className="border-t-[0.5px] border-gold/15">
        {fixtures.map(fix => (
          <div
            key={`${fix.date}-${fix.away}`}
            data-animate="card"
            className="flex flex-wrap items-center gap-x-4 gap-y-2 py-[18px] sm:py-5 sm:flex-nowrap sm:gap-6 border-b-[0.5px] border-gold/15"
          >
            {/* Date — order 1 */}
            <div className="order-1 font-heading text-muted text-[11px] font-semibold tracking-[1.5px] uppercase min-w-[80px]">
              {fix.date}
            </div>
            {/* Teams — order 2, full width on mobile (forces line break) */}
            <div className="order-2 basis-full sm:basis-auto sm:flex-1 font-heading text-[#e7e0d1] text-base sm:text-lg font-bold">
              {fix.home}
              <span className="text-muted text-sm"> vs </span>
              {fix.away}
            </div>
            {/* Venue — order 3 */}
            <div className="order-3 flex-1 sm:flex-none font-body text-muted text-[13px] sm:min-w-[150px]">
              {fix.venue}
            </div>
            {/* Badge — order 4 */}
            <div
              className={`order-4 font-heading text-[10px] font-bold tracking-[2px] uppercase px-3 py-1.5 rounded-sm border-[0.5px] ${badgeStyles[fix.result]}`}
            >
              {fix.badge}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FixturesPreview
