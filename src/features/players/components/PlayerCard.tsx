import { Link } from 'react-router-dom'
import { useMagneticTilt } from '../../../hooks/useMagneticTilt'
import type { Player } from '../types/player.types'
import { cloudinaryImage } from '../../../utils/cloudinaryImage'

// Map each role to its badge text, badge color classes, and avatar gradient classes
const roleConfig: Record<
  Player['role'],
  { label: string; badge: string; avatar: string }
> = {
  batsman: {
    label: 'Batsman',
    badge: 'bg-gold/[0.12] text-gold border-gold/25',
    avatar:
      'text-gold [background:radial-gradient(circle_at_30%_30%,#3a2a00,#1a1200)]',
  },
  bowler: {
    label: 'Bowler',
    badge: 'bg-[#e74c3c]/10 text-[#e07060] border-[#e74c3c]/20',
    avatar:
      'text-[#e07060] [background:radial-gradient(circle_at_30%_30%,#2a0d0a,#160604)]',
  },
  'all-rounder': {
    label: 'All-Rounder',
    badge: 'bg-green-light/[0.12] text-green-light border-green-light/30',
    avatar:
      'text-green-light [background:radial-gradient(circle_at_30%_30%,#0d2a18,#04160b)]',
  },
  'wicket-keeper': {
    label: 'Keeper',
    badge: 'bg-[#6482c8]/10 text-[#8ab0e8] border-[#6482c8]/20',
    avatar:
      'text-[#8ab0e8] [background:radial-gradient(circle_at_30%_30%,#0d1830,#04091a)]',
  },
}

function PlayerCard({ player }: { player: Player }) {
  const config = roleConfig[player.role]
  const initials = player.name.slice(0, 3).toUpperCase()
  const tiltRef = useMagneticTilt<HTMLAnchorElement>()

  return (
    <Link
      ref={tiltRef}
      to={`/players/${player.id}`}
      data-animate="card"
      className="group relative block overflow-hidden rounded-sm border border-white/[0.09] bg-[#171918] shadow-[0_14px_36px_rgba(0,0,0,0.3)] transition-colors duration-300 hover:border-gold/30 hover:bg-[#1b1d1b] will-change-transform"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_12%,rgba(201,168,76,0.075),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.018),transparent_45%)]"
      />

      {/* Big ghost jersey number */}
      <div className="absolute top-3 right-4 font-display text-[72px] text-gold/[0.16] leading-none pointer-events-none [text-shadow:0_0_24px_rgba(201,168,76,0.08)]">
        {player.jerseyNumber}
      </div>

      <div className="relative p-7 pt-8">
        {/* Role badge */}
        <div
          className={`inline-flex items-center font-heading text-[10px] font-bold tracking-[2.5px] uppercase px-2.5 py-1 rounded-sm border-[0.5px] mb-5 ${config.badge}`}
        >
          {config.label}
        </div>

        {/* Player photo with initials fallback + captain marker */}
        <div className="relative mb-[18px] h-20 w-20">
          <div
            className={`flex h-full w-full items-center justify-center overflow-hidden rounded-full border-[1.5px] border-gold/20 font-display text-2xl tracking-[1px] ${config.avatar}`}
          >
            {player.imageUrl ? (
              <img
                src={cloudinaryImage(
                  player.imageUrl,
                  'f_auto,q_auto,w_160,h_160,c_fill,g_auto'
                )}
                srcSet={`${cloudinaryImage(player.imageUrl, 'f_auto,q_auto,w_160,h_160,c_fill,g_auto')} 160w, ${cloudinaryImage(player.imageUrl, 'f_auto,q_auto,w_320,h_320,c_fill,g_auto')} 320w`}
                sizes="80px"
                alt={player.name}
                width="80"
                height="80"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          {player.isCaptain && (
            <div className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-dark bg-gold font-heading text-[9px] font-bold text-black">
              C
            </div>
          )}
        </div>

        {/* Name + meta */}
        <div className="font-heading text-[26px] font-bold tracking-[0.5px] text-[#e7e0d1] leading-[1.1] mb-0.5">
          {player.name}
        </div>
        <div className="font-body text-xs font-light text-muted mb-6">
          #{player.jerseyNumber} · {config.label}
        </div>

        {/* Stats row — 3 stats with dividers */}
        <div className="flex border-t-[0.5px] border-white/[0.08] pt-4">
          <div className="flex-1 text-center">
            <div className="font-display text-[26px] text-[#eee7d8] leading-none mb-1">
              {player.battingAverage}
            </div>
            <div className="font-heading text-[9px] font-semibold tracking-[1.5px] uppercase text-muted">
              Bat Avg
            </div>
          </div>
          <div className="flex-1 text-center border-l-[0.5px] border-white/[0.08]">
            <div className="font-display text-[26px] text-[#eee7d8] leading-none mb-1">
              {player.bestBowling}
            </div>
            <div className="font-heading text-[9px] font-semibold tracking-[1.5px] uppercase text-muted">
              Best Bowl
            </div>
          </div>
          <div className="flex-1 text-center border-l-[0.5px] border-white/[0.08]">
            <div className="font-display text-[26px] text-[#eee7d8] leading-none mb-1">
              {player.jerseyNumber}
            </div>
            <div className="font-heading text-[9px] font-semibold tracking-[1.5px] uppercase text-muted">
              Jersey
            </div>
          </div>
        </div>
      </div>

      {/* Gold underline follows mouse side via useMagneticTilt */}
      <span className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 bg-gold transition-transform duration-300 [transform-origin:var(--tilt-underline-origin,center)] group-hover:scale-x-100" />
    </Link>
  )
}

export default PlayerCard
