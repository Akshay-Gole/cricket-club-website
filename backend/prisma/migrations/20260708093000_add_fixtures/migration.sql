CREATE TABLE "Fixture" (
  "id" TEXT NOT NULL,
  "homeTeam" TEXT NOT NULL,
  "awayTeam" TEXT NOT NULL,
  "matchDate" TIMESTAMP(3) NOT NULL,
  "time" TEXT NOT NULL,
  "venueName" TEXT NOT NULL,
  "venueGoogleUrl" TEXT,
  "scoreboardUrl" TEXT,
  "season" TEXT NOT NULL,
  "result" TEXT NOT NULL DEFAULT 'upcoming',
  "ourScore" TEXT,
  "oppScore" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Fixture_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Fixture_season_matchDate_idx" ON "Fixture"("season", "matchDate");
CREATE INDEX "Fixture_result_matchDate_idx" ON "Fixture"("result", "matchDate");
