CREATE TABLE "InstagramPost" (
    "id" TEXT NOT NULL,
    "instagramMediaId" TEXT NOT NULL,
    "caption" TEXT,
    "mediaType" TEXT NOT NULL,
    "mediaUrl" TEXT,
    "thumbnailUrl" TEXT,
    "permalink" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstagramPost_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "InstagramPost_instagramMediaId_key" ON "InstagramPost"("instagramMediaId");
CREATE INDEX "InstagramPost_active_idx" ON "InstagramPost"("active");
CREATE INDEX "InstagramPost_timestamp_idx" ON "InstagramPost"("timestamp");
