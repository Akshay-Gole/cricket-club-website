import type { Fixture } from '@prisma/client'
import { z } from 'zod'
import prisma from '../../lib/prisma.js'

const PLAYHQ_GRAPHQL_URL = 'https://api.playhq.com/graphql'
const CLUB_NAME = "top g's cc"
const MATCH_RESULT_SYNC_DELAY_MS = 6 * 60 * 60 * 1000
const ADELAIDE_TIME_ZONE = 'Australia/Adelaide'

const playHqTeamResultSchema = z.object({
  score: z.union([z.string(), z.number()]).nullable(),
  outcome: z
    .object({
      name: z.string(),
      value: z.string(),
    })
    .nullable(),
  periods: z
    .array(
      z.object({
        statistics: z.array(
          z.object({
            count: z.number(),
            type: z.object({
              value: z.string(),
            }),
          })
        ),
      })
    )
    .default([]),
})

const playHqGameSchema = z.object({
  data: z.object({
    discoverGame: z.object({
      alias: z.string().nullable(),
      home: z.object({
        name: z.string(),
      }),
      away: z.object({
        name: z.string(),
      }),
      status: z.object({
        value: z.string(),
      }),
      result: z
        .object({
          winner: z
            .object({
              name: z.string(),
              value: z.string(),
            })
            .nullable(),
          home: playHqTeamResultSchema,
          away: playHqTeamResultSchema,
        })
        .nullable(),
    }),
  }),
})

function normaliseTeamName(teamName: string) {
  return teamName.toLowerCase().replaceAll('’', "'").replaceAll(/\s+/g, ' ')
}

function isTopGsTeam(teamName: string) {
  const normalised = normaliseTeamName(teamName)

  return normalised.includes(CLUB_NAME) || normalised.includes('top gs cc')
}

function formatFixtureDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

function fixtureDateTime(fixture: Fixture) {
  const utcGuess = new Date(
    `${formatFixtureDate(fixture.matchDate)}T${fixture.time}:00.000Z`
  )
  const parts = new Intl.DateTimeFormat('en-AU', {
    timeZone: ADELAIDE_TIME_ZONE,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(utcGuess)

  const value = (type: string) =>
    Number(parts.find(part => part.type === type)?.value)

  const adelaideAsUtc = Date.UTC(
    value('year'),
    value('month') - 1,
    value('day'),
    value('hour'),
    value('minute'),
    value('second')
  )

  return new Date(utcGuess.getTime() - (adelaideAsUtc - utcGuess.getTime()))
}

function extractPlayHqGameId(scoreboardUrl: string | null) {
  if (!scoreboardUrl) return null

  try {
    const url = new URL(scoreboardUrl)
    return url.pathname.split('/').filter(Boolean).at(-1) ?? null
  } catch {
    return scoreboardUrl.split('/').filter(Boolean).at(-1) ?? null
  }
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : String(value)
}

function statisticCount(
  side: z.infer<typeof playHqTeamResultSchema>,
  statisticType: string
) {
  return side.periods
    .flatMap(period => period.statistics)
    .find(statistic => statistic.type.value === statisticType)?.count
}

function scoreWithWicketsAndOvers(
  side: z.infer<typeof playHqTeamResultSchema>
): string | null {
  const runs = statisticCount(side, 'TOTAL_SCORE') ?? side.score
  const wickets = statisticCount(side, 'TOTAL_OUTS')
  const overs = statisticCount(side, 'TOTAL_OVERS')

  if (runs === null || runs === undefined) return null

  const score =
    wickets === undefined
      ? String(runs)
      : `${formatNumber(Number(runs))}/${formatNumber(wickets)}`

  return overs === undefined ? score : `${score} (${formatNumber(overs)})`
}

function runsFromScore(score: string | null) {
  const runs = Number(score?.split('/')[0]?.trim())

  return Number.isNaN(runs) ? null : runs
}

function resultFromOutcome(outcome?: string) {
  const value = outcome?.toLowerCase() ?? ''

  if (value.includes('forfeit')) return 'forfeited'
  if (value.includes('abandon')) return 'abandoned'
  if (value.includes('draw') || value.includes('tie')) return 'draw'
  if (value.includes('won')) return 'won'
  if (value.includes('lost')) return 'lost'

  return null
}

function resultFromStatus(status: string) {
  const value = status.toLowerCase()

  if (value.includes('abandon')) return 'abandoned'

  return null
}

function matchLabelFromAlias(alias: string | null) {
  const value = alias?.trim()

  if (!value) return null
  if (value.toLowerCase().startsWith('semi final')) return 'Semi Final'

  return value
}

async function fetchPlayHqGame(gameId: string) {
  const response = await fetch(PLAYHQ_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      origin: 'https://www.playhq.com',
      referer: 'https://www.playhq.com/',
      'user-agent': 'Mozilla/5.0',
      tenant: 'cricket-australia',
    },
    body: JSON.stringify({
      operationName: 'gameView',
      variables: {
        gameId,
      },
      query: `
        query gameView($gameId: ID!) {
          discoverGame(gameID: $gameId) {
            alias
            away {
              ... on DiscoverTeam {
                name
              }
              ... on ProvisionalTeam {
                name
              }
            }
            home {
              ... on DiscoverTeam {
                name
              }
              ... on ProvisionalTeam {
                name
              }
            }
            result {
              winner {
                name
                value
              }
              home {
                score
                outcome {
                  name
                  value
                }
                periods {
                  statistics {
                    count
                    type {
                      value
                    }
                  }
                }
              }
              away {
                score
                outcome {
                  name
                  value
                }
                periods {
                  statistics {
                    count
                    type {
                      value
                    }
                  }
                }
              }
            }
            status {
              value
            }
          }
        }
      `,
    }),
  })

  if (!response.ok) {
    throw new Error(`PlayHQ request failed with ${response.status}`)
  }

  return playHqGameSchema.parse(await response.json()).data.discoverGame
}

