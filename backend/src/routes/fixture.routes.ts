import { z } from 'zod'
import { Router } from 'express'
import type { Fixture as DbFixture } from '@prisma/client'
import prisma from '../lib/prisma.js'
import { getPlayHqFixtureResult } from '../features/fixtures/playhq-fixture.service.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

const RESULT_READY_DELAY_MS = 6 * 60 * 60 * 1000

const fixtureSchema = z.object({
  homeTeam: z.string().trim().min(1),
  awayTeam: z.string().trim().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().trim().min(1),
  venue: z.string().trim().min(1),
  venueGoogleUrl: z.string().trim().url().or(z.literal('')).optional(),
  scoreboardUrl: z.string().trim().url().or(z.literal('')).optional(),
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

function fixtureDateTime(date: string, time: string) {
  const [, hourValue = '0', minuteValue = '0'] =
    time.match(/^(\d{1,2}):(\d{2})/) ?? []
  const hour = Number(hourValue)
  const minute = Number(minuteValue)
  const value = new Date(`${date}T00:00:00`)

  value.setHours(hour, minute, 0, 0)

  return value
}

function isPastResultWindow(date: string, time: string) {
  return (
    fixtureDateTime(date, time).getTime() + RESULT_READY_DELAY_MS < Date.now()
  )
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
  if (result === 'pending') return 'Result pending'
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
  const result =
    fixture.result === 'upcoming' && isPastResultWindow(date, fixture.time)
      ? 'pending'
      : fixture.result

  return {
    id: fixture.id,
    homeTeam: fixture.homeTeam,
    awayTeam: fixture.awayTeam,
    date,
    time: fixture.time,
    venue: fixture.venueName,
    venueGoogleUrl: fixture.venueGoogleUrl,
    scoreboardUrl: fixture.scoreboardUrl,
    matchLabel: fixture.matchLabel,
    season: fixture.season,
    result,
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
    badge: createFixtureBadge(result, fixture.ourScore, fixture.oppScore),
  }
}

async function resolveFixtureResult(data: z.infer<typeof fixtureSchema>) {
  if (!isPastResultWindow(data.date, data.time)) {
    return {
      result: 'upcoming',
      ourScore: null,
      oppScore: null,
      matchLabel: null,
    }
  }

  if (data.scoreboardUrl) {
    try {
      const playHqResult = await getPlayHqFixtureResult({
        homeTeam: data.homeTeam,
        awayTeam: data.awayTeam,
        scoreboardUrl: data.scoreboardUrl,
      })

      if (playHqResult) return playHqResult
    } catch (error) {
      console.error('Failed to fetch PlayHQ fixture result', error)
    }
  }

  return {
    result: 'upcoming',
    ourScore: null,
    oppScore: null,
    matchLabel: null,
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
      },
      orderBy: {
        matchDate: 'desc',
      },
    })
    const apiFixtures = fixtures.map(toApiFixture)

    res.status(200).json({
      data:
        result && result !== 'all'
          ? apiFixtures.filter(fixture => fixture.result === result)
          : apiFixtures,
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

    const resolvedResult = await resolveFixtureResult(result.data)

    const fixture = await prisma.fixture.create({
      data: {
        homeTeam: result.data.homeTeam,
        awayTeam: result.data.awayTeam,
        matchDate: fixtureDate(result.data.date),
        time: result.data.time,
        venueName: result.data.venue,
        venueGoogleUrl: result.data.venueGoogleUrl || null,
        scoreboardUrl: result.data.scoreboardUrl || null,
        matchLabel: resolvedResult.matchLabel ?? null,
        season: fixtureSeason(result.data.date),
        result: resolvedResult.result,
        ourScore: resolvedResult.ourScore,
        oppScore: resolvedResult.oppScore,
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

    const resolvedResult = await resolveFixtureResult(result.data)

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
        matchLabel: resolvedResult.matchLabel ?? null,
        season: fixtureSeason(result.data.date),
        result: resolvedResult.result,
        ourScore: resolvedResult.ourScore,
        oppScore: resolvedResult.oppScore,
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
