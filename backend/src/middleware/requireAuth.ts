import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

interface JwtPayload {
  sub: string
  email: string
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.path.startsWith('/admin/')) {
    next()
    return
  }

  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({
      message: 'Authentication required',
    })
    return
  }

  const token = authHeader.replace('Bearer ', '')

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required')
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload

    req.adminUser = {
      id: payload.sub,
      email: payload.email,
    }

    next()
  } catch {
    res.status(401).json({
      message: 'Invalid or expired token',
    })
  }
}
