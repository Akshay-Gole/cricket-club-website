-- CreateTable
CREATE TABLE "PlayerCareerStats" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "matches" INTEGER NOT NULL DEFAULT 0,
    "battingInnings" INTEGER NOT NULL DEFAULT 0,
    "battingAggregate" INTEGER NOT NULL DEFAULT 0,
    "battingNotOuts" INTEGER NOT NULL DEFAULT 0,
    "batting50s" INTEGER NOT NULL DEFAULT 0,
    "batting100s" INTEGER NOT NULL DEFAULT 0,
    "batting0s" INTEGER NOT NULL DEFAULT 0,
    "battingHighScore" INTEGER NOT NULL DEFAULT 0,
    "isBattingHSNotOut" BOOLEAN NOT NULL DEFAULT false,
    "battingAverage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "battingStrikeRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "battingFours" INTEGER NOT NULL DEFAULT 0,
    "battingSixes" INTEGER NOT NULL DEFAULT 0,
    "bowlingWickets" INTEGER NOT NULL DEFAULT 0,
    "bowlingMaidens" INTEGER NOT NULL DEFAULT 0,
    "bowlingRuns" INTEGER NOT NULL DEFAULT 0,
    "bowlingBalls" INTEGER NOT NULL DEFAULT 0,
    "bowling5WIs" INTEGER NOT NULL DEFAULT 0,
    "bowling10WMs" INTEGER NOT NULL DEFAULT 0,
    "bowlingOvers" TEXT NOT NULL DEFAULT '0',
    "bowlingBestInnings" TEXT NOT NULL DEFAULT '0-0',
    "bowlingAverage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bowlingStrikeRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bowlingEconomyRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bowlingWides" INTEGER NOT NULL DEFAULT 0,
    "bowlingNoBalls" INTEGER NOT NULL DEFAULT 0,
    "fieldingCatchesNonWK" INTEGER NOT NULL DEFAULT 0,
    "fieldingCatchesWK" INTEGER NOT NULL DEFAULT 0,
    "fieldingTotalCatches" INTEGER NOT NULL DEFAULT 0,
    "fieldingStumpings" INTEGER NOT NULL DEFAULT 0,
    "fieldingRunOuts" INTEGER NOT NULL DEFAULT 0,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerCareerStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerMatchPerformance" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "externalMatchId" TEXT NOT NULL,
    "matchDate" TIMESTAMP(3) NOT NULL,
    "matchType" TEXT,
    "gradeName" TEXT,
    "homeTeam" TEXT,
    "awayTeam" TEXT,
    "battingRuns" INTEGER,
    "battingBalls" INTEGER,
    "battingFours" INTEGER,
    "battingSixes" INTEGER,
    "battingStrikeRate" DOUBLE PRECISION,
    "battingDismissalTypeId" INTEGER,
    "bowlingOvers" TEXT,
    "bowlingMaidens" INTEGER,
    "bowlingRuns" INTEGER,
    "bowlingWickets" INTEGER,
    "bowlingWides" INTEGER,
    "bowlingNoBalls" INTEGER,
    "bowlingEconomy" DOUBLE PRECISION,
    "fieldingCatches" INTEGER,
    "fieldingStumpings" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerMatchPerformance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayerCareerStats_playerId_key" ON "PlayerCareerStats"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerMatchPerformance_playerId_externalMatchId_key" ON "PlayerMatchPerformance"("playerId", "externalMatchId");

-- CreateIndex
CREATE INDEX "PlayerMatchPerformance_playerId_matchDate_idx" ON "PlayerMatchPerformance"("playerId", "matchDate");

-- AddForeignKey
ALTER TABLE "PlayerCareerStats" ADD CONSTRAINT "PlayerCareerStats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerMatchPerformance" ADD CONSTRAINT "PlayerMatchPerformance_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
