import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../../constants/routes'
import {
  NEWS_ARTICLES,
  categoryLabel,
  formatArticleDate,
} from '../../news/data/newsData'
import { newsQuery } from '../../../lib/queryOptions'

function LatestNews() {
  const { data, isLoading } = useQuery(newsQuery)
  const articles = data?.length ? data.slice(0, 3) : NEWS_ARTICLES.slice(0, 3)

  return (
    <section
      data-animate="reveal"
      className="relative overflow-hidden border-y border-white/[0.06] bg-[#10100f] px-7 py-16 sm:px-12 sm:py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(201,168,76,0.11),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.025),transparent_44%)]" />

      <div className="relative z-[1] mb-12 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 font-heading text-[11px] font-semibold uppercase tracking-[4px] text-gold">
            From the club
          </div>
          <h2 className="font-display text-[clamp(40px,7vw,56px)] leading-none tracking-[1px] text-[#efe9dc]">
            Latest News
          </h2>
        </div>
        <Link
          to={ROUTES.NEWS}
          className="border-b border-gold/30 pb-0.5 font-heading text-xs font-semibold uppercase tracking-[2.5px] text-gold transition-colors hover:border-gold"
        >
          All Articles →
        </Link>
      </div>

      {isLoading && (
        <div className="relative z-[1] mb-6 rounded-sm border border-gold/20 bg-gold/[0.06] px-4 py-3 font-heading text-[10px] font-bold uppercase tracking-[2px] text-gold">
          Loading news…
        </div>
      )}

      <div className="relative z-[1] grid grid-cols-1 gap-6 min-[641px]:grid-cols-2 min-[1025px]:grid-cols-3">
        {articles.map(article => (
          <Link
            key={article.id}
            to={`/news/${article.slug}`}
            data-animate="card"
            className="group rounded-sm border border-white/[0.09] bg-[#171918] p-8 shadow-[0_14px_36px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/30 hover:bg-[#1b1d1b] hover:shadow-[0_18px_48px_-18px_rgba(201,168,76,0.42)]"
          >
            <div className="mb-5 h-40 overflow-hidden rounded-sm border border-white/[0.07] bg-[#0d0f0e]">
              <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_35%_30%,rgba(201,168,76,0.16),transparent_34%),linear-gradient(135deg,#1d211e_0%,#111311_55%,#16130b_100%)] transition-transform duration-500 group-hover:scale-110">
                {article.featuredImage ? (
                  <img
                    src={article.featuredImage}
                    alt=""
                    className="h-full w-full object-cover opacity-65"
                  />
                ) : (
                  <div className="whitespace-pre-line text-center font-display text-[13px] tracking-[3px] text-gold/55">
                    {categoryLabel[article.category]}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-2.5 font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
              {categoryLabel[article.category]}
            </div>
            <h3 className="relative mb-3 inline-block font-heading text-[22px] font-bold leading-[1.2] text-[#e7e0d1] transition-colors group-hover:text-gold">
              {article.title}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gold transition-all duration-300 group-hover:w-full" />
            </h3>
            <p className="mb-5 font-body text-sm font-light leading-[1.6] text-muted">
              {article.excerpt}
            </p>
            <div className="font-heading text-[11px] font-semibold uppercase tracking-[1.5px] text-muted">
              {formatArticleDate(article.publishedAt)} · {article.readTime}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default LatestNews
