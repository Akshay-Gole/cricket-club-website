import { z } from 'zod'
import prisma from '../../lib/prisma.js'

const PLAY_CRICKET_BASE_URL = 'https://grassrootsapiproxy.cricket.com.au'
const CLUB_NAME = "top g's cc"

function normaliseTeamName(teamName: string) {
  return teamName.toLowerCase().replaceAll('’', "'").replaceAll(/\s+/g, ' ')
}

function isTopGsTeam(teamName: string) {
  const normalised = normaliseTeamName(teamName)

  return normalised.includes(CLUB_NAME) || normalised.includes('top gs cc')
}

const summarySchema = z.object({
  matches: z.number().default(0),
  battingInnings: z.number().default(0),
  battingAggregate: z.number().default(0),
  battingNotOuts: z.number().default(0),
  batting50s: z.number().default(0),
  batting100s: z.number().default(0),
  batting0s: z.number().default(0),
  battingHighScore: z.number().default(0),
  isBattingHSNotOut: z.boolean().default(false),
  battingAverage: z.number().default(0),
  battingStrikeRate: z.number().default(0),
  battingFours: z.number().default(0),
  battingSixes: z.number().default(0),
  bowlingWickets: z.number().default(0),
  bowlingMaidens: z.number().default(0),
  bowlingRuns: z.number().default(0),
  bowlingBalls: z.number().default(0),
  bowling5WIs: z.number().default(0),
  bowling10WMs: z.number().default(0),
  bowlingOvers: z.string().default('0'),
  bowlingBestInnings: z.string().default('0-0'),
  bowlingAverage: z.number().default(0),
  bowlingStrikeRate: z.number().default(0),
  bowlingEconomyRate: z.number().default(0),
  bowlingWides: z.number().default(0),
  bowlingNoBalls: z.number().default(0),
  fieldingCatchesNonWK: z.number().default(0),
  fieldingCatchesWK: z.number().default(0),
  fieldingTotalCatches: z.number().default(0),
  fieldingStumpings: z.number().default(0),
  fieldingRunOuts: z.number().default(0),
})

const performanceSchema = z.object({
  id: z.string(),
  matchType: z.string().optional(),
  startDateTime: z.string(),
  grade: z
    .object({
      name: z.string().optional(),
    })
    .optional(),
  teams: z
    .array(
      z.object({
        displayName: z.string(),
        isHome: z.boolean(),
      })
    )
    .default([]),
  battingStatistics: z
    .array(
      z.object({
        ballsFaced: z.number().optional(),
        runsScored: z.number().optional(),
        foursScored: z.number().optional(),
        sixesScored: z.number().optional(),
        strikeRate: z.number().optional(),
        dismissalTypeId: z.number().optional(),
      })
    )
    .default([]),
  bowlingStatistics: z
    .array(
      z.object({
        oversBowled: z.string().optional(),
        maidensBowled: z.number().optional(),
        runsConceded: z.number().optional(),
        wicketsTaken: z.number().optional(),
        wideBalls: z.number().optional(),
        noBalls: z.number().optional(),
        economy: z.number().optional(),
      })
    )
    .default([]),
  fieldingStatistics: z
    .array(
      z.object({
        catches: z.number().optional(),
        stumpings: z.number().optional(),
      })
    )
    .default([]),
})

const performancesSchema = z.array(performanceSchema)

const seasonSchema = z.object({
  id: z.string(),
  name: z.string(),
  startDate: z.string(),
})

const seasonsSchema = z.array(seasonSchema)

function buildSummaryUrl(path: string) {
  const url = new URL(path, PLAY_CRICKET_BASE_URL)

  url.searchParams.set('seasonId', '')
  url.searchParams.set('organisationId', '')
  url.searchParams.set('matchTypeId', '')
  url.searchParams.set('jsconfig', 'eccn:true')

  return url
}

function buildPerformancesUrl(path: string, seasonId: string) {
  const url = new URL(path, PLAY_CRICKET_BASE_URL)

  url.searchParams.set('seasonId', seasonId)
  url.searchParams.set('matchTypeId', '')
  url.searchParams.set('jsconfig', 'eccn:true')

  return url
}

function buildSeasonsUrl(path: string) {
  const url = new URL(path, PLAY_CRICKET_BASE_URL)

  url.searchParams.set('jsconfig', 'eccn:true')

  return url
}

