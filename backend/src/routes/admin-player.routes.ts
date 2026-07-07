import { z } from 'zod'
import { Router } from 'express'
import prisma from '../lib/prisma.js'
import { dbRoleMap, toApiPlayer } from '../features/players/player.mapper.js'
import {
  createPlayerSchema,
  updatePlayerSchema,
} from '../features/players/player.schema.js'
import {
  syncPlayCricketPlayerStats,
  verifyPlayCricketPlayer,
} from '../features/players/play-cricket.service.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

router.use(requireAuth)

async function findPlayerWithStats(playerId: string) {
  return prisma.player.findUniqueOrThrow({
    where: {
      id: playerId,
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

async function syncPlayerStatsAfterSave(playerId: string) {
  const player = await prisma.player.findUniqueOrThrow({
    where: {
      id: playerId,
    },
  })

  if (!player.playCricketPlayerId) {
    return findPlayerWithStats(playerId)
  }

  return syncPlayCricketPlayerStats(playerId)
}

router.get('/admin/players', async (_req, res, next) => {
  try {
    const players = await prisma.player.findMany({
      where: {
        active: true,
      },
      include: {
        careerStats: true,
      },
      orderBy: {
        jerseyNumber: 'asc',
      },
    })

    res.status(200).json({
      data: players.map(toApiPlayer),
    })
  } catch (error) {
    next(error)
  }
})

router.get(
  '/admin/players/verify-play-cricket/:playerId',
  async (_req, res, next) => {
    try {
      const playerId = _req.params.playerId
      const playerIdResult = z.string().uuid().safeParse(playerId)

      if (!playerIdResult.success) {
        res.status(400).json({
          message: 'Invalid Play Cricket player ID',
          data: {
            valid: false,
          },
        })
        return
      }

      const summary = await verifyPlayCricketPlayer(playerId)

      res.status(200).json({
        data: {
          valid: true,
          summary,
        },
      })
    } catch (error) {
      res.status(200).json({
        data: {
          valid: false,
        },
      })
    }
  }
)

router.post('/admin/players/:id/sync-stats', async (_req, res, next) => {
  try {
    const player = await syncPlayCricketPlayerStats(_req.params.id)

    res.status(200).json({
      data: toApiPlayer(player),
    })
  } catch (error) {
    next(error)
  }
})

router.post('/admin/players', async (_req, res, next) => {
  try {
    const result = createPlayerSchema.safeParse(_req.body)

    if (!result.success) {
      res.status(400).json({
        message: 'Invalid Player Data',
        errors: z.treeifyError(result.error),
      })
      return
    }

    const playerInput = result.data

    if (playerInput.playCricketPlayerId) {
      await verifyPlayCricketPlayer(playerInput.playCricketPlayerId)
    }

    const player = await prisma.player.create({
      data: {
        firstName: playerInput.firstName,
        lastName: playerInput.lastName,
        displayName: playerInput.displayName,
        initials: playerInput.initials,
        role: dbRoleMap[playerInput.role],
        jerseyNumber: playerInput.jerseyNumber,
        imageUrl: playerInput.imageUrl || null,
        playCricketPlayerId: playerInput.playCricketPlayerId || null,
        battingAvg: playerInput.battingAvg,
        bestBowl: playerInput.bestBowl,
        isCaptain: playerInput.isCaptain,
        isFeatured: playerInput.isFeatured,
        active: playerInput.active,
      },
    })
    const playerWithStats = await syncPlayerStatsAfterSave(player.id)

    res.status(201).json({
      data: toApiPlayer(playerWithStats),
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Play Cricket')) {
      res.status(400).json({
        message: 'Could not sync Play Cricket stats. Check the player ID.',
      })
      return
    }

    next(error)
  }
})

router.patch('/admin/players/:id', async (_req, res, next) => {
  try {
    const result = updatePlayerSchema.safeParse(_req.body)

    if (!result.success) {
      res.status(400).json({
        message: 'Invalid Player Data',
        errors: z.treeifyError(result.error),
      })
      return
    }

    const existingPlayer = await prisma.player.findUnique({
      where: {
        id: _req.params.id,
      },
    })

    if (!existingPlayer) {
      res.status(404).json({
        message: 'Player not found',
      })
      return
    }

    const playerInput = result.data

    if (playerInput.playCricketPlayerId) {
      await verifyPlayCricketPlayer(playerInput.playCricketPlayerId)
    }

    const player = await prisma.player.update({
      where: {
        id: _req.params.id,
      },
      data: {
        firstName: playerInput.firstName,
        lastName: playerInput.lastName,
        displayName: playerInput.displayName,
        initials: playerInput.initials,
        role: playerInput.role ? dbRoleMap[playerInput.role] : undefined,
        jerseyNumber: playerInput.jerseyNumber,
        imageUrl:
          playerInput.imageUrl === undefined
            ? undefined
            : playerInput.imageUrl || null,
        playCricketPlayerId:
          playerInput.playCricketPlayerId === undefined
            ? undefined
            : playerInput.playCricketPlayerId || null,
        battingAvg: playerInput.battingAvg,
        bestBowl: playerInput.bestBowl,
        isCaptain: playerInput.isCaptain,
        isFeatured: playerInput.isFeatured,
        active: playerInput.active,
      },
    })
    const playerWithStats = await syncPlayerStatsAfterSave(player.id)

    res.status(200).json({
      data: toApiPlayer(playerWithStats),
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Play Cricket')) {
      res.status(400).json({
        message: 'Could not sync Play Cricket stats. Check the player ID.',
      })
      return
    }

    next(error)
  }
})

router.delete('/admin/players/:id', async (_req, res, next) => {
  try {
    const existingPlayer = await prisma.player.findUnique({
      where: {
        id: _req.params.id,
      },
    })

    if (!existingPlayer) {
      res.status(404).json({
        message: 'Player not found',
      })
      return
    }

    const player = await prisma.player.update({
      where: {
        id: _req.params.id,
      },
      data: {
        active: false,
      },
    })

    res.status(200).json({
      data: toApiPlayer(player),
    })
  } catch (error) {
    next(error)
  }
})

export default router
