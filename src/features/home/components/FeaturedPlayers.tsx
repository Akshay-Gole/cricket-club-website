import { Link } from 'react-router-dom'
import { ROUTES } from '../../../constants/routes'

function FeaturedPlayers() {
  // STATIC placeholder data — swap for real players from API later (playersApi.getAll)
  // TODO: extract each card into a reusable <PlayerCard /> component (own ticket)
  const players = [
    {
      num: '03',
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
    <section className="bg-dark px-7 sm:px-12 py-16 sm:py-24">
      {/* Section header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
        <div>
          <div className="font-heading text-gold text-[11px] font-semibold tracking-[4px] uppercase mb-2">
            The Lineup
          </div>
          <h2 className="font-display text-white text-[clamp(40px,7vw,56px)] tracking-[1px] leading-none">
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
      <div className="grid grid-cols-1 min-[641px]:grid-cols-2 min-[901px]:grid-cols-3 min-[1025px]:grid-cols-5 gap-px bg-gold/15">
        {players.map(player => (
          <div
            key={player.name}
            className="relative bg-card px-5 py-7 text-center cursor-pointer overflow-hidden group"
          >
            {/* Jersey number — faint, top-right */}
            <div className="absolute top-4 right-4 font-display text-[28px] text-gold/[0.12]">
              {player.num}
            </div>

            {/* Avatar */}
            <div
              className="w-[72px] h-[72px] rounded-full border-[1.5px] border-gold/30 mx-auto mb-3.5 flex items-center justify-center font-display text-[22px] text-gold tracking-[1px]"
              style={{ background: player.avatarBg }}
            >
              {player.initials}
            </div>

            <div className="font-heading text-white text-base font-bold tracking-[0.5px] mb-1">
              {player.name}
            </div>
            <div className="font-heading text-gold text-[10px] font-semibold tracking-[2.5px] uppercase mb-3.5">
              {player.role}
            </div>
            <div className="font-display text-white text-[28px]">
              {player.stat}
            </div>
            <div className="font-body text-muted text-[11px] mt-0.5">
              {player.statLabel}
            </div>

            {/* Gold underline that grows on hover */}
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeaturedPlayers
