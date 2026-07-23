import { Router } from 'express'
import { Prisma, type NewsPost } from '@prisma/client'
import { z } from 'zod'
import prisma from '../lib/prisma.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

const CATEGORY_VALUES = [
  'news',
  'match-report',
  'event',
  'announcement',
] as const
const LAYOUT_VALUES = ['standard', 'match-report'] as const
const STATUS_VALUES = ['draft', 'published'] as const
const BLOCK_VALUES = [
  'paragraph',
  'heading',
  'image',
  'quote',
  'callout',
] as const

const newsBlockSchema = z.object({
  type: z.enum(BLOCK_VALUES),
  data: z.record(z.string(), z.unknown()),
})

const newsPostSchema = z.object({
  title: z.string().trim().min(1),
  slug: z.string().trim().optional(),
  category: z.enum(CATEGORY_VALUES),
  layout: z.enum(LAYOUT_VALUES).default('standard'),
  excerpt: z.string().trim().min(1),
  content: z.string().trim().min(1),
  featuredImage: z.string().trim().url().or(z.literal('')).optional(),
  author: z.string().trim().min(1).default("Top G's CC"),
  status: z.enum(STATUS_VALUES).default('draft'),
  blocks: z.array(newsBlockSchema).optional(),
})

function routeParam(value: unknown) {
  if (typeof value === 'string') return value
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0]
  return undefined
}

function createSlug(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function estimateReadTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 180))

  return `${minutes} min read`
}

function contentToBlocks(content: string) {
  return content
    .split(/\n{2,}/)
    .map(text => text.trim())
    .filter(Boolean)
    .map((text, index) => ({
      type: 'paragraph',
      sortOrder: index,
      data: { text } as Prisma.InputJsonValue,
    }))
}

async function uniqueSlug(
  title: string,
  currentId?: string,
  preferred?: string
) {
  const base = createSlug(preferred || title) || `news-${Date.now()}`
  let candidate = base
  let counter = 2

  while (true) {
    const existing = await prisma.newsPost.findUnique({
      where: { slug: candidate },
      select: { id: true },
    })

    if (!existing || existing.id === currentId) return candidate

    candidate = `${base}-${counter}`
    counter += 1
  }
}

function toApiPost(
  post: NewsPost & { blocks: { type: string; data: Prisma.JsonValue }[] }
) {
  const blocks = post.blocks.map(block => ({
    type: block.type,
    data: block.data,
  }))

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    category: post.category,
    layout: post.layout,
    excerpt: post.excerpt,
    content: post.content,
    featuredImage: post.featuredImage,
    author: post.author,
    status: post.status,
    readTime: post.readTime,
    publishedAt: (post.publishedAt ?? post.createdAt).toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    blocks,
  }
}

