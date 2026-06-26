import { useEffect, useState } from 'react'

type HonourPanel = 'trophies' | 'awards' | 'records'

const HONOUR_STATS = [
  { label: 'Club trophies', value: '08' },
  { label: 'Finals played', value: '14' },
  { label: 'Award winners', value: '32' },
]

const TROPHIES = [
  {
    year: '2026',
    title: 'Senior Division Finalists',
    type: 'Season Honour',
    description:
      'A breakout campaign built on consistent batting, disciplined bowling and a fearless new squad identity.',
  },
  {
    year: '2025',
    title: 'Community Club Award',
    type: 'Club Honour',
    description:
      'Recognised for growing participation, creating an inclusive environment and supporting local cricket.',
  },
  {
    year: '2024',
    title: 'T20 Shield Winners',
    type: 'Trophy',
    description:
      'Top G’s CC lifted the short-format shield after a dominant unbeaten run through the competition.',
  },
  {
    year: '2023',
    title: 'Best New Club Program',
    type: 'Milestone',
    description:
      'The club’s player pathway and weekend training program became a foundation for long-term growth.',
  },
  {
    year: '2022',
    title: 'Winter Cup Runners Up',
    type: 'Trophy',
    description:
      'A gritty campaign where the squad reached the final with a young core and strong late-season form.',
  },
  {
    year: '2021',
    title: 'Foundation Season',
    type: 'Milestone',
    description:
      'The first organised season for the club, setting the standards for culture, selection and match-day identity.',
  },
]

const PLAYER_AWARDS = [
  {
    award: 'Player of the Season',
    name: 'Akshay Gole',
    season: '2026',
    detail: '847 runs',
  },
  {
    award: 'Bowler of the Season',
    name: 'Ryan Smith',
    season: '2026',
    detail: '34 wickets',
  },
  {
    award: 'Club Champion',
    name: 'James Catto',
    season: '2025',
    detail: 'All-round impact',
  },
  {
    award: 'Best Batter',
    name: 'Jones',
    season: '2025',
    detail: '612 runs',
  },
  {
    award: 'Best Fielder',
    name: 'Mitchell',
    season: '2024',
    detail: '28 dismissals',
  },
  {
    award: 'Most Improved',
    name: 'Khan',
    season: '2024',
    detail: 'Breakout all-round season',
  },
]

const RECORDS = [
  { label: 'Highest team score', value: '212/5', meta: 'vs Norwood CC' },
  { label: 'Best bowling', value: '6/22', meta: 'Ryan Smith' },
  { label: 'Highest partnership', value: '138', meta: 'Gole / Jones' },
  { label: 'Fastest fifty', value: '24b', meta: 'James Catto' },
  { label: 'Most season runs', value: '847', meta: 'Akshay Gole' },
  { label: 'Most season wickets', value: '34', meta: 'Ryan Smith' },
  { label: 'Most catches', value: '18', meta: 'Mitchell' },
  { label: 'Biggest win', value: '+47', meta: 'vs Norwood CC' },
]

