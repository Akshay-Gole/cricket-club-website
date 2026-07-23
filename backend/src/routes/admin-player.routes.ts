import { z } from 'zod'
import { Router, raw } from 'express'
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
import { deleteCloudinaryImage, uploadImage } from '../lib/cloudinary.js'

const router = Router()

function toAdminApiPlayer(player: Parameters<typeof toApiPlayer>[0]) {
  return {
    ...toApiPlayer(player),
    imagePublicId: player.imagePublicId,
  }
}

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

router.get('/admin/players', requireAuth, async (_req, res, next) => {
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
      data: players.map(toAdminApiPlayer),
    })
  } catch (error) {
    next(error)
  }
})

router.get(
  '/admin/players/verify-play-cricket/:playerId',
  requireAuth,
  async (_req, res, _next) => {
    try {
      const playerId = String(_req.params.playerId)
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
    } catch {
      res.status(200).json({
        data: {
          valid: false,
        },
      })
    }
  }
)

router.post(
  '/admin/players/:id/sync-stats',
  requireAuth,
  async (_req, res, next) => {
    try {
      const playerId = String(_req.params.id)
      const player = await syncPlayCricketPlayerStats(playerId)

      res.status(200).json({
        data: toAdminApiPlayer(player),
      })
    } catch (error) {
      next(error)
    }
  }
)

router.post(
  '/admin/players/image',
  requireAuth,
  raw({ type: 'image/*', limit: '5mb' }),
  async (_req, res, next) => {
    try {
      if (!Buffer.isBuffer(_req.body) || _req.body.length === 0) {
        res.status(400).json({ message: 'Player image is required' })
        return
      }

      const image = await uploadImage(_req.body, 'top-gs-cc/players')
      res.status(201).json({
        data: {
          imageUrl: image.logoUrl,
          imagePublicId: image.logoPublicId,
        },
      })
    } catch (error) {
      next(error)
    }
  }
)

router.post('/admin/players', requireAuth, async (_req, res, next) => {
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
        imagePublicId: playerInput.imagePublicId || null,
        playCricketPlayerId: playerInput.playCricketPlayerId || null,
        battingAvg: 0,
        bestBowl: '0/0',
        isCaptain: playerInput.isCaptain,
        isFeatured: playerInput.isFeatured,
        featuredStatValue: playerInput.featuredStatValue || null,
        featuredStatLabel: playerInput.featuredStatLabel || null,
        active: playerInput.active,
      },
    })
    const playerWithStats = await syncPlayerStatsAfterSave(player.id)

    res.status(201).json({
      data: toAdminApiPlayer(playerWithStats),
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

router.patch('/admin/players/:id', requireAuth, async (_req, res, next) => {
  try {
    const playerId = String(_req.params.id)
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
        id: playerId,
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
        id: playerId,
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
        imagePublicId:
          playerInput.imagePublicId === undefined
            ? undefined
            : playerInput.imagePublicId || null,
        playCricketPlayerId:
          playerInput.playCricketPlayerId === undefined
            ? undefined
            : playerInput.playCricketPlayerId || null,
        isCaptain: playerInput.isCaptain,
        isFeatured: playerInput.isFeatured,
        featuredStatValue:
          playerInput.featuredStatValue === undefined
            ? undefined
            : playerInput.featuredStatValue || null,
        featuredStatLabel:
          playerInput.featuredStatLabel === undefined
            ? undefined
            : playerInput.featuredStatLabel || null,
        active: playerInput.active,
      },
    })
    const playerWithStats = await syncPlayerStatsAfterSave(player.id)

    if (
      existingPlayer.imagePublicId &&
      existingPlayer.imagePublicId !== player.imagePublicId
    ) {
      await deleteCloudinaryImage(existingPlayer.imagePublicId).catch(
        () => undefined
      )
    }

    res.status(200).json({
      data: toAdminApiPlayer(playerWithStats),
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

router.delete('/admin/players/:id', requireAuth, async (_req, res, next) => {
  try {
    const playerId = String(_req.params.id)
    const existingPlayer = await prisma.player.findUnique({
      where: {
        id: playerId,
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
        id: playerId,
      },
      data: {
        active: false,
        imageUrl: null,
        imagePublicId: null,
      },
    })
    await deleteCloudinaryImage(existingPlayer.imagePublicId).catch(
      () => undefined
    )

    res.status(200).json({
      data: toAdminApiPlayer(player),
    })
  } catch (error) {
    next(error)
  }
})

export default router
