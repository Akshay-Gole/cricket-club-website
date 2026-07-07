import { Link } from 'react-router-dom'
import { useMagneticTilt } from '../../../hooks/useMagneticTilt'

export interface FeaturedPlayer {
  id: string
  num: string
  initials: string
  avatarBg: string
  name: string
  role: string
  stat: string
  statLabel: string
}

function FeaturedPlayerCard({ player }: { player: FeaturedPlayer }) {
  const tiltRef = useMagneticTilt<HTMLAnchorElement>()

  return (
    <Link
      to={`/players/${player.id}`}
      ref={tiltRef}
      data-animate="card"
      className="group relative block cursor-pointer overflow-hidden rounded-sm border border-white/[0.09] bg-[#171918] px-5 py-7 text-center no-underline shadow-[0_14px_36px_rgba(0,0,0,0.3)] transition-colors duration-300 will-change-transform hover:border-gold/30 hover:bg-[#1b1d1b]"
    >
      <div className="absolute right-4 top-4 font-display text-[28px] text-gold/[0.52]">
        {player.num}
      </div>

      <div
        className="mx-auto mb-3.5 flex h-[72px] w-[72px] items-center justify-center rounded-full border-[1.5px] border-gold/30 font-display text-[22px] tracking-[1px] text-gold"
        style={{ background: player.avatarBg }}
      >
        {player.initials}
      </div>

      <div className="mb-1 font-heading text-base font-bold tracking-[0.5px] text-[#e7e0d1]">
        {player.name}
      </div>
      <div className="mb-3.5 font-heading text-[10px] font-semibold uppercase tracking-[2.5px] text-gold">
        {player.role}
      </div>
      <div className="font-display text-[28px] text-[#eee7d8]">
        {player.stat}
      </div>
      <div className="mt-0.5 font-body text-[11px] text-muted">
        {player.statLabel}
      </div>

      <span className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 bg-gold transition-transform duration-300 [transform-origin:var(--tilt-underline-origin,center)] group-hover:scale-x-100" />
    </Link>
  )
}

export default FeaturedPlayerCard
