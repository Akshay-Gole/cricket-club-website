import { z } from 'zod'
import { Router } from 'express'
import type { Fixture as DbFixture } from '@prisma/client'
import prisma from '../lib/prisma.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

const fixtureResults = [
  'upcoming',
  'won',
  'lost',
  'draw',
  'abandoned',
  'forfeited',
] as const

const fixtureSchema = z.object({
  homeTeam: z.string().trim().min(1),
  awayTeam: z.string().trim().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().trim().min(1),
  venue: z.string().trim().min(1),
  venueGoogleUrl: z.string().trim().url().or(z.literal('')).optional(),
  scoreboardUrl: z.string().trim().url().or(z.literal('')).optional(),
  result: z.enum(fixtureResults),
  ourScore: z.string().trim().optional(),
  oppScore: z.string().trim().optional(),
})

function normaliseTeamName(teamName: string) {
  return teamName.toLowerCase().replaceAll('’', "'")
}

function isTopGsTeam(teamName: string) {
  const normalised = normaliseTeamName(teamName)

  return normalised.includes("top g's") || normalised.includes('top gs')
}

function fixtureDate(date: string) {
  return new Date(`${date}T00:00:00.000Z`)
}

function fixtureSeason(date: string) {
  return date.slice(0, 4)
}

function formatFixtureDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

function createFixtureBadge(
  result: string,
  ourScore?: string | null,
  oppScore?: string | null
) {
  if (result === 'upcoming') return 'Upcoming'
  if (result === 'draw') return 'Draw'
  if (result === 'abandoned') return 'Abandoned'
  if (result === 'forfeited') return 'Forfeited'

  const ourRuns = Number(ourScore?.split('/')[0]?.trim())
  const oppRuns = Number(oppScore?.split('/')[0]?.trim())

  if (Number.isNaN(ourRuns) || Number.isNaN(oppRuns)) {
    return result === 'won' ? 'Won' : 'Lost'
  }

  const margin = Math.abs(ourRuns - oppRuns)

  return result === 'won' ? `Won +${margin}` : `Lost −${margin}`
}

function toApiFixture(fixture: DbFixture) {
  const date = formatFixtureDate(fixture.matchDate)
  const matchDate = new Date(`${date}T00:00:00`)

  return {
    id: fixture.id,
    homeTeam: fixture.homeTeam,
    awayTeam: fixture.awayTeam,
    date,
    time: fixture.time,
    venue: fixture.venueName,
    venueGoogleUrl: fixture.venueGoogleUrl,
    scoreboardUrl: fixture.scoreboardUrl,
    playHqUrl: fixture.scoreboardUrl,
    season: fixture.season,
    result: fixture.result,
    ourScore: fixture.ourScore,
    oppScore: fixture.oppScore,
    month: matchDate.toLocaleString('en-AU', {
      month: 'long',
      year: 'numeric',
    }),
    day: String(matchDate.getDate()).padStart(2, '0'),
    monthShort: matchDate.toLocaleString('en-AU', {
      month: 'short',
    }),
    isHome: isTopGsTeam(fixture.homeTeam),
    badge: createFixtureBadge(
      fixture.result,
      fixture.ourScore,
      fixture.oppScore
    ),
  }
}

router.get('/fixtures', async (_req, res, next) => {
  try {
    const season =
      typeof _req.query.season === 'string' ? _req.query.season : undefined
    const result =
      typeof _req.query.result === 'string' ? _req.query.result : undefined

    const fixtures = await prisma.fixture.findMany({
      where: {
        active: true,
        ...(season ? { season } : {}),
        ...(result && result !== 'all' ? { result } : {}),
      },
      orderBy: {
        matchDate: 'desc',
      },
    })

    res.status(200).json({
      data: fixtures.map(toApiFixture),
    })
  } catch (error) {
    next(error)
  }
})

router.get('/fixtures/:id', async (_req, res, next) => {
  try {
    const fixtureId = String(_req.params.id)

    const fixture = await prisma.fixture.findFirst({
      where: {
        id: fixtureId,
        active: true,
      },
    })

    if (!fixture) {
      res.status(404).json({
        message: 'Fixture not found',
      })
      return
    }

    res.status(200).json({
      data: toApiFixture(fixture),
    })
  } catch (error) {
    next(error)
  }
})

router.get('/admin/fixtures', requireAuth, async (_req, res, next) => {
  try {
    const fixtures = await prisma.fixture.findMany({
      where: {
        active: true,
      },
      orderBy: {
        matchDate: 'desc',
      },
    })

    res.status(200).json({
      data: fixtures.map(toApiFixture),
    })
  } catch (error) {
    next(error)
  }
})

router.post('/admin/fixtures', requireAuth, async (_req, res, next) => {
  try {
    const result = fixtureSchema.safeParse(_req.body)

    if (!result.success) {
      res.status(400).json({
        message: 'Invalid fixture data',
        errors: z.treeifyError(result.error),
      })
      return
    }

    const fixture = await prisma.fixture.create({
      data: {
        homeTeam: result.data.homeTeam,
        awayTeam: result.data.awayTeam,
        matchDate: fixtureDate(result.data.date),
        time: result.data.time,
        venueName: result.data.venue,
        venueGoogleUrl: result.data.venueGoogleUrl || null,
        scoreboardUrl: result.data.scoreboardUrl || null,
        season: fixtureSeason(result.data.date),
        result: result.data.result,
        ourScore: result.data.ourScore || null,
        oppScore: result.data.oppScore || null,
      },
    })

    res.status(201).json({
      data: toApiFixture(fixture),
    })
  } catch (error) {
    next(error)
  }
})

router.patch('/admin/fixtures/:id', requireAuth, async (_req, res, next) => {
  try {
    const fixtureId = String(_req.params.id)
    const result = fixtureSchema.safeParse(_req.body)

    if (!result.success) {
      res.status(400).json({
        message: 'Invalid fixture data',
        errors: z.treeifyError(result.error),
      })
      return
    }

    const fixture = await prisma.fixture.update({
      where: {
        id: fixtureId,
      },
      data: {
        homeTeam: result.data.homeTeam,
        awayTeam: result.data.awayTeam,
        matchDate: fixtureDate(result.data.date),
        time: result.data.time,
        venueName: result.data.venue,
        venueGoogleUrl: result.data.venueGoogleUrl || null,
        scoreboardUrl: result.data.scoreboardUrl || null,
        season: fixtureSeason(result.data.date),
        result: result.data.result,
        ourScore: result.data.ourScore || null,
        oppScore: result.data.oppScore || null,
      },
    })

    res.status(200).json({
      data: toApiFixture(fixture),
    })
  } catch (error) {
    next(error)
  }
})

router.delete('/admin/fixtures/:id', requireAuth, async (_req, res, next) => {
  try {
    const fixtureId = String(_req.params.id)

    await prisma.fixture.update({
      where: {
        id: fixtureId,
      },
      data: {
        active: false,
      },
    })

    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default router
