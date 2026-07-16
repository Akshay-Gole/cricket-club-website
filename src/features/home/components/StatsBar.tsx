import { useEffect, useState } from 'react'
import { useCountUp } from '../../../hooks/useCountUp'
import homeContentApi from '../api/homeContent.api'
import type { HomeContent } from '../api/homeContent.api'

interface StatItemProps {
  num: string
  label: string
  isLoading: boolean
  index: number
}

function StatItem({ num, label, isLoading, index }: StatItemProps) {
  const target = parseInt(num, 10)
  const ref = useCountUp({
    target: Number.isNaN(target) ? 0 : target,
    duration: 2,
    delay: index * 0.15,
  })

  return (
    <div className="py-7 text-center border-b border-white/10 min-[401px]:border-b-0 [&:not(:last-child)]:min-[901px]:border-r border-white/10">
      <div
        ref={isLoading ? undefined : ref}
        className="font-display text-gold text-[42px] sm:text-[46px] min-[901px]:text-[52px] leading-none mb-1.5"
      >
        <span className={isLoading ? 'animate-pulse text-gold/45' : ''}>
          {num}
        </span>
      </div>
      <div className="font-heading text-white/50 text-[11px] font-semibold tracking-[3px] uppercase">
        {label}
      </div>
    </div>
  )
}

function StatsBar() {
  const [content, setContent] = useState<HomeContent | null>(null)

  useEffect(() => {
    let isMounted = true

    homeContentApi
      .getPublic()
      .then(content => {
        if (isMounted) setContent(content)
      })
      .catch(() => {
        if (isMounted) setContent(null)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const stats = content
    ? [
        { num: content.matchesPlayed, label: 'Matches Played' },
        { num: content.victories, label: 'Victories' },
        { num: content.trophies, label: 'Trophies' },
        { num: content.activePlayers, label: 'Active Players' },
        { num: content.yearsActive, label: 'Years Active' },
      ]
    : [
        { num: '—', label: 'Matches Played' },
        { num: '—', label: 'Victories' },
        { num: '—', label: 'Trophies' },
        { num: '—', label: 'Active Players' },
        { num: '—', label: 'Years Active' },
      ]

  return (
    <div
      data-animate="stagger"
      className="bg-green border-y border-gold/30 px-7 sm:px-12 grid grid-cols-1 min-[401px]:grid-cols-2 min-[641px]:grid-cols-3 min-[901px]:grid-cols-5"
    >
      {stats.map((stat, i) => (
        <StatItem
          key={stat.label}
          num={stat.num}
          label={stat.label}
          isLoading={!content}
          index={i}
        />
      ))}
    </div>
  )
}

export default StatsBar
