import { z } from 'zod'
import { Router } from 'express'
import prisma from '../lib/prisma.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

const DEFAULT_HOME_CONTENT = {
  id: 'home',
  matchesPlayed: '48',
  victories: '31',
  trophies: '06',
  activePlayers: '22',
  yearsActive: '01',
  tickerText:
    "Top G's CC def. Norwood CC by 47 runs    ·    Catto named Player of the Match    ·    Next fixture: Top G's CC vs Riverside CC — Sat 31 May    ·    U18s training every Thursday 5PM    ·    Season 2026 registrations now open    ·    ",
}

const homeContentSchema = z.object({
  matchesPlayed: z.string().trim().min(1),
  victories: z.string().trim().min(1),
  trophies: z.string().trim().min(1),
  activePlayers: z.string().trim().min(1),
  yearsActive: z.string().trim().min(1),
  tickerText: z.string().trim().min(1),
})

async function getHomeContent() {
  const content = await prisma.homeContent.findUnique({
    where: {
      id: 'home',
    },
  })

  return content ?? DEFAULT_HOME_CONTENT
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

    const content = await prisma.homeContent.upsert({
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
      data: content,
    })
  } catch (error) {
    next(error)
  }
})

export default router
