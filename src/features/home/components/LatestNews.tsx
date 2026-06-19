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
    <section className="px-7 sm:px-12 py-16 sm:py-24">
      {/* Section header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
        <div>
          <div className="font-heading text-gold text-[11px] font-semibold tracking-[4px] uppercase mb-2">
            From the club
          </div>
          <h2 className="font-display text-white text-[clamp(40px,7vw,56px)] tracking-[1px] leading-none">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gold/15">
        {articles.map(article => (
          <article
            key={article.title}
            className="bg-dark p-8 cursor-pointer group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_-12px_rgba(201,168,76,0.35)]"
          >
            {/* Thumbnail */}
            <div className="h-40 rounded-sm mb-5 overflow-hidden">
              <div className="h-full bg-gradient-to-br from-green to-[#0d3a1e] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <div className="font-display text-[13px] tracking-[3px] text-gold/50 text-center whitespace-pre-line">
                  {article.thumb}
                </div>
              </div>
            </div>

            <div className="font-heading text-gold text-[10px] font-bold tracking-[3px] uppercase mb-2.5">
              {article.category}
            </div>
            <h3 className="font-heading text-white text-[22px] font-bold leading-[1.2] mb-3 group-hover:text-gold transition-colors inline-block relative">
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
