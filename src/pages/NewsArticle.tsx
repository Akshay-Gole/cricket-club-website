import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import MatchReportArticle from '../features/news/components/MatchReportArticle'
import StandardArticle from '../features/news/components/StandardArticle'
import { getArticleBySlug } from '../features/news/data/newsData'
import { newsArticleQuery } from '../lib/queryOptions'

function NewsArticle() {
  const { slug } = useParams()
  const progressRef = useRef<HTMLDivElement | null>(null)
  const {
    data,
    isLoading,
    isError: hasError,
  } = useQuery(newsArticleQuery(slug ?? ''))
  const article = data ?? getArticleBySlug(slug) ?? null

  useEffect(() => {
    const updateProgress = () => {
      const doc = document.documentElement
      const total = doc.scrollHeight - doc.clientHeight
      const progress = total > 0 ? (doc.scrollTop / total) * 100 : 0

      if (progressRef.current) {
        progressRef.current.style.width = `${progress}%`
      }
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })

    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  if (!article) {
    return (
      <div className="flex min-h-[55vh] flex-col items-center justify-center bg-black px-5 text-center">
        <p className="font-display text-4xl tracking-[1px] text-cream">
          Article not found
        </p>
        <Link
          to="/news"
          className="mt-6 font-heading text-[11px] font-bold uppercase tracking-[3px] text-gold"
        >
          Back to news →
        </Link>
      </div>
    )
  }

  const notice =
    isLoading || hasError ? (
      <div className="fixed left-5 top-24 z-40 rounded-sm border border-gold/20 bg-black/80 px-4 py-3 font-heading text-[10px] font-bold uppercase tracking-[2px] text-gold backdrop-blur">
        {isLoading
          ? 'Loading latest article…'
          : 'Showing fallback article — API unavailable'}
      </div>
    ) : null

  if (article.layout === 'standard') {
    return (
      <>
        {notice}
        <StandardArticle article={article} progressRef={progressRef} />
      </>
    )
  }

  return (
    <>
      {notice}
      <MatchReportArticle article={article} progressRef={progressRef} />
    </>
  )
}

export default NewsArticle
