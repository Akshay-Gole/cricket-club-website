import { Router } from 'express'
import {
  getGalleryPosts,
  syncInstagramPosts,
} from '../features/gallery/instagram.service'

const router = Router()

router.get('/gallery', async (req, res, next) => {
  try {
    const year = Number(req.query.year)
    const page = Number(req.query.page)
    const limit = Number(req.query.limit)

    const data = await getGalleryPosts({
      year: Number.isFinite(year) ? year : undefined,
      page: Number.isFinite(page) ? page : undefined,
      limit: Number.isFinite(limit) ? limit : undefined,
    })

    res.json({ data })
  } catch (error) {
    next(error)
  }
})

router.post('/internal/sync-instagram-posts', async (req, res, next) => {
  try {
    const expectedSecret = process.env.CRON_SECRET
    const authHeader = req.header('authorization') ?? ''

    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const data = await syncInstagramPosts()

    res.json({ data })
  } catch (error) {
    next(error)
  }
})

export default router
