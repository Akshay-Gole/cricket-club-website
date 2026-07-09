import prisma from '../lib/prisma.js'
import { syncAllPlayCricketPlayerStats } from '../features/players/play-cricket.service.js'

async function main() {
  const result = await syncAllPlayCricketPlayerStats()

  console.log(JSON.stringify(result, null, 2))

  if (result.failed > 0) {
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
