import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required for seed')
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10)

  await prisma.adminUser.upsert({
    where: {
      email: adminEmail,
    },
    update: {
      passwordHash,
      active: true,
    },
    create: {
      email: adminEmail,
      name: 'Administrator',
      passwordHash,
      active: true,
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log('Admin user seeded successfully.')
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
