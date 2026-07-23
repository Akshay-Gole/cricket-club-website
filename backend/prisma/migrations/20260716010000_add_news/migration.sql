CREATE TABLE "NewsPost" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "layout" TEXT NOT NULL DEFAULT 'standard',
  "excerpt" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "featuredImage" TEXT,
  "author" TEXT NOT NULL DEFAULT 'Top G''s CC',
  "status" TEXT NOT NULL DEFAULT 'draft',
  "readTime" TEXT NOT NULL DEFAULT '1 min read',
  "publishedAt" TIMESTAMP(3),
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "NewsPost_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "NewsBlock" (
  "id" TEXT NOT NULL,
  "postId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "data" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "NewsBlock_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "NewsPost_slug_key" ON "NewsPost"("slug");
CREATE INDEX "NewsPost_status_publishedAt_idx" ON "NewsPost"("status", "publishedAt");
CREATE INDEX "NewsPost_category_publishedAt_idx" ON "NewsPost"("category", "publishedAt");
CREATE INDEX "NewsBlock_postId_sortOrder_idx" ON "NewsBlock"("postId", "sortOrder");

ALTER TABLE "NewsBlock" ADD CONSTRAINT "NewsBlock_postId_fkey" FOREIGN KEY ("postId") REFERENCES "NewsPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
