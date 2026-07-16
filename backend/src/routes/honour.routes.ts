import { Router } from 'express'
import { z } from 'zod'
import type { Fixture, Player, PlayerCareerStats } from '@prisma/client'
import prisma from '../lib/prisma.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

const trophySchema = z.object({
  year: z.coerce.number().int().min(1900).max(2100),
  title: z.string().trim().min(1),
  type: z.string().trim().min(1).default('Trophy'),
  description: z.string().trim().min(1),
  featured: z.boolean().default(true),
})

const awardSchema = z.object({
  season: z.string().trim().min(1),
  award: z.string().trim().min(1),
  name: z.string().trim().min(1),
  detail: z.string().trim().optional().default(''),
  featured: z.boolean().default(true),
})

const manualRecordSchema = z.object({
  label: z.string().trim().min(1),
  value: z.string().trim().min(1),
  meta: z.string().trim().optional().default(''),
  featured: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
})

const MANUAL_RECORD_TEMPLATES = [
  {
    id: 'highest-partnership',
    label: 'Highest partnership',
    sortOrder: 30,
  },
  {
    id: 'most-season-runs',
    label: 'Most season runs',
    sortOrder: 50,
  },
  {
    id: 'most-season-wickets',
    label: 'Most season wickets',
    sortOrder: 60,
  },
  {
    id: 'most-catches',
    label: 'Most catches',
    sortOrder: 70,
  },
]

function routeParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : (value ?? '')
}

function parseRuns(score?: string | null) {
  const runs = Number(score?.match(/\d+/)?.[0])
  return Number.isFinite(runs) ? runs : null
}

function parseBestBowling(value?: string | null) {
  const [wicketsValue, runsValue] = value?.replace('/', '-').split('-') ?? []
  const wickets = Number(wicketsValue)
  const runs = Number(runsValue)

  if (!Number.isFinite(wickets) || !Number.isFinite(runs)) return null

  return {
    wickets,
    runs,
    display: `${wickets}/${runs}`,
  }
}

function playerName(player: Player) {
  return `${player.firstName} ${player.lastName}`.trim()
}

function bestFixtureByTeamScore(fixtures: Fixture[]) {
  return fixtures.reduce<Fixture | null>((best, fixture) => {
    const runs = parseRuns(fixture.ourScore)
    const bestRuns = parseRuns(best?.ourScore)

    if (runs === null) return best
    if (bestRuns === null || runs > bestRuns) return fixture

    return best
  }, null)
}

function bestFixtureByWinMargin(fixtures: Fixture[]) {
  return fixtures.reduce<Fixture | null>((best, fixture) => {
    const runs = parseRuns(fixture.ourScore)
    const oppRuns = parseRuns(fixture.oppScore)
    const bestRuns = parseRuns(best?.ourScore)
    const bestOppRuns = parseRuns(best?.oppScore)

    if (runs === null || oppRuns === null) return best

    const margin = runs - oppRuns
    const bestMargin =
      bestRuns === null || bestOppRuns === null ? null : bestRuns - bestOppRuns

    if (bestMargin === null || margin > bestMargin) return fixture

    return best
  }, null)
}

function bestBowling(
  players: (Player & { careerStats: PlayerCareerStats | null })[]
) {
  return players.reduce<{
    value: string
    meta: string
    wickets: number
    runs: number
  } | null>((best, player) => {
    const bowling = parseBestBowling(player.careerStats?.bowlingBestInnings)

    if (!bowling || bowling.wickets <= 0) return best

    if (
      !best ||
      bowling.wickets > best.wickets ||
      (bowling.wickets === best.wickets && bowling.runs < best.runs)
    ) {
      return {
        value: bowling.display,
        meta: playerName(player),
        wickets: bowling.wickets,
        runs: bowling.runs,
      }
    }

    return best
  }, null)
}

