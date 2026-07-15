import prisma from '../lib/prisma.js'
import { syncFinishedPlayHqFixtures } from '../features/fixtures/playhq-fixture.service.js'
import { syncAllPlayCricketPlayerStats } from '../features/players/play-cricket.service.js'

async function main() {
  const [players, fixtures] = await Promise.all([
    syncAllPlayCricketPlayerStats(),
    syncFinishedPlayHqFixtures(),
  ])

  console.log(JSON.stringify({ players, fixtures }, null, 2))

  if (players.failed > 0 || fixtures.failed > 0) {
    process.exitCode = 1
  }
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
