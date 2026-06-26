import { Link } from 'react-router-dom'
import { ROUTES } from '../../../constants/routes'
import FeaturedPlayerCard, { type FeaturedPlayer } from './FeaturedPlayerCard'

function FeaturedPlayers() {
  // STATIC placeholder data — swap for real players from API later (playersApi.getAll)
  // TODO: extract each card into a reusable <PlayerCard /> component (own ticket)
  const players: FeaturedPlayer[] = [
    {
      num: '01',
      initials: 'AKS',
      avatarBg: 'var(--color-green)',
      name: 'Akshay Gole',
      role: 'All-Rounder',
      stat: '847',
      statLabel: 'Runs this season',
    },
    {
      num: '07',
      initials: 'JNS',
      avatarBg: '#0d3a1e',
      name: 'Jones',
      role: 'Batsman',
      stat: '612',
      statLabel: 'Runs this season',
    },
    {
      num: '11',
      initials: 'RYN',
      avatarBg: '#2a1800',
      name: 'Ryan',
      role: 'Bowler',
      stat: '34',
      statLabel: 'Wickets taken',
    },
    {
      num: '02',
      initials: 'MCH',
      avatarBg: '#1a0d2e',
      name: 'Mitchell',
      role: 'Wkt-Keeper',
      stat: '28',
      statLabel: 'Dismissals',
    },
    {
      num: '05',
      initials: 'PRS',
      avatarBg: '#1a1a00',
      name: 'Parsons',
      role: 'Bowler',
      stat: '29',
      statLabel: 'Wickets taken',
    },
  ]

  return (
    <section
      data-animate="reveal"
      className="relative overflow-hidden border-y border-green-light/10 bg-[#090d0a] px-7 py-16 sm:px-12 sm:py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(52,160,88,0.12),transparent_32%),radial-gradient(circle_at_12%_90%,rgba(201,168,76,0.07),transparent_30%)]" />

      {/* Section header */}
      <div className="relative z-[1] flex flex-wrap items-end justify-between gap-4 mb-12">
        <div>
          <div className="font-heading text-gold text-[11px] font-semibold tracking-[4px] uppercase mb-2">
            The Lineup
          </div>
          <h2 className="font-display text-[#efe9dc] text-[clamp(40px,7vw,56px)] tracking-[1px] leading-none">
            Featured Players
          </h2>
        </div>
        <Link
          to={ROUTES.SQUAD}
          className="font-heading text-gold text-xs font-semibold tracking-[2.5px] uppercase border-b border-gold/30 pb-0.5 hover:border-gold transition-colors"
        >
          Full Squad →
        </Link>
      </div>

      {/* Player strip — 1px gap divider trick */}
      <div className="relative z-[1] grid grid-cols-1 min-[641px]:grid-cols-2 min-[901px]:grid-cols-3 min-[1025px]:grid-cols-5 gap-6">
        {players.map(player => (
          <FeaturedPlayerCard key={player.name} player={player} />
        ))}
      </div>
    </section>
  )
}

export default FeaturedPlayers
