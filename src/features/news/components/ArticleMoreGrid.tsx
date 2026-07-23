import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import newsApi from '../api/news.api'
import {
  NEWS_ARTICLES,
  categoryLabel,
  formatArticleDate,
} from '../data/newsData'
import type { NewsArticle } from '../types/news.types'

interface ArticleMoreGridProps {
  currentSlug: string
}

const thumbClass = {
  news: 'from-[#171711] via-[#11140f] to-[#1b170b] text-gold/35',
  'match-report':
    'from-[#092012] via-[#0f2e1a] to-[#071009] text-green-light/35',
  event: 'from-[#10172b] via-[#101215] to-[#19150d] text-[#8fa7ff]/35',
  announcement: 'from-[#22130f] via-[#111210] to-[#1a140b] text-[#ff9b8f]/35',
}

function ArticleMoreGrid({ currentSlug }: ArticleMoreGridProps) {
  const [articles, setArticles] = useState<NewsArticle[]>(
    NEWS_ARTICLES.filter(article => article.slug !== currentSlug)
  )

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      newsApi
        .getAll()
        .then(data =>
          setArticles(data.filter(article => article.slug !== currentSlug))
        )
        .catch(() => undefined)
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [currentSlug])

  if (!articles.length) return null

  return (
    <section className="relative overflow-hidden border-t-[0.5px] border-white/[0.06] px-5 py-12 sm:px-7 lg:px-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(201,168,76,0.08),transparent_28%),radial-gradient(circle_at_88%_30%,rgba(52,160,88,0.08),transparent_28%)]" />
      <div className="relative">
        <div className="mb-8 flex items-center gap-4 font-heading text-[11px] font-bold uppercase tracking-[4px] text-gold">
          More from Top G&apos;s CC
          <span className="h-px flex-1 bg-white/[0.08]" />
        </div>

        <div className="grid gap-4 min-[641px]:grid-cols-2 min-[901px]:grid-cols-3">
          {articles.slice(0, 3).map(article => (
            <Link
              data-animate="card"
              key={article.id}
              to={`/news/${article.slug}`}
              className="group relative overflow-hidden rounded-sm border-[0.5px] border-white/[0.1] bg-[linear-gradient(145deg,#181a18_0%,#111311_58%,#17150d_100%)] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-1 hover:border-gold/25 hover:shadow-[0_28px_90px_rgba(0,0,0,0.45)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(201,168,76,0.12),transparent_34%)] opacity-70" />
              <div
                className={`relative mb-5 flex h-[132px] items-center justify-center overflow-hidden rounded-sm bg-gradient-to-br ${thumbClass[article.category]}`}
              >
                {article.featuredImage ? (
                  <img
                    src={article.featuredImage}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-55 transition-transform duration-500 group-hover:scale-105"
                  />
                ) : null}
                <div className="absolute inset-0 opacity-[0.12] [background-image:repeating-linear-gradient(165deg,transparent,transparent_34px,rgba(255,255,255,0.55)_34px,rgba(255,255,255,0.55)_68px)]" />
                <div className="relative font-display text-[54px] leading-none">
                  {categoryLabel[article.category][0]}
                </div>
              </div>
              <div className="relative">
                <div className="mb-2 font-heading text-[9px] font-bold uppercase tracking-[3px] text-gold">
                  {categoryLabel[article.category]}
                </div>
                <div className="font-heading text-xl font-bold leading-[1.18] text-cream">
                  {article.title}
                </div>
                <p className="mt-3 line-clamp-2 font-body text-sm font-light leading-[1.65] text-muted">
                  {article.excerpt}
                </p>
                <div className="mt-5 flex items-center justify-between font-heading text-[10px] font-semibold uppercase tracking-[1.5px] text-muted">
                  <span>{formatArticleDate(article.publishedAt)}</span>
                  <span className="text-gold opacity-0 transition-opacity group-hover:opacity-100">
                    Read →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ArticleMoreGrid
