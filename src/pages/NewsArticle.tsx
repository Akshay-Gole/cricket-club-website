import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import MatchReportArticle from '../features/news/components/MatchReportArticle'
import StandardArticle from '../features/news/components/StandardArticle'
import { getArticleBySlug } from '../features/news/data/newsData'

function NewsArticle() {
  const { slug } = useParams()
  const article = getArticleBySlug(slug)
  const progressRef = useRef<HTMLDivElement | null>(null)

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

  if (article.layout === 'standard') {
    return <StandardArticle article={article} progressRef={progressRef} />
  }

  return <MatchReportArticle article={article} progressRef={progressRef} />
}

export default NewsArticle
