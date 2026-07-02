import { PrismaClient, PlayerRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.player.deleteMany()

  await prisma.player.createMany({
    data: [
      {
        firstName: 'Akshay',
        lastName: 'Gole',
        displayName: 'Akshay',
        initials: 'AKS',
        role: PlayerRole.all_rounder,
        jerseyNumber: 3,
        battingAvg: 42.3,
        bestBowl: '4/18',
        isCaptain: true,
        isFeatured: true,
      },
      {
        firstName: 'Jones',
        lastName: 'Smith',
        displayName: 'Jones',
        initials: 'JON',
        role: PlayerRole.batsman,
        jerseyNumber: 7,
        battingAvg: 48.5,
        bestBowl: '0/0',
        isFeatured: true,
      },
      {
        firstName: 'Ryan',
        lastName: 'Smith',
        displayName: 'Ryan',
        initials: 'RYA',
        role: PlayerRole.bowler,
        jerseyNumber: 11,
        battingAvg: 12.1,
        bestBowl: '5/22',
        isFeatured: true,
      },
      {
        firstName: 'Mitchell',
        lastName: 'Brown',
        displayName: 'Mitchell',
        initials: 'MIT',
        role: PlayerRole.wicket_keeper,
        jerseyNumber: 2,
        battingAvg: 31.8,
        bestBowl: '0/0',
        isFeatured: true,
      },
      {
        firstName: 'Parsons',
        lastName: 'Lee',
        displayName: 'Parsons',
        initials: 'PAR',
        role: PlayerRole.bowler,
        jerseyNumber: 5,
        battingAvg: 9.4,
        bestBowl: '4/31',
      },
      {
        firstName: 'Davies',
        lastName: 'King',
        displayName: 'Davies',
        initials: 'DAV',
        role: PlayerRole.batsman,
        jerseyNumber: 14,
        battingAvg: 38.2,
        bestBowl: '0/0',
      },
      {
        firstName: 'Khan',
        lastName: 'Ali',
        displayName: 'Khan',
        initials: 'KHA',
        role: PlayerRole.all_rounder,
        jerseyNumber: 21,
        battingAvg: 29.6,
        bestBowl: '3/24',
      },
      {
        firstName: 'Foster',
        lastName: 'James',
        displayName: 'Foster',
        initials: 'FOS',
        role: PlayerRole.bowler,
        jerseyNumber: 9,
        battingAvg: 7.8,
        bestBowl: '6/40',
      },
    ],
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log('Seed data inserted successfully.')
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
