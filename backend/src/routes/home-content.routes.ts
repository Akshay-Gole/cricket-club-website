import { z } from 'zod'
import { Router } from 'express'
import prisma from '../lib/prisma.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

const DEFAULT_HOME_CONTENT = {
  id: 'home',
  tickerText: '',
}

const homeContentSchema = z.object({
  tickerText: z.string().trim().min(1),
})

function formatTwoDigits(value: number) {
  return String(value).padStart(2, '0')
}

async function getComputedHomeStats() {
  const now = new Date()

  const [matchesPlayed, victories, trophies, activePlayers, firstFixture] =
    await Promise.all([
      prisma.fixture.count({
        where: {
          active: true,
          matchDate: {
            lte: now,
          },
        },
      }),
      prisma.fixture.count({
        where: {
          active: true,
          result: 'won',
        },
      }),
      prisma.fixture.count({
        where: {
          active: true,
          result: 'won',
          matchLabel: {
            equals: 'Grand Final',
            mode: 'insensitive',
          },
        },
      }),
      prisma.player.count({
        where: {
          active: true,
        },
      }),
      prisma.fixture.findFirst({
        where: {
          active: true,
        },
        orderBy: {
          matchDate: 'asc',
        },
        select: {
          matchDate: true,
        },
      }),
    ])

  const currentYear = now.getFullYear()
  const firstYear = firstFixture?.matchDate.getFullYear()
  const yearsActive = firstYear ? currentYear - firstYear + 1 : 0

  return {
    matchesPlayed: String(matchesPlayed),
    victories: String(victories),
    trophies: formatTwoDigits(trophies),
    activePlayers: String(activePlayers),
    yearsActive: formatTwoDigits(yearsActive),
  }
}

async function getHomeContent() {
  const content = await prisma.homeContent.findUnique({
    where: {
      id: 'home',
    },
  })

  const stats = await getComputedHomeStats()

  return {
    ...DEFAULT_HOME_CONTENT,
    ...content,
    ...stats,
  }
}

router.get('/home-content', async (_req, res, next) => {
  try {
    res.status(200).json({
      data: await getHomeContent(),
    })
  } catch (error) {
    next(error)
  }
})

router.get('/admin/home-content', requireAuth, async (_req, res, next) => {
  try {
    res.status(200).json({
      data: await getHomeContent(),
    })
  } catch (error) {
    next(error)
  }
})

router.patch('/admin/home-content', requireAuth, async (_req, res, next) => {
  try {
    const result = homeContentSchema.safeParse(_req.body)

    if (!result.success) {
      res.status(400).json({
        message: 'Invalid home content',
        errors: z.treeifyError(result.error),
      })
      return
    }

    await prisma.homeContent.upsert({
      where: {
        id: 'home',
      },
      update: result.data,
      create: {
        id: 'home',
        ...result.data,
      },
    })

    res.status(200).json({
      data: await getHomeContent(),
    })
  } catch (error) {
    next(error)
  }
})

export default router
