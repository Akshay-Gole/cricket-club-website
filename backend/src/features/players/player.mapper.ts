import { Player, PlayerRole } from '@prisma/client'

type ApiPlayerRole = 'batsman' | 'bowler' | 'all-rounder' | 'wicket-keeper'

const roleMap: Record<PlayerRole, ApiPlayerRole> = {
  batsman: 'batsman',
  bowler: 'bowler',
  all_rounder: 'all-rounder',
  wicket_keeper: 'wicket-keeper',
}

export const dbRoleMap: Record<ApiPlayerRole, PlayerRole> = {
  batsman: 'batsman',
  bowler: 'bowler',
  'all-rounder': 'all_rounder',
  'wicket-keeper': 'wicket_keeper',
}

export function toApiPlayer(player: Player) {
  return {
    id: player.id,
    firstName: player.firstName,
    lastName: player.lastName,
    name: player.displayName,
    initials: player.initials,
    role: roleMap[player.role],
    jerseyNumber: player.jerseyNumber,
    imageUrl: player.imageUrl,
    stats: {
      battingAverage: player.battingAvg,
      bestBowling: player.bestBowl,
    },
    isCaptain: player.isCaptain,
    isFeatured: player.isFeatured,
    active: player.active,
  }
}
