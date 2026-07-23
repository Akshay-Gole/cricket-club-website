import { Router } from 'express'
import { z } from 'zod'
import prisma from '../lib/prisma.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform(value => value || null)

const submissionSchema = z.object({
  intent: z.enum(['player', 'sponsor', 'general', 'social']),
  name: z.string().trim().min(1).max(120),
  email: z.email().max(254),
  phone: optionalText(40),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(5000),
  role: optionalText(100),
  experience: optionalText(500),
  trialDate: optionalText(40),
  company: optionalText(160),
  interest: optionalText(500),
  website: z
    .union([z.url().max(500), z.literal('')])
    .optional()
    .transform(value => value || null),
  nickname: z.string().max(200).optional(),
})

const statusSchema = z.object({
  status: z.enum(['unread', 'read', 'replied', 'archived']),
})

function routeParam(value: unknown) {
  if (typeof value === 'string') return value
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0]
  return undefined
}

function toApiSubmission(submission: {
  id: string
  intent: string
  status: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  role: string | null
  experience: string | null
  trialDate: string | null
  company: string | null
  interest: string | null
  website: string | null
  createdAt: Date
}) {
  return {
    ...submission,
    phone: submission.phone ?? '',
    role: submission.role ?? undefined,
    experience: submission.experience ?? undefined,
    trialDate: submission.trialDate ?? undefined,
    company: submission.company ?? undefined,
    interest: submission.interest ?? undefined,
    website: submission.website ?? undefined,
    submittedAt: submission.createdAt.toISOString(),
  }
}

router.post('/contact', async (req, res, next) => {
  try {
    const parsed = submissionSchema.safeParse(req.body)

    if (!parsed.success) {
      res.status(400).json({
        message: 'Invalid contact submission',
        errors: parsed.error.flatten().fieldErrors,
      })
      return
    }

    const { nickname, ...data } = parsed.data

    if (nickname) {
      res.status(201).json({ data: null })
      return
    }

    const submission = await prisma.contactSubmission.create({ data })

    res.status(201).json({ data: toApiSubmission(submission) })
  } catch (error) {
    next(error)
  }
})

router.get(
  '/admin/contact-submissions',
  requireAuth,
  async (_req, res, next) => {
    try {
      const submissions = await prisma.contactSubmission.findMany({
        orderBy: { createdAt: 'desc' },
      })

      res.json({ data: submissions.map(toApiSubmission) })
    } catch (error) {
      next(error)
    }
  }
)

router.patch(
  '/admin/contact-submissions/:id/status',
  requireAuth,
  async (req, res, next) => {
    try {
      const parsed = statusSchema.safeParse(req.body)
      const id = routeParam(req.params.id)

      if (!parsed.success || !id) {
        res.status(400).json({ message: 'Invalid submission status' })
        return
      }

      const submission = await prisma.contactSubmission.update({
        where: { id },
        data: parsed.data,
      })

      res.json({ data: toApiSubmission(submission) })
    } catch (error) {
      next(error)
    }
  }
)

router.delete(
  '/admin/contact-submissions/:id',
  requireAuth,
  async (req, res, next) => {
    try {
      const id = routeParam(req.params.id)

      if (!id) {
        res.status(400).json({ message: 'Submission id is required' })
        return
      }

      await prisma.contactSubmission.delete({ where: { id } })
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
)

export default router
