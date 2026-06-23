export type IntentId = 'player' | 'sponsor' | 'general' | 'social'

export const INTENTS: {
  id: IntentId
  emoji: string
  name: string
  sub: string
  ghost: string
}[] = [
  {
    id: 'player',
    emoji: '🏏',
    name: 'I Want to Play',
    sub: 'Looking to trial, join the squad, or find out how to get involved as a playing member.',
    ghost: '01',
  },
  {
    id: 'sponsor',
    emoji: '🤝',
    name: 'Become a Sponsor',
    sub: 'Support the club. Get your brand in front of players, families, and the Adelaide cricket community.',
    ghost: '02',
  },
  {
    id: 'general',
    emoji: '💬',
    name: 'General Enquiry',
    sub: 'Anything else — media, events, partnerships, or just a question about the club.',
    ghost: '03',
  },
  {
    id: 'social',
    emoji: '👋',
    name: 'Just Following',
    sub: 'Fan, family, or supporter. Stay in the loop with fixtures, news and club updates.',
    ghost: '04',
  },
]