async function getPlayCricketJson(url: URL) {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Play Cricket request failed with ${response.status}`)
  }

  return response.json()
}

export async function fetchPlayCricketSummary(playCricketPlayerId: string) {
  const url = buildSummaryUrl(
    `/participants/players/${playCricketPlayerId}/summary-statistics`
  )

  return summarySchema.parse(await getPlayCricketJson(url))
}

async function fetchPlayCricketSeasons(playCricketPlayerId: string) {
  const url = buildSeasonsUrl(
    `/participants/players/${playCricketPlayerId}/seasons`
  )

  return seasonsSchema.parse(await getPlayCricketJson(url))
}

async function fetchPlayCricketPerformances(playCricketPlayerId: string) {
  const seasons = await fetchPlayCricketSeasons(playCricketPlayerId)
  const performances = await Promise.all(
    seasons.map(async season => {
      const url = buildPerformancesUrl(
        `/scores/players/${playCricketPlayerId}/match-performances`,
        season.id
      )

      try {
        return performancesSchema.parse(await getPlayCricketJson(url))
      } catch {
        return []
      }
    })
  )

  return performances
    .flat()
    .sort(
      (a, b) =>
        new Date(b.startDateTime).getTime() -
        new Date(a.startDateTime).getTime()
    )
}

export async function verifyPlayCricketPlayer(playCricketPlayerId: string) {
  const summary = await fetchPlayCricketSummary(playCricketPlayerId)

  return {
    matches: summary.matches,
    runs: summary.battingAggregate,
    wickets: summary.bowlingWickets,
  }
}

export async function syncPlayCricketPlayerStats(playerId: string) {
  const player = await prisma.player.findUnique({
    where: {
      id: playerId,
    },
  })

  if (!player) {
    throw new Error('Player not found')
  }

  if (!player.playCricketPlayerId) {
    throw new Error('Player does not have a Play Cricket ID')
  }

  const [summary, performances] = await Promise.all([
    fetchPlayCricketSummary(player.playCricketPlayerId),
    fetchPlayCricketPerformances(player.playCricketPlayerId),
  ])

  await prisma.playerCareerStats.upsert({
    where: {
      playerId: player.id,
    },
    update: {
      ...summary,
      syncedAt: new Date(),
    },
    create: {
      playerId: player.id,
      ...summary,
    },
  })

  await prisma.playerMatchPerformance.deleteMany({
    where: {
      playerId: player.id,
    },
  })

  const performanceRows = performances.flatMap(performance => {
    const ourTeam = performance.teams.find(team =>
      isTopGsTeam(team.displayName)
    )

    if (!ourTeam) return []

    const batting = performance.battingStatistics[0]
    const bowling = performance.bowlingStatistics[0]
    const fielding = performance.fieldingStatistics[0]
    const opponent = performance.teams.find(
      team => !isTopGsTeam(team.displayName)
    )

    return [
      {
        playerId: player.id,
        externalMatchId: performance.id,
        matchDate: new Date(performance.startDateTime),
        matchType: performance.matchType,
        gradeName: performance.grade?.name,
        homeTeam: ourTeam.displayName,
        awayTeam: opponent?.displayName,
        battingRuns: batting?.runsScored,
        battingBalls: batting?.ballsFaced,
        battingFours: batting?.foursScored,
        battingSixes: batting?.sixesScored,
        battingStrikeRate: batting?.strikeRate,
        battingDismissalTypeId: batting?.dismissalTypeId,
        bowlingOvers: bowling?.oversBowled,
        bowlingMaidens: bowling?.maidensBowled,
        bowlingRuns: bowling?.runsConceded,
        bowlingWickets: bowling?.wicketsTaken,
        bowlingWides: bowling?.wideBalls,
        bowlingNoBalls: bowling?.noBalls,
        bowlingEconomy: bowling?.economy,
        fieldingCatches: fielding?.catches,
        fieldingStumpings: fielding?.stumpings,
      },
    ]
  })

  if (performanceRows.length > 0) {
    await prisma.playerMatchPerformance.createMany({
      data: performanceRows,
    })
  }

  return prisma.player.findUniqueOrThrow({
    where: {
      id: player.id,
    },
    include: {
      careerStats: true,
      matchPerformances: {
        orderBy: {
          matchDate: 'desc',
        },
        take: 8,
      },
    },
  })
}

export async function syncAllPlayCricketPlayerStats() {
  const players = await prisma.player.findMany({
    where: {
      active: true,
      playCricketPlayerId: {
        not: null,
      },
    },
    select: {
      id: true,
      displayName: true,
      playCricketPlayerId: true,
    },
  })

  const synced: string[] = []
  const failed: { id: string; name: string; reason: string }[] = []

  for (const player of players) {
    try {
      await syncPlayCricketPlayerStats(player.id)
      synced.push(player.id)
    } catch (error) {
      failed.push({
        id: player.id,
        name: player.displayName,
        reason: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  return {
    total: players.length,
    synced: synced.length,
    failed: failed.length,
    failedPlayers: failed,
  }
}
