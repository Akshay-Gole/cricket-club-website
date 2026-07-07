-- AlterTable
ALTER TABLE "Player" ADD COLUMN "playCricketPlayerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Player_playCricketPlayerId_key" ON "Player"("playCricketPlayerId");
