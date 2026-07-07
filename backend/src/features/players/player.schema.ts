import { z } from 'zod'

export const apiPlayerRoleSchema = z.enum([
  'batsman',
  'bowler',
  'all-rounder',
  'wicket-keeper',
])

export const createPlayerSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  displayName: z.string().trim().min(1, 'Display name is required'),
  initials: z.string().trim().min(1, 'Initials are required'),
  role: apiPlayerRoleSchema,
  jerseyNumber: z.number().int().positive('Jersey number must be positive'),
  imageUrl: z.string().url().optional().or(z.literal('')),
  playCricketPlayerId: z.string().uuid().optional().or(z.literal('')),
  battingAvg: z.number().min(0).default(0),
  bestBowl: z.string().trim().min(1).default('0/0'),
  isCaptain: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  active: z.boolean().default(true),
})

export const updatePlayerSchema = createPlayerSchema.partial()
