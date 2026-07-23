import { Router, raw } from 'express'
import { z } from 'zod'
import type { Sponsor } from '@prisma/client'
import prisma from '../lib/prisma.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { deleteCloudinaryImage, uploadImage } from '../lib/cloudinary.js'

const router = Router()

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform(value => value || null)

const sponsorSchema = z.object({
  name: z.string().trim().min(1).max(160),
  industry: z.string().trim().min(1).max(120),
  website: z
    .union([z.url().max(500), z.literal('')])
    .optional()
    .transform(value => value || null),
  contactName: optionalText(160),
  contactEmail: z.email().max(254),
  phone: optionalText(40),
  logoUrl: z
    .union([z.url().max(1000), z.literal('')])
    .optional()
    .transform(value => value || null),
  logoPublicId: optionalText(255),
  active: z.boolean(),
  featured: z.boolean(),
  notes: optionalText(2000),
})

function toPublicSponsor(sponsor: Sponsor) {
  return {
    id: sponsor.id,
    name: sponsor.name,
    industry: sponsor.industry,
    website: sponsor.website ?? '',
    logoUrl: sponsor.logoUrl ?? '',
    featured: sponsor.featured,
  }
}

function toAdminSponsor(sponsor: Sponsor) {
  return {
    ...toPublicSponsor(sponsor),
    contactName: sponsor.contactName ?? '',
    contactEmail: sponsor.contactEmail,
    phone: sponsor.phone ?? '',
    logoPublicId: sponsor.logoPublicId ?? '',
    active: sponsor.active,
    joinedAt: sponsor.joinedAt.toISOString().slice(0, 10),
    notes: sponsor.notes ?? '',
  }
}

router.get('/sponsors', async (_req, res, next) => {
  try {
    const sponsors = await prisma.sponsor.findMany({
      where: { active: true },
      orderBy: [{ featured: 'desc' }, { joinedAt: 'desc' }],
    })

    res.json({ data: sponsors.map(toPublicSponsor) })
  } catch (error) {
    next(error)
  }
})

router.get('/admin/sponsors', requireAuth, async (_req, res, next) => {
  try {
    const sponsors = await prisma.sponsor.findMany({
      orderBy: { joinedAt: 'desc' },
    })

    res.json({ data: sponsors.map(toAdminSponsor) })
  } catch (error) {
    next(error)
  }
})

router.post(
  '/admin/sponsors/logo',
  requireAuth,
  raw({ type: 'image/*', limit: '5mb' }),
  async (req, res, next) => {
    try {
      if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
        res.status(400).json({ message: 'Sponsor logo image is required' })
        return
      }

      const logo = await uploadImage(req.body, 'top-gs-cc/sponsors')
      res.status(201).json({ data: logo })
    } catch (error) {
      next(error)
    }
  }
)

router.post('/admin/sponsors', requireAuth, async (req, res, next) => {
  try {
    const parsed = sponsorSchema.safeParse(req.body)

    if (!parsed.success) {
      res.status(400).json({
        message: 'Invalid sponsor data',
        errors: parsed.error.flatten().fieldErrors,
      })
      return
    }

    const sponsor = await prisma.sponsor.create({ data: parsed.data })
    res.status(201).json({ data: toAdminSponsor(sponsor) })
  } catch (error) {
    next(error)
  }
})

router.patch('/admin/sponsors/:id', requireAuth, async (req, res, next) => {
  try {
    const parsed = sponsorSchema.safeParse(req.body)

    if (!parsed.success) {
      res.status(400).json({
        message: 'Invalid sponsor data',
        errors: parsed.error.flatten().fieldErrors,
      })
      return
    }

    const existing = await prisma.sponsor.findUniqueOrThrow({
      where: { id: String(req.params.id) },
    })

    const sponsor = await prisma.sponsor.update({
      where: { id: String(req.params.id) },
      data: parsed.data,
    })

    if (
      existing.logoPublicId &&
      existing.logoPublicId !== sponsor.logoPublicId
    ) {
      await deleteCloudinaryImage(existing.logoPublicId).catch(() => undefined)
    }

    res.json({ data: toAdminSponsor(sponsor) })
  } catch (error) {
    next(error)
  }
})

router.delete('/admin/sponsors/:id', requireAuth, async (req, res, next) => {
  try {
    const sponsor = await prisma.sponsor.delete({
      where: { id: String(req.params.id) },
    })
    await deleteCloudinaryImage(sponsor.logoPublicId).catch(() => undefined)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default router