async function getPostData(id: string) {
  return prisma.newsPost.findUnique({
    where: { id },
    include: {
      blocks: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  })
}

async function replaceBlocks(
  postId: string,
  blocks: z.infer<typeof newsBlockSchema>[] | undefined,
  content: string
) {
  const nextBlocks = blocks?.length
    ? blocks.map((block, index) => ({
        type: block.type,
        sortOrder: index,
        data: block.data as Prisma.InputJsonValue,
      }))
    : contentToBlocks(content)

  await prisma.newsBlock.deleteMany({ where: { postId } })

  if (nextBlocks.length) {
    await prisma.newsBlock.createMany({
      data: nextBlocks.map(block => ({
        postId,
        ...block,
      })),
    })
  }
}

router.get('/news', async (_req, res, next) => {
  try {
    const category = routeParam(_req.query.category)

    const posts = await prisma.newsPost.findMany({
      where: {
        active: true,
        status: 'published',
        ...(category && category !== 'all' ? { category } : {}),
      },
      include: {
        blocks: {
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
    })

    res.status(200).json({ data: posts.map(toApiPost) })
  } catch (error) {
    next(error)
  }
})

router.get('/news/:slug', async (_req, res, next) => {
  try {
    const slug = routeParam(_req.params.slug)

    if (!slug) {
      res.status(400).json({ message: 'Article slug is required' })
      return
    }

    const post = await prisma.newsPost.findFirst({
      where: {
        slug,
        active: true,
        status: 'published',
      },
      include: {
        blocks: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    })

    if (!post) {
      res.status(404).json({ message: 'Article not found' })
      return
    }

    res.status(200).json({ data: toApiPost(post) })
  } catch (error) {
    next(error)
  }
})

router.get('/admin/news', requireAuth, async (_req, res, next) => {
  try {
    const posts = await prisma.newsPost.findMany({
      where: { active: true },
      include: {
        blocks: {
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    res.status(200).json({ data: posts.map(toApiPost) })
  } catch (error) {
    next(error)
  }
})

router.post('/admin/news', requireAuth, async (_req, res, next) => {
  try {
    const result = newsPostSchema.safeParse(_req.body)

    if (!result.success) {
      res.status(400).json({
        message: 'Invalid news data',
        errors: z.treeifyError(result.error),
      })
      return
    }

    const slug = await uniqueSlug(
      result.data.title,
      undefined,
      result.data.slug
    )
    const publishedAt =
      result.data.status === 'published' ? new Date() : undefined

    const post = await prisma.newsPost.create({
      data: {
        title: result.data.title,
        slug,
        category: result.data.category,
        layout: result.data.layout,
        excerpt: result.data.excerpt,
        content: result.data.content,
        featuredImage: result.data.featuredImage || null,
        author: result.data.author,
        status: result.data.status,
        readTime: estimateReadTime(result.data.content),
        publishedAt,
      },
    })

    await replaceBlocks(post.id, result.data.blocks, result.data.content)

    const data = await getPostData(post.id)
    res.status(201).json({ data: data ? toApiPost(data) : null })
  } catch (error) {
    next(error)
  }
})

router.patch('/admin/news/:id', requireAuth, async (_req, res, next) => {
  try {
    const id = routeParam(_req.params.id)

    if (!id) {
      res.status(400).json({ message: 'Article id is required' })
      return
    }

    const existing = await prisma.newsPost.findUnique({ where: { id } })

    if (!existing) {
      res.status(404).json({ message: 'Article not found' })
      return
    }

    const result = newsPostSchema.safeParse(_req.body)

    if (!result.success) {
      res.status(400).json({
        message: 'Invalid news data',
        errors: z.treeifyError(result.error),
      })
      return
    }

    const slug = await uniqueSlug(result.data.title, id, result.data.slug)
    const shouldPublish =
      result.data.status === 'published' && existing.status !== 'published'

    await prisma.newsPost.update({
      where: { id },
      data: {
        title: result.data.title,
        slug,
        category: result.data.category,
        layout: result.data.layout,
        excerpt: result.data.excerpt,
        content: result.data.content,
        featuredImage: result.data.featuredImage || null,
        author: result.data.author,
        status: result.data.status,
        readTime: estimateReadTime(result.data.content),
        publishedAt: shouldPublish
          ? new Date()
          : result.data.status === 'draft'
            ? null
            : existing.publishedAt,
      },
    })

    await replaceBlocks(id, result.data.blocks, result.data.content)

    const data = await getPostData(id)
    res.status(200).json({ data: data ? toApiPost(data) : null })
  } catch (error) {
    next(error)
  }
})

router.delete('/admin/news/:id', requireAuth, async (_req, res, next) => {
  try {
    const id = routeParam(_req.params.id)

    if (!id) {
      res.status(400).json({ message: 'Article id is required' })
      return
    }

    await prisma.newsPost.update({
      where: { id },
      data: { active: false },
    })

    res.status(200).json({ message: 'Article deleted' })
  } catch (error) {
    next(error)
  }
})

export default router
