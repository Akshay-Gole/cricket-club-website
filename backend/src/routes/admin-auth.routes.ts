import bcrypt from 'bcryptjs'
import { Router } from 'express'
import jwt, { type SignOptions } from 'jsonwebtoken'
import { z } from 'zod'
import { loginSchema } from '../features/auth/auth.schema.js'
import prisma from '../lib/prisma.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

router.get('/admin/auth/me', requireAuth, async (_req, res, next) => {
  try {
    const adminUserId = _req.adminUser?.id

    if (!adminUserId) {
      res.status(401).json({
        message: 'Authentication required',
      })
      return
    }

    const adminUser = await prisma.adminUser.findUnique({
      where: {
        id: adminUserId,
      },
    })

    if (!adminUser || !adminUser.active) {
      res.status(401).json({
        message: 'Invalid or expired token',
      })
      return
    }

    res.status(200).json({
      data: {
        user: {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
        },
      },
    })
  } catch (error) {
    next(error)
  }
})

router.post('/admin/auth/login', async (_req, res, next) => {
  try {
    const result = loginSchema.safeParse(_req.body)

    if (!result.success) {
      res.status(400).json({
        message: 'Invalid login data',
        error: z.treeifyError(result.error),
      })
      return
    }

    const { email, password } = result.data

    const adminUser = await prisma.adminUser.findUnique({
      where: {
        email,
      },
    })

    if (!adminUser || !adminUser.active) {
      res.status(401).json({
        message: 'Invalid email or password',
      })
      return
    }

    const passwordMatches = await bcrypt.compare(
      password,
      adminUser.passwordHash
    )

    if (!passwordMatches) {
      res.status(401).json({
        message: 'Invalid email or password',
      })
      return
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is required')
    }

    const jwtExpiresIn = (process.env.JWT_EXPIRES_IN ??
      '7d') as SignOptions['expiresIn']

    const token = jwt.sign(
      {
        sub: adminUser.id,
        email: adminUser.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: jwtExpiresIn,
      }
    )

    res.status(200).json({
      data: {
        user: {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
        },
        token,
      },
    })
  } catch (error) {
    next(error)
  }
})

export default router
