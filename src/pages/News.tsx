import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import newsApi from '../features/news/api/news.api'
import {
  NEWS_ARTICLES,
  categoryLabel,
  formatArticleDate,
} from '../features/news/data/newsData'
import type { NewsArticle } from '../features/news/types/news.types'

function News() {
  const [articles, setArticles] = useState<NewsArticle[]>(NEWS_ARTICLES)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      newsApi
        .getAll()
        .then(data => {
          if (data.length) {
            setArticles(data)
          }

          setHasError(false)
        })
        .catch(() => {
          setHasError(true)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [])

  const featureArticle = articles[0]
  const sideArticles = articles.slice(1, 3)

  return (
    <div className="bg-black">
      <section className="relative overflow-hidden border-b-[0.5px] border-white/[0.06] px-5 py-20 sm:px-7 sm:py-24 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(201,168,76,0.13),transparent_28%),radial-gradient(circle_at_82%_28%,rgba(45,138,71,0.14),transparent_32%),linear-gradient(135deg,#090b09_0%,#10120f_55%,#070907_100%)]" />
        <div className="absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:72px_72px]" />

        <div className="relative max-w-[1180px]">
          <div
            data-animate="hero"
            className="mb-4 font-heading text-[11px] font-bold uppercase tracking-[4px] text-gold"
          >
            Club Journal
          </div>

          <h1
            data-animate="hero"
            className="max-w-[760px] font-serif text-[42px] font-bold leading-[1.05] tracking-[-1px] text-cream sm:text-[64px] lg:text-[76px]"
          >
            Stories from the crease, clubhouse and season.
          </h1>

          <p
            data-animate="hero"
            className="mt-6 max-w-[640px] font-body text-base font-light leading-[1.8] text-muted sm:text-lg"
          >
            Match reports, registration updates, events and club notes from Top
            G&apos;s CC.
          </p>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-7 sm:py-16 lg:px-12">
        {isLoading && (
          <div className="mb-6 rounded-sm border border-gold/20 bg-gold/[0.06] px-4 py-3 font-heading text-[11px] font-bold uppercase tracking-[2px] text-gold">
            Loading latest club stories…
          </div>
        )}

        {hasError && (
          <div className="mb-6 rounded-sm border border-[#d86b5f]/25 bg-[#d86b5f]/[0.08] px-4 py-3 font-body text-sm text-[#ff9b8f]">
            Could not reach the news API, so this page is showing fallback
            stories for now.
          </div>
        )}

        {featureArticle ? (
          <div className="grid gap-7 min-[901px]:grid-cols-[1.2fr_0.8fr]">
            <NewsFeatureCard article={featureArticle} />

            <div data-animate="stagger" className="grid gap-1">
              {sideArticles.map(article => (
                <NewsSideCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="font-display text-3xl tracking-[1px] text-cream">
              No news published yet.
            </p>
            <p className="mt-3 font-body text-sm text-muted">
              Published admin articles will appear here.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

interface ArticleCardProps {
  article: NewsArticle
}

function NewsFeatureCard({ article }: ArticleCardProps) {
  return (
    <Link
      data-animate="card"
      to={`/news/${article.slug}`}
      className="group relative min-h-[520px] overflow-hidden rounded-sm border-[0.5px] border-white/[0.08] bg-[#111312] p-7 transition-colors hover:bg-[#151712] sm:p-9"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(7,9,7,0.98)_0%,rgba(7,9,7,0.5)_42%,rgba(7,9,7,0.16)_100%),linear-gradient(135deg,#0b2414,#1c4327_48%,#071009)]" />
      <div className="absolute inset-0 opacity-[0.16] [background-image:repeating-linear-gradient(170deg,transparent,transparent_44px,rgba(45,138,71,0.6)_44px,rgba(45,138,71,0.6)_88px)]" />
      {article.featuredImage && (
        <img
          src={article.featuredImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45 transition-transform duration-700 group-hover:scale-105"
        />
      )}

      <div className="relative flex h-full flex-col justify-end">
        <div className="mb-5 flex flex-wrap items-center gap-3 font-heading text-[11px] font-bold uppercase tracking-[2px] text-muted">
          <span className="rounded-sm bg-gold px-3 py-1 text-black">
            {categoryLabel[article.category]}
          </span>
          <span>{formatArticleDate(article.publishedAt)}</span>
          <span>{article.readTime}</span>
        </div>

        <h2 className="max-w-[760px] font-serif text-[34px] font-bold leading-[1.08] tracking-[-0.5px] text-cream sm:text-[48px]">
          {article.title}
        </h2>

        <p className="mt-5 max-w-[620px] font-body text-base font-light leading-[1.7] text-muted">
          {article.excerpt}
        </p>
      </div>
    </Link>
  )
}

function NewsSideCard({ article }: ArticleCardProps) {
  return (
    <Link
      to={`/news/${article.slug}`}
      className="group rounded-sm border-[0.5px] border-white/[0.08] bg-card p-7 transition-colors hover:bg-[#1b1c18]"
    >
      <div className="mb-12 h-28 overflow-hidden rounded-sm bg-[linear-gradient(135deg,#171711,#0b0d0b)]">
        {article.featuredImage ? (
          <img
            src={article.featuredImage}
            alt=""
            className="h-full w-full object-cover opacity-55 transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
      </div>

      <div className="mb-3 font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
        {categoryLabel[article.category]}
      </div>

      <h3 className="font-heading text-2xl font-bold leading-[1.12] text-cream">
        {article.title}
      </h3>

      <p className="mt-3 font-body text-sm font-light leading-[1.7] text-muted">
        {article.excerpt}
      </p>

      <div className="mt-8 font-heading text-[10px] font-bold uppercase tracking-[2px] text-muted">
        {formatArticleDate(article.publishedAt)} · {article.readTime}
      </div>
    </Link>
  )
}

export default News
