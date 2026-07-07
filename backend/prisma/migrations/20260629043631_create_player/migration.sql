-- CreateEnum
CREATE TYPE "PlayerRole" AS ENUM ('batsman', 'bowler', 'all_rounder', 'wicket_keeper');

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "initials" TEXT NOT NULL,
    "role" "PlayerRole" NOT NULL,
    "jerseyNumber" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "battingAvg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bestBowl" TEXT NOT NULL DEFAULT '0/0',
    "isCaptain" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);
