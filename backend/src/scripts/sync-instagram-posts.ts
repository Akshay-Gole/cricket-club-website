import { syncInstagramPosts } from '../features/gallery/instagram.service'
import prisma from '../lib/prisma'

async function main() {
  const result = await syncInstagramPosts()

  console.log(
    `Instagram sync complete. Synced: ${result.synced}. Deactivated: ${result.deactivated}.`
  )
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