function Honours() {
  const [activePanel, setActivePanel] = useState<HonourPanel | null>(null)

  useEffect(() => {
    if (!activePanel) return

    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
    }
  }, [activePanel])

  return (
    <div className="relative overflow-hidden bg-[#080a08]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_4%,rgba(201,168,76,0.12),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(52,160,88,0.08),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(201,168,76,0.9)_1px,transparent_1px),linear-gradient(90deg,rgba(201,168,76,0.9)_1px,transparent_1px)] [background-size:96px_96px]" />

      <section className="relative border-b border-white/[0.06] px-5 py-16 sm:px-7 sm:py-20 lg:px-12 lg:py-24">
        <div className="grid gap-8 min-[901px]:grid-cols-[1fr_420px] min-[901px]:items-end">
          <div>
            <div
              data-animate="hero"
              className="mb-4 flex items-center gap-3 font-heading text-[11px] font-bold uppercase tracking-[4px] text-gold"
            >
              <span className="h-px w-8 bg-gold" />
              Club Legacy
            </div>

            <h1
              data-animate="hero"
              className="max-w-[780px] font-display text-[64px] uppercase leading-[0.9] tracking-[1px] text-cream sm:text-[92px] lg:text-[118px]"
            >
              Honours.
            </h1>

            <p
              data-animate="hero"
              className="mt-6 max-w-[620px] font-body text-base font-light leading-[1.8] text-muted sm:text-lg"
            >
              Trophies, awards, records and moments that shaped Top G&apos;s CC.
              This page is ready for real backend data later, but already gives
              the club history a proper home.
            </p>
          </div>

          <div
            data-animate="card"
            className="rounded-sm border border-white/[0.09] bg-[#151817]/90 p-5 shadow-[0_18px_48px_rgba(0,0,0,0.36)]"
          >
            <div className="mb-5 font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
              Snapshot
            </div>
            <div className="grid grid-cols-3 gap-3">
              {HONOUR_STATS.map(stat => (
                <div
                  key={stat.label}
                  className="rounded-sm border border-white/[0.08] bg-black/25 p-4"
                >
                  <div className="font-display text-[38px] leading-none text-cream">
                    {stat.value}
                  </div>
                  <div className="mt-3 font-heading text-[9px] font-bold uppercase leading-[1.5] tracking-[2px] text-muted">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-5 py-14 sm:px-7 sm:py-16 lg:px-12 lg:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="mb-3 font-heading text-[11px] font-bold uppercase tracking-[4px] text-gold">
              Silverware
            </div>
            <h2 className="font-display text-[44px] uppercase leading-none text-cream sm:text-[64px]">
              Trophy Cabinet
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setActivePanel('trophies')}
            className="border-b border-gold/40 pb-1 font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold transition-colors hover:text-cream"
          >
            View all honours →
          </button>
        </div>

        <div
          data-animate="stagger"
          className="grid grid-cols-1 gap-5 min-[641px]:grid-cols-2 min-[1025px]:grid-cols-4 sm:gap-6"
        >
          {TROPHIES.slice(0, 4).map(trophy => (
            <article
              key={`${trophy.year}-${trophy.title}`}
              className="group relative min-h-[330px] overflow-hidden rounded-sm border border-white/[0.09] bg-[#171918] p-7 shadow-[0_14px_36px_rgba(0,0,0,0.3)] transition-colors duration-300 hover:border-gold/30 hover:bg-[#1b1d1b]"
            >
              <div className="absolute -right-2 top-5 font-display text-[82px] leading-none text-gold/[0.09] transition-colors group-hover:text-gold/[0.14]">
                {trophy.year.slice(2)}
              </div>

              <div className="relative flex h-full flex-col">
                <div className="mb-14 inline-flex w-fit rounded-sm border border-gold/25 bg-gold/[0.08] px-3 py-1 font-heading text-[9px] font-bold uppercase tracking-[2.5px] text-gold">
                  {trophy.type}
                </div>

                <div className="mt-auto">
                  <div className="mb-3 font-heading text-[10px] font-bold uppercase tracking-[3px] text-muted">
                    {trophy.year}
                  </div>
                  <h3 className="font-heading text-[27px] font-bold leading-[1.05] text-cream">
                    {trophy.title}
                  </h3>
                  <p className="mt-4 font-body text-sm font-light leading-[1.65] text-muted">
                    {trophy.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="relative border-y border-white/[0.06] bg-[#0d100e] px-5 py-14 sm:px-7 sm:py-16 lg:px-12 lg:py-20">
        <div className="grid gap-6 min-[901px]:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="mb-3 font-heading text-[11px] font-bold uppercase tracking-[4px] text-gold">
              Individual Honours
            </div>
            <h2 className="max-w-[420px] font-display text-[44px] uppercase leading-none text-cream sm:text-[64px]">
              Award Winners
            </h2>
            <p className="mt-5 max-w-[420px] font-body text-sm font-light leading-[1.8] text-muted sm:text-base">
              These cards can later come from admin-managed award entries, so
              every season can have its own winners.
            </p>
            <button
              type="button"
              onClick={() => setActivePanel('awards')}
              className="mt-7 border-b border-gold/40 pb-1 font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold transition-colors hover:text-cream"
            >
              View all winners →
            </button>
          </div>

          <div data-animate="stagger" className="grid gap-4">
            {PLAYER_AWARDS.slice(0, 3).map(award => (
              <article
                key={`${award.season}-${award.award}`}
                className="grid gap-5 rounded-sm border border-white/[0.09] bg-[#171918] p-5 shadow-[0_12px_32px_rgba(0,0,0,0.26)] min-[641px]:grid-cols-[1fr_auto] min-[641px]:items-center sm:p-6"
              >
                <div>
                  <div className="mb-3 font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
                    {award.award}
                  </div>
                  <h3 className="font-heading text-[30px] font-bold leading-none text-cream">
                    {award.name}
                  </h3>
                  <div className="mt-3 font-body text-sm text-muted">
                    {award.detail}
                  </div>
                </div>
                <div className="w-fit rounded-sm border border-white/[0.08] bg-black/25 px-5 py-4 font-display text-[38px] leading-none text-gold">
                  {award.season}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-5 py-14 sm:px-7 sm:py-16 lg:px-12 lg:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="mb-3 font-heading text-[11px] font-bold uppercase tracking-[4px] text-gold">
              Records
            </div>
            <h2 className="font-display text-[44px] uppercase leading-none text-cream sm:text-[64px]">
              Club Bests
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setActivePanel('records')}
            className="border-b border-gold/40 pb-1 font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold transition-colors hover:text-cream"
          >
            View all records →
          </button>
        </div>

        <div
          data-animate="stagger"
          className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-white/[0.08] bg-white/[0.08] min-[641px]:grid-cols-2 min-[1025px]:grid-cols-4"
        >
          {RECORDS.slice(0, 4).map(record => (
            <article key={record.label} className="bg-[#151817] p-6 sm:p-7">
              <div className="font-heading text-[10px] font-bold uppercase tracking-[3px] text-muted">
                {record.label}
              </div>
              <div className="mt-5 font-display text-[54px] leading-none text-cream">
                {record.value}
              </div>
              <div className="mt-4 font-body text-sm text-gold">
                {record.meta}
              </div>
            </article>
          ))}
        </div>
      </section>

      {activePanel && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          onClick={() => setActivePanel(null)}
        >
          <div
            data-lenis-prevent
            className="max-h-[88vh] w-full overscroll-contain overflow-y-auto rounded-t-sm border border-white/[0.1] bg-[#111411] shadow-[0_30px_90px_rgba(0,0,0,0.55)] sm:mx-auto sm:max-w-[980px] sm:rounded-sm"
            onClick={event => event.stopPropagation()}
            onTouchMove={event => event.stopPropagation()}
            onWheel={event => event.stopPropagation()}
          >
            <div className="sticky top-0 z-[1] flex items-start justify-between gap-5 border-b border-white/[0.08] bg-[#111411]/95 px-5 py-5 backdrop-blur sm:px-7">
              <div>
                <div className="mb-2 font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
                  Full Archive
                </div>
                <h3 className="font-display text-[34px] uppercase leading-none text-cream sm:text-[48px]">
                  {activePanel === 'trophies' && 'Trophy Cabinet'}
                  {activePanel === 'awards' && 'Award Winners'}
                  {activePanel === 'records' && 'Club Records'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePanel(null)}
                className="rounded-sm border border-white/[0.1] px-4 py-3 font-heading text-[10px] font-bold uppercase tracking-[2px] text-muted transition-colors hover:border-gold/40 hover:text-gold"
              >
                Close
              </button>
            </div>

            <div className="p-5 sm:p-7">
              {activePanel === 'trophies' && (
                <div className="grid grid-cols-1 gap-4 min-[641px]:grid-cols-2">
                  {TROPHIES.map(trophy => (
                    <article
                      key={`modal-${trophy.year}-${trophy.title}`}
                      className="rounded-sm border border-white/[0.09] bg-[#171918] p-5 sm:p-6"
                    >
                      <div className="mb-5 flex items-center justify-between gap-4">
                        <span className="rounded-sm border border-gold/25 bg-gold/[0.08] px-3 py-1 font-heading text-[9px] font-bold uppercase tracking-[2px] text-gold">
                          {trophy.type}
                        </span>
                        <span className="font-display text-[36px] leading-none text-gold">
                          {trophy.year}
                        </span>
                      </div>
                      <h4 className="font-heading text-2xl font-bold leading-[1.1] text-cream">
                        {trophy.title}
                      </h4>
                      <p className="mt-4 font-body text-sm font-light leading-[1.7] text-muted">
                        {trophy.description}
                      </p>
                    </article>
                  ))}
                </div>
              )}

              {activePanel === 'awards' && (
                <div className="grid gap-3">
                  {PLAYER_AWARDS.map(award => (
                    <article
                      key={`modal-${award.season}-${award.award}`}
                      className="grid gap-4 rounded-sm border border-white/[0.09] bg-[#171918] p-5 min-[641px]:grid-cols-[1fr_auto] min-[641px]:items-center"
                    >
                      <div>
                        <div className="mb-2 font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
                          {award.award}
                        </div>
                        <h4 className="font-heading text-2xl font-bold leading-none text-cream">
                          {award.name}
                        </h4>
                        <div className="mt-3 font-body text-sm text-muted">
                          {award.detail}
                        </div>
                      </div>
                      <div className="w-fit rounded-sm border border-white/[0.08] bg-black/25 px-5 py-3 font-display text-[34px] leading-none text-gold">
                        {award.season}
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {activePanel === 'records' && (
                <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-white/[0.08] bg-white/[0.08] min-[641px]:grid-cols-2 min-[1025px]:grid-cols-4">
                  {RECORDS.map(record => (
                    <article
                      key={`modal-${record.label}`}
                      className="bg-[#171918] p-6"
                    >
                      <div className="font-heading text-[10px] font-bold uppercase tracking-[3px] text-muted">
                        {record.label}
                      </div>
                      <div className="mt-5 font-display text-[48px] leading-none text-cream">
                        {record.value}
                      </div>
                      <div className="mt-4 font-body text-sm text-gold">
                        {record.meta}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Honours
