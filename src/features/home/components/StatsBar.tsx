import { useCountUp } from '../../../hooks/useCountUp'

interface StatItemProps {
  num: string
  label: string
  index: number
}

function StatItem({ num, label, index }: StatItemProps) {
  const target = parseInt(num, 10)
  const ref = useCountUp({ target, duration: 2, delay: index * 0.15 })

  return (
    <div className="py-7 text-center border-b border-white/10 min-[401px]:border-b-0 [&:not(:last-child)]:min-[901px]:border-r border-white/10">
      <div
        ref={ref}
        className="font-display text-gold text-[42px] sm:text-[46px] min-[901px]:text-[52px] leading-none mb-1.5"
      >
        {num}
      </div>
      <div className="font-heading text-white/50 text-[11px] font-semibold tracking-[3px] uppercase">
        {label}
      </div>
    </div>
  )
}

function StatsBar() {
  // STATIC placeholder data — swap for real club stats from API later
  const stats = [
    { num: '48', label: 'Matches Played' },
    { num: '31', label: 'Victories' },
    { num: '06', label: 'Trophies' },
    { num: '22', label: 'Active Players' },
    { num: '01', label: 'Years Active' },
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
          index={i}
        />
      ))}
    </div>
  )
}

export default StatsBar
