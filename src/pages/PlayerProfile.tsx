import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import ProfileHero from '../features/players/components/profile/ProfileHero'
import ProfileTabs from '../features/players/components/profile/ProfileTabs'
import playersApi from '../features/players/api/players.api'
import type { Player } from '../features/players/types/player.types'
import type { PlayerProfile as PlayerProfileData } from '../features/players/types/playerProfile.types'

function toProfilePlayer(player: Player): PlayerProfileData {
  const nameParts = player.name.trim().split(/\s+/)
  const shortName =
    nameParts[nameParts.length - 1]?.toUpperCase() || player.name
  const stats = player.careerStats
  const recentPerformances = player.recentPerformances ?? []
  const recentInnings = recentPerformances
    .filter(performance => performance.battingRuns != null)
    .map((performance, index) => ({
      match: `M${index + 1}`,
      opponent: performance.awayTeam ?? performance.homeTeam ?? 'OPP',
      runs: performance.battingRuns ?? 0,
      balls: performance.battingBalls ?? 0,
    }))
    .slice(0, 8)
    .reverse()

  const recentBowling = recentPerformances
    .filter(performance => performance.bowlingOvers)
    .map((performance, index) => ({
      match: `M${index + 1}`,
      opponent: performance.awayTeam ?? performance.homeTeam ?? 'OPP',
      wickets: performance.bowlingWickets ?? 0,
      runs: performance.bowlingRuns ?? 0,
      overs: performance.bowlingOvers ?? '0',
    }))
    .slice(0, 8)
    .reverse()

  return {
    id: player.id,
    name: shortName,
    fullName: player.name,
    jerseyNumber: player.jerseyNumber,
    role: player.role,
    isCaptain: player.isCaptain,

    runs: stats?.battingAggregate ?? 0,
    wickets: stats?.bowlingWickets ?? 0,
    highScore: stats?.battingHighScore ?? 0,
    battingAverage: stats?.battingAverage ?? player.battingAverage,
    bowlingAverage: stats?.bowlingAverage ?? 0,
    matches: stats?.matches ?? 0,

    battingStyle: 'To be updated',
    bowlingStyle: 'To be updated',
    debut: 'To be updated',
    bestBowling: stats?.bowlingBestInnings ?? player.bestBowling,
    fiftiesHundreds: `${stats?.batting50s ?? 0} / ${stats?.batting100s ?? 0}`,
    catches: stats?.fieldingTotalCatches ?? 0,

    batting: {
      innings: stats?.battingInnings ?? 0,
      runs: stats?.battingAggregate ?? 0,
      highScore: stats?.battingHighScore ?? 0,
      average: stats?.battingAverage ?? player.battingAverage,
      strikeRate: stats?.battingStrikeRate ?? 0,
      fifties: stats?.batting50s ?? 0,
      hundreds: stats?.batting100s ?? 0,
    },

    bowling: {
      overs: Number(stats?.bowlingOvers ?? 0),
      wickets: stats?.bowlingWickets ?? 0,
      bestBowling: stats?.bowlingBestInnings ?? player.bestBowling,
      average: stats?.bowlingAverage ?? 0,
      economy: stats?.bowlingEconomyRate ?? 0,
      fiveWickets: stats?.bowling5WIs ?? 0,
    },

    recentInnings,
    recentBowling,
  }
}

function PlayerProfile() {
  const { id } = useParams()
  const [player, setPlayer] = useState<PlayerProfileData | null>(null)
  const [isLoadingPlayer, setIsLoadingPlayer] = useState(true)
  const [playerError, setPlayerError] = useState('')

  useEffect(() => {
    async function loadPlayer() {
      if (!id) {
        setPlayerError('Player not found')
        setIsLoadingPlayer(false)
        return
      }

      try {
        setIsLoadingPlayer(true)
        setPlayerError('')

        const fetchedPlayer = await playersApi.getById(id)
        setPlayer(toProfilePlayer(fetchedPlayer))
      } catch {
        setPlayerError('Player not found')
      } finally {
        setIsLoadingPlayer(false)
      }
    }

    loadPlayer()
  }, [id])

  if (isLoadingPlayer) {
    return (
      <div className="px-5 py-24 text-center sm:px-7 lg:px-12">
        <p className="font-display text-5xl tracking-[3px] text-white/5">
          Loading Player
        </p>
      </div>
    )
  }

  if (playerError || !player) {
    return (
      <div className="px-5 py-24 text-center sm:px-7 lg:px-12">
        <p className="font-display text-5xl tracking-[3px] text-white/5">
          Player Not Found
        </p>

        <Link
          to={ROUTES.SQUAD}
          className="mt-6 inline-flex font-heading text-[11px] font-bold uppercase tracking-[2.5px] text-gold"
        >
          Back to squad →
        </Link>
      </div>
    )
  }

  return (
    <div className="pb-20">
      {/* BREADCRUMB */}
      <div
        data-animate="hero"
        className="flex flex-wrap items-center gap-2.5 px-5 sm:px-7 lg:px-12 py-4 sm:py-[18px] lg:py-5 font-heading text-[10px] sm:text-[11px] font-semibold tracking-[2px] uppercase"
      >
        <Link
          to={ROUTES.HOME}
          className="text-muted hover:text-gold transition-colors"
        >
          Home
        </Link>
        <span className="text-muted opacity-40">/</span>
        <Link
          to={ROUTES.SQUAD}
          className="text-muted hover:text-gold transition-colors"
        >
          Squad
        </Link>
        <span className="text-muted opacity-40">/</span>
        <span className="text-gold">{player.fullName}</span>
      </div>

      {/* PROFILE HERO */}
      <ProfileHero player={player} />
      <ProfileTabs player={player} />
    </div>
  )
}

export default PlayerProfile