export async function syncPlayHqFixture(fixture: Fixture) {
  const fixtureResult = await getPlayHqFixtureResult(fixture)

  if (!fixtureResult) return false

  await prisma.fixture.update({
    where: {
      id: fixture.id,
    },
    data: fixtureResult,
  })

  return true
}

export async function getPlayHqFixtureResult(
  fixture: Pick<Fixture, 'scoreboardUrl' | 'homeTeam' | 'awayTeam'>
) {
  const gameId = extractPlayHqGameId(fixture.scoreboardUrl)

  if (!gameId) return null

  const game = await fetchPlayHqGame(gameId)
  const statusResult = resultFromStatus(game.status.value)

  if (statusResult) {
    return {
      result: statusResult,
      ourScore: null,
      oppScore: null,
      matchLabel: matchLabelFromAlias(game.alias),
    }
  }

  if (game.status.value !== 'FINAL' || !game.result) return null

  const topGsIsHome = isTopGsTeam(game.home.name)
    ? true
    : isTopGsTeam(game.away.name)
      ? false
      : isTopGsTeam(fixture.homeTeam)
  const ourSide = topGsIsHome ? game.result.home : game.result.away
  const oppSide = topGsIsHome ? game.result.away : game.result.home
  const ourScore = scoreWithWicketsAndOvers(ourSide)
  const oppScore = scoreWithWicketsAndOvers(oppSide)
  const winnerResult = game.result.winner?.name
    ? game.result.winner.value === (topGsIsHome ? 'HOME' : 'AWAY') ||
      isTopGsTeam(game.result.winner.name)
      ? 'won'
      : 'lost'
    : null
  const result =
    resultFromOutcome(ourSide.outcome?.value || ourSide.outcome?.name) ??
    winnerResult ??
    resultFromRuns(ourScore, oppScore)

  if (!result) return null

  return {
    result,
    ourScore,
    oppScore,
    matchLabel: matchLabelFromAlias(game.alias),
  }
}

function resultFromRuns(ourScore: string | null, oppScore: string | null) {
  const ourRuns = runsFromScore(ourScore)
  const oppRuns = runsFromScore(oppScore)

  if (ourRuns === null || oppRuns === null) return null
  if (ourRuns === oppRuns) return 'draw'

  return ourRuns > oppRuns ? 'won' : 'lost'
}

export async function syncFinishedPlayHqFixtures() {
  const now = new Date()
  const fixtures = await prisma.fixture.findMany({
    where: {
      active: true,
      result: 'upcoming',
      scoreboardUrl: {
        not: null,
      },
    },
  })
  let synced = 0
  let failed = 0

  for (const fixture of fixtures) {
    if (
      fixtureDateTime(fixture).getTime() + MATCH_RESULT_SYNC_DELAY_MS >
      now.getTime()
    ) {
      continue
    }

    try {
      if (await syncPlayHqFixture(fixture)) synced += 1
    } catch (error) {
      failed += 1
      console.error(`Failed to sync fixture ${fixture.id}`, error)
    }
  }

  return {
    checked: fixtures.length,
    synced,
    failed,
  }
}
