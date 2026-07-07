CREATE TABLE "HomeContent" (
  "id" TEXT NOT NULL DEFAULT 'home',
  "matchesPlayed" TEXT NOT NULL DEFAULT '48',
  "victories" TEXT NOT NULL DEFAULT '31',
  "trophies" TEXT NOT NULL DEFAULT '06',
  "activePlayers" TEXT NOT NULL DEFAULT '22',
  "yearsActive" TEXT NOT NULL DEFAULT '01',
  "tickerText" TEXT NOT NULL DEFAULT 'Top G''s CC def. Norwood CC by 47 runs    ·    Catto named Player of the Match    ·    Next fixture: Top G''s CC vs Riverside CC — Sat 31 May    ·    U18s training every Thursday 5PM    ·    Season 2026 registrations now open    ·    ',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "HomeContent_pkey" PRIMARY KEY ("id")
);