function highestIndividualScore(
  players: (Player & { careerStats: PlayerCareerStats | null })[]
) {
  return players.reduce<{ value: string; meta: string } | null>(
    (best, player) => {
      const highScore = player.careerStats?.battingHighScore ?? 0

      if (highScore <= 0) return best
      if (best && highScore <= Number(best.value.replace('*', ''))) return best

      return {
        value: `${highScore}${player.careerStats?.isBattingHSNotOut ? '*' : ''}`,
        meta: playerName(player),
      }
    },
    null
  )
}

async function getHonoursData() {
  const [
    trophies,
    awardWinners,
    manualRecords,
    finalFixturesCount,
    fixtures,
    players,
  ] = await Promise.all([
    prisma.honourTrophy.findMany({
      where: { active: true },
      orderBy: [{ featured: 'desc' }, { year: 'desc' }, { createdAt: 'desc' }],
    }),
    prisma.honourAwardWinner.findMany({
      where: { active: true },
      orderBy: [
        { featured: 'desc' },
        { season: 'desc' },
        { createdAt: 'desc' },
      ],
    }),
    prisma.honourManualRecord.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    }),
    prisma.fixture.count({
      where: {
        active: true,
        matchLabel: {
          equals: 'Grand Final',
          mode: 'insensitive',
        },
      },
    }),
    prisma.fixture.findMany({
      where: {
        active: true,
        result: {
          in: ['won', 'lost', 'draw'],
        },
      },
      orderBy: { matchDate: 'desc' },
    }),
    prisma.player.findMany({
      where: { active: true },
      include: { careerStats: true },
    }),
  ])

  const highestTeamScore = bestFixtureByTeamScore(fixtures)
  const biggestWin = bestFixtureByWinMargin(
    fixtures.filter(fixture => fixture.result === 'won')
  )
  const bestBowlingRecord = bestBowling(players)
  const highScoreRecord = highestIndividualScore(players)

  const automaticRecords = [
    {
      id: 'highest-team-score',
      label: 'Highest team score',
      value: highestTeamScore?.ourScore ?? '—',
      meta: highestTeamScore
        ? `vs ${highestTeamScore.homeTeam.toLowerCase().includes('top g') ? highestTeamScore.awayTeam : highestTeamScore.homeTeam}`
        : 'No completed match yet',
      featured: true,
      source: 'automatic',
    },
    {
      id: 'best-bowling',
      label: 'Best bowling',
      value: bestBowlingRecord?.value ?? '—',
      meta: bestBowlingRecord?.meta ?? 'No bowling data yet',
      featured: true,
      source: 'automatic',
    },
    {
      id: 'highest-individual-score',
      label: 'Highest individual score',
      value: highScoreRecord?.value ?? '—',
      meta: highScoreRecord?.meta ?? 'No batting data yet',
      featured: true,
      source: 'automatic',
    },
    {
      id: 'biggest-win',
      label: 'Biggest win',
      value: biggestWin
        ? `+${(parseRuns(biggestWin.ourScore) ?? 0) - (parseRuns(biggestWin.oppScore) ?? 0)}`
        : '—',
      meta: biggestWin
        ? `vs ${biggestWin.homeTeam.toLowerCase().includes('top g') ? biggestWin.awayTeam : biggestWin.homeTeam}`
        : 'No win recorded yet',
      featured: true,
      source: 'automatic',
    },
  ]

  const records = [
    ...automaticRecords,
    ...manualRecords.map(record => ({
      id: record.id,
      label: record.label,
      value: record.value,
      meta: record.meta ?? '',
      featured: record.featured,
      source: 'manual',
      sortOrder: record.sortOrder,
    })),
  ]

  return {
    snapshot: {
      clubTrophies: trophies.length,
      finalsPlayed: finalFixturesCount,
      awardWinners: awardWinners.length,
    },
    trophies: trophies.map(trophy => ({
      id: trophy.id,
      year: String(trophy.year),
      title: trophy.title,
      type: trophy.type,
      description: trophy.description,
      featured: trophy.featured,
    })),
    awardWinners: awardWinners.map(award => ({
      id: award.id,
      season: award.season,
      award: award.award,
      name: award.name,
      detail: award.detail ?? '',
      featured: award.featured,
    })),
    records,
    manualRecordTemplates: MANUAL_RECORD_TEMPLATES,
  }
}

