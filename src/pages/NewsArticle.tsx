import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import newsApi from '../features/news/api/news.api'
import MatchReportArticle from '../features/news/components/MatchReportArticle'
import StandardArticle from '../features/news/components/StandardArticle'
import { getArticleBySlug } from '../features/news/data/newsData'
import type { NewsArticle as NewsArticleType } from '../features/news/types/news.types'

function NewsArticle() {
  const { slug } = useParams()
  const progressRef = useRef<HTMLDivElement | null>(null)
  const [article, setArticle] = useState<NewsArticleType | null>(
    getArticleBySlug(slug)
  )
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

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

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (!slug) {
        setArticle(null)
        setIsLoading(false)
        return
      }

      newsApi
        .getBySlug(slug)
        .then(data => {
          setArticle(data)
          setHasError(false)
        })
        .catch(() => {
          setArticle(getArticleBySlug(slug) ?? null)
          setHasError(true)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [slug])

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
