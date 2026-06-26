import type { RefObject } from 'react'

interface ArticleProgressProps {
  progressRef: RefObject<HTMLDivElement | null>
}

function ArticleProgress({ progressRef }: ArticleProgressProps) {
  return (
    <div className="fixed left-0 right-0 top-[72px] z-40 h-0.5 bg-white/[0.06]">
      <div
        ref={progressRef}
        className="h-full bg-[linear-gradient(90deg,#c9a84c,#34a058)]"
      />
    </div>
  )
}

export default ArticleProgress
