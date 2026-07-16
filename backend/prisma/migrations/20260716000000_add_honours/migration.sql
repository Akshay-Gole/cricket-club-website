CREATE TABLE "HonourTrophy" (
  "id" TEXT NOT NULL,
  "year" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'Trophy',
  "description" TEXT NOT NULL,
  "featured" BOOLEAN NOT NULL DEFAULT true,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "HonourTrophy_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "HonourAwardWinner" (
  "id" TEXT NOT NULL,
  "season" TEXT NOT NULL,
  "award" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "detail" TEXT,
  "featured" BOOLEAN NOT NULL DEFAULT true,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "HonourAwardWinner_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "HonourManualRecord" (
  "id" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "meta" TEXT,
  "featured" BOOLEAN NOT NULL DEFAULT true,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "HonourManualRecord_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "HonourTrophy_year_idx" ON "HonourTrophy"("year");
CREATE INDEX "HonourTrophy_featured_idx" ON "HonourTrophy"("featured");

CREATE INDEX "HonourAwardWinner_season_idx" ON "HonourAwardWinner"("season");
CREATE INDEX "HonourAwardWinner_featured_idx" ON "HonourAwardWinner"("featured");

CREATE INDEX "HonourManualRecord_featured_idx" ON "HonourManualRecord"("featured");
CREATE INDEX "HonourManualRecord_sortOrder_idx" ON "HonourManualRecord"("sortOrder");
