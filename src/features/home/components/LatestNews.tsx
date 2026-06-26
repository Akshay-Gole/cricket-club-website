import { Link } from 'react-router-dom'
import { ROUTES } from '../../../constants/routes'

function LatestNews() {
  // STATIC placeholder data — swap for real news from API later (newsApi.getAll)
  // TODO: extract each card into a reusable <NewsCard /> component (own ticket)
  const articles = [
    {
      thumb: 'MATCH\nREPORT',
      category: 'Match Report',
      title: "Top G's Demolish Norwood by 47 Runs in Season Opener",
      excerpt:
        'A commanding all-round performance saw us take control early, restricting the opposition to 112 despite fine conditions.',
      meta: '22 May 2026 · 4 min read',
    },
    {
      thumb: 'CLUB\nNEWS',
      category: 'Club News',
      title: 'Season 2026 Registrations Are Now Open — Secure Your Spot',
      excerpt:
        'Applications for the upcoming season are live. Junior, Senior, and Social memberships all available from this week.',
      meta: '18 May 2026 · 2 min read',
    },
    {
      thumb: 'EVENTS',
      category: 'Events',
      title: 'Club Night & End of Season Presentation — June 14',
      excerpt:
        'Join us at the clubhouse for awards, highlights reel, and celebrations. All members, families and sponsors welcome.',
      meta: '15 May 2026 · 1 min read',
    },
  ]

  return (
    <section
      data-animate="reveal"
      className="relative overflow-hidden border-y border-white/[0.06] bg-[#10100f] px-7 py-16 sm:px-12 sm:py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(201,168,76,0.11),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.025),transparent_44%)]" />

      {/* Section header */}
      <div className="relative z-[1] flex flex-wrap items-end justify-between gap-4 mb-12">
        <div>
          <div className="font-heading text-gold text-[11px] font-semibold tracking-[4px] uppercase mb-2">
            From the club
          </div>
          <h2 className="font-display text-[#efe9dc] text-[clamp(40px,7vw,56px)] tracking-[1px] leading-none">
            Latest News
          </h2>
        </div>
        <Link
          to={ROUTES.NEWS}
          className="font-heading text-gold text-xs font-semibold tracking-[2.5px] uppercase border-b border-gold/30 pb-0.5 hover:border-gold transition-colors"
        >
          All Articles →
        </Link>
      </div>

      {/* News grid — 1px gaps create thin divider lines via the border-colored background */}
      <div className="relative z-[1] grid grid-cols-1 min-[641px]:grid-cols-2 min-[1025px]:grid-cols-3 gap-6">
        {articles.map(article => (
          <article
            key={article.title}
            data-animate="card"
            className="group cursor-pointer rounded-sm border border-white/[0.09] bg-[#171918] p-8 shadow-[0_14px_36px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/30 hover:bg-[#1b1d1b] hover:shadow-[0_18px_48px_-18px_rgba(201,168,76,0.42)]"
          >
            {/* Thumbnail */}
            <div className="mb-5 h-40 overflow-hidden rounded-sm border border-white/[0.07] bg-[#0d0f0e]">
              <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_35%_30%,rgba(201,168,76,0.16),transparent_34%),linear-gradient(135deg,#1d211e_0%,#111311_55%,#16130b_100%)] transition-transform duration-500 group-hover:scale-110">
                <div className="font-display text-center text-[13px] tracking-[3px] text-gold/55 whitespace-pre-line">
                  {article.thumb}
                </div>
              </div>
            </div>

            <div className="font-heading text-gold text-[10px] font-bold tracking-[3px] uppercase mb-2.5">
              {article.category}
            </div>
            <h3 className="font-heading text-[#e7e0d1] text-[22px] font-bold leading-[1.2] mb-3 group-hover:text-gold transition-colors inline-block relative">
              {article.title}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gold group-hover:w-full transition-all duration-300" />
            </h3>
            <p className="font-body text-muted text-sm font-light leading-[1.6] mb-5">
              {article.excerpt}
            </p>
            <div className="font-heading text-muted text-[11px] font-semibold tracking-[1.5px] uppercase">
              {article.meta}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default LatestNews
