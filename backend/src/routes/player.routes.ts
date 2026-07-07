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

router.get('/players/:id', async (_req, res, next) => {
  try {
    const playerId = _req.params.id
    const player = await prisma.player.findFirst({
      where: {
        id: playerId,
        active: true,
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

export default router
