import { Router } from 'express'
import { syncFinishedPlayHqFixtures } from '../features/fixtures/playhq-fixture.service.js'
import { syncAllPlayCricketPlayerStats } from '../features/players/play-cricket.service.js'

const router = Router()

function getBearerToken(authHeader: string | undefined) {
  if (!authHeader?.startsWith('Bearer ')) return null

  return authHeader.replace('Bearer ', '')
}

router.post('/internal/sync-player-stats', async (_req, res, next) => {
  try {
    const cronSecret = process.env.CRON_SECRET
    const token = getBearerToken(_req.headers.authorization)

    if (!cronSecret) {
      res.status(500).json({
        message: 'CRON_SECRET is not configured',
      })
      return
    }

    if (token !== cronSecret) {
      res.status(401).json({
        message: 'Invalid cron secret',
      })
      return
    }

    const [players, fixtures] = await Promise.all([
      syncAllPlayCricketPlayerStats(),
      syncFinishedPlayHqFixtures(),
    ])

    res.status(200).json({
      data: {
        players,
        fixtures,
      },
    })
  } catch (error) {
    next(error)
  }
})

export default router
