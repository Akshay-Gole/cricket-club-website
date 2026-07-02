import { Router } from 'express'
import prisma from '../lib/prisma.js'
import { dbRoleMap, toApiPlayer } from '../features/players/player.mapper.js'
import {
  createPlayerSchema,
  updatePlayerSchema,
} from '../features/players/player.schema.js'
import { z } from 'zod'

const router = Router()

router.get('/players', async (_req, res, next) => {
  try {
    const players = await prisma.player.findMany({
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

router.get('/players/:id', async (_req, res, next) => {
  try {
    const playerId = _req.params.id
    const player = await prisma.player.findUnique({
      where: {
        id: playerId,
      },
    })

    if (!player) {
      res.status(404).json({
        message: 'Player not found',
      })
      return
    }

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
    const player = await prisma.player.create({
      data: {
        firstName: playerInput.firstName,
        lastName: playerInput.lastName,
        displayName: playerInput.displayName,
        initials: playerInput.initials,
        role: dbRoleMap[playerInput.role],
        jerseyNumber: playerInput.jerseyNumber,
        imageUrl: playerInput.imageUrl || null,
        battingAvg: playerInput.battingAvg,
        bestBowl: playerInput.bestBowl,
        isCaptain: playerInput.isCaptain,
        isFeatured: playerInput.isFeatured,
        active: playerInput.active,
      },
    })
    res.status(201).json({
      data: toApiPlayer(player),
    })
  } catch (error) {
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
        battingAvg: playerInput.battingAvg,
        bestBowl: playerInput.bestBowl,
        isCaptain: playerInput.isCaptain,
        isFeatured: playerInput.isFeatured,
        active: playerInput.active,
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
