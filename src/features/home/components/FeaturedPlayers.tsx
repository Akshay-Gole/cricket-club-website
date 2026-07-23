import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../../constants/routes'
import type { Player } from '../../players/types/player.types'
import FeaturedPlayerCard, { type FeaturedPlayer } from './FeaturedPlayerCard'
import { playersQuery } from '../../../lib/queryOptions'

function getRoleLabel(role: Player['role']) {
  const labels: Record<Player['role'], string> = {
    batsman: 'Batsman',
    bowler: 'Bowler',
    'all-rounder': 'All-Rounder',
    'wicket-keeper': 'Wkt-Keeper',
  }

  return labels[role]
}

function getAvatarBg(role: Player['role']) {
  const backgrounds: Record<Player['role'], string> = {
    batsman: '#0d3a1e',
    bowler: '#2a1800',
    'all-rounder': 'var(--color-green)',
    'wicket-keeper': '#1a0d2e',
  }

  return backgrounds[role]
}

function getFeaturedMetric(player: Player) {
  if (player.featuredStatValue && player.featuredStatLabel) {
    return {
      stat: player.featuredStatValue,
      statLabel: player.featuredStatLabel,
    }
  }

  if (player.role === 'bowler') {
    return {
      stat: String(player.careerStats?.bowlingWickets ?? 0),
      statLabel: 'Wickets taken',
    }
  }

  if (player.role === 'wicket-keeper') {
    return {
      stat: String(
        (player.careerStats?.fieldingCatchesWK ?? 0) +
          (player.careerStats?.fieldingStumpings ?? 0)
      ),
      statLabel: 'Dismissals',
    }
  }

  return {
    stat: String(player.careerStats?.battingAggregate ?? 0),
    statLabel: 'Runs this season',
  }
}

function toFeaturedPlayer(player: Player): FeaturedPlayer {
  const metric = getFeaturedMetric(player)

  return {
    id: player.id,
    num: String(player.jerseyNumber).padStart(2, '0'),
    initials: player.name.slice(0, 3).toUpperCase(),
    imageUrl: player.imageUrl,
    avatarBg: getAvatarBg(player.role),
    name: player.name,
    role: getRoleLabel(player.role),
    ...metric,
  }
}

function FeaturedPlayers() {
  const { data: players = [] } = useQuery({
    ...playersQuery,
    select: allPlayers =>
      allPlayers
        .filter(player => player.isFeatured)
        .slice(0, 5)
        .map(toFeaturedPlayer),
  })

  if (players.length === 0) return null

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
