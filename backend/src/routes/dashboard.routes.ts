import { Router } from 'express'
import prisma from '../lib/prisma.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

function isTopGs(team: string) {
  const value = team.toLowerCase().replaceAll('’', "'")
  return value.includes("top g's") || value.includes('top gs')
}

router.get('/admin/dashboard', requireAuth, async (_req, res, next) => {
  try {
    const now = new Date()
    const [
      players,
      featuredPlayers,
      fixtures,
      upcomingFixtures,
      messages,
      unreadMessages,
      sponsors,
      featuredSponsors,
      nextFixture,
      recentMessages,
      recentPlayers,
      recentFixtures,
      recentSponsors,
      recentContacts,
    ] = await Promise.all([
      prisma.player.count({ where: { active: true } }),
      prisma.player.count({ where: { active: true, isFeatured: true } }),
      prisma.fixture.count({ where: { active: true } }),
      prisma.fixture.count({
        where: {
          active: true,
          result: 'upcoming',
          matchDate: { gte: now },
        },
      }),
      prisma.contactSubmission.count(),
      prisma.contactSubmission.count({ where: { status: 'unread' } }),
      prisma.sponsor.count({ where: { active: true } }),
      prisma.sponsor.count({ where: { active: true, featured: true } }),
      prisma.fixture.findFirst({
        where: {
          active: true,
          result: 'upcoming',
          matchDate: { gte: now },
        },
        orderBy: { matchDate: 'asc' },
      }),
      prisma.contactSubmission.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.player.findMany({
        take: 3,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          displayName: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.fixture.findMany({
        take: 3,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          homeTeam: true,
          awayTeam: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.sponsor.findMany({
        take: 3,
        orderBy: { updatedAt: 'desc' },
        select: { id: true, name: true, createdAt: true, updatedAt: true },
      }),
      prisma.contactSubmission.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          intent: true,
          createdAt: true,
        },
      }),
    ])

    const recentActivity = [
      ...recentPlayers.map(player => ({
        id: `player-${player.id}`,
        title:
          player.createdAt.getTime() === player.updatedAt.getTime()
            ? 'Player added'
            : 'Player updated',
        detail: player.displayName,
        occurredAt: player.updatedAt,
        tone: 'gold',
      })),
      ...recentFixtures.map(fixture => ({
        id: `fixture-${fixture.id}`,
        title:
          fixture.createdAt.getTime() === fixture.updatedAt.getTime()
            ? 'Fixture added'
            : 'Fixture updated',
        detail: `${fixture.homeTeam} vs ${fixture.awayTeam}`,
        occurredAt: fixture.updatedAt,
        tone: 'green',
      })),
      ...recentSponsors.map(sponsor => ({
        id: `sponsor-${sponsor.id}`,
        title:
          sponsor.createdAt.getTime() === sponsor.updatedAt.getTime()
            ? 'Sponsor added'
            : 'Sponsor updated',
        detail: sponsor.name,
        occurredAt: sponsor.updatedAt,
        tone: 'blue',
      })),
      ...recentContacts.map(contact => ({
        id: `message-${contact.id}`,
        title: 'Message received',
        detail: `${contact.name} · ${contact.intent}`,
        occurredAt: contact.createdAt,
        tone: 'red',
      })),
    ]
      .sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime())
      .slice(0, 5)
      .map(item => ({
        ...item,
        occurredAt: item.occurredAt.toISOString(),
      }))

    res.json({
      data: {
        season: String(now.getFullYear()),
        unread: unreadMessages,
        upcoming: upcomingFixtures,
        stats: [
          {
            label: 'Squad Members',
            value: String(players),
            change: `${featuredPlayers} featured`,
            hint: 'Active squad members',
            tone: 'gold',
          },
          {
            label: 'Fixtures',
            value: String(fixtures),
            change: `${upcomingFixtures} upcoming`,
            hint: 'Active club fixtures',
            tone: 'green',
          },
          {
            label: 'Messages',
            value: String(messages),
            change: `${unreadMessages} unread`,
            hint: 'Contact form enquiries',
            tone: 'blue',
          },
          {
            label: 'Sponsors',
            value: String(sponsors),
            change: `${featuredSponsors} featured`,
            hint: 'Active club partners',
            tone: 'red',
          },
        ],
        nextFixture: nextFixture
          ? {
              opponent: isTopGs(nextFixture.homeTeam)
                ? nextFixture.awayTeam
                : nextFixture.homeTeam,
              date: nextFixture.matchDate.toISOString(),
              time: nextFixture.time,
              ground: nextFixture.venueName,
              competition: nextFixture.matchLabel || nextFixture.season,
              status: 'Upcoming',
            }
          : null,
        recentMessages: recentMessages.map(message => ({
          id: message.id,
          name: message.name,
          intent: message.intent,
          preview: message.message,
          occurredAt: message.createdAt.toISOString(),
          unread: message.status === 'unread',
        })),
        recentActivity,
      },
    })
  } catch (error) {
    next(error)
  }
})

export default router