router.get('/honours', async (_req, res, next) => {
  try {
    res.status(200).json({
      data: await getHonoursData(),
    })
  } catch (error) {
    next(error)
  }
})

router.get('/admin/honours', requireAuth, async (_req, res, next) => {
  try {
    res.status(200).json({
      data: await getHonoursData(),
    })
  } catch (error) {
    next(error)
  }
})

router.post('/admin/honours/trophies', requireAuth, async (_req, res, next) => {
  try {
    const result = trophySchema.safeParse(_req.body)

    if (!result.success) {
      res.status(400).json({
        message: 'Invalid trophy data',
        errors: z.treeifyError(result.error),
      })
      return
    }

    await prisma.honourTrophy.create({ data: result.data })

    res.status(201).json({
      data: await getHonoursData(),
    })
  } catch (error) {
    next(error)
  }
})

router.patch(
  '/admin/honours/trophies/:id',
  requireAuth,
  async (_req, res, next) => {
    try {
      const result = trophySchema.safeParse(_req.body)

      if (!result.success) {
        res.status(400).json({
          message: 'Invalid trophy data',
          errors: z.treeifyError(result.error),
        })
        return
      }

      const id = routeParam(_req.params.id)

      await prisma.honourTrophy.update({
        where: { id },
        data: result.data,
      })

      res.status(200).json({
        data: await getHonoursData(),
      })
    } catch (error) {
      next(error)
    }
  }
)

router.delete(
  '/admin/honours/trophies/:id',
  requireAuth,
  async (_req, res, next) => {
    try {
      const id = routeParam(_req.params.id)

      await prisma.honourTrophy.update({
        where: { id },
        data: { active: false },
      })

      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
)

router.post('/admin/honours/awards', requireAuth, async (_req, res, next) => {
  try {
    const result = awardSchema.safeParse(_req.body)

    if (!result.success) {
      res.status(400).json({
        message: 'Invalid award data',
        errors: z.treeifyError(result.error),
      })
      return
    }

    await prisma.honourAwardWinner.create({ data: result.data })

    res.status(201).json({
      data: await getHonoursData(),
    })
  } catch (error) {
    next(error)
  }
})

router.patch(
  '/admin/honours/awards/:id',
  requireAuth,
  async (_req, res, next) => {
    try {
      const result = awardSchema.safeParse(_req.body)

      if (!result.success) {
        res.status(400).json({
          message: 'Invalid award data',
          errors: z.treeifyError(result.error),
        })
        return
      }

      const id = routeParam(_req.params.id)

      await prisma.honourAwardWinner.update({
        where: { id },
        data: result.data,
      })

      res.status(200).json({
        data: await getHonoursData(),
      })
    } catch (error) {
      next(error)
    }
  }
)

router.delete(
  '/admin/honours/awards/:id',
  requireAuth,
  async (_req, res, next) => {
    try {
      const id = routeParam(_req.params.id)

      await prisma.honourAwardWinner.update({
        where: { id },
        data: { active: false },
      })

      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
)

router.put(
  '/admin/honours/manual-records/:id',
  requireAuth,
  async (_req, res, next) => {
    try {
      const result = manualRecordSchema.safeParse(_req.body)

      if (!result.success) {
        res.status(400).json({
          message: 'Invalid record data',
          errors: z.treeifyError(result.error),
        })
        return
      }

      const id = routeParam(_req.params.id)

      await prisma.honourManualRecord.upsert({
        where: { id },
        update: result.data,
        create: {
          id,
          ...result.data,
        },
      })

      res.status(200).json({
        data: await getHonoursData(),
      })
    } catch (error) {
      next(error)
    }
  }
)

router.delete(
  '/admin/honours/manual-records/:id',
  requireAuth,
  async (_req, res, next) => {
    try {
      const id = routeParam(_req.params.id)

      await prisma.honourManualRecord.update({
        where: { id },
        data: { active: false },
      })

      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
)

export default router
