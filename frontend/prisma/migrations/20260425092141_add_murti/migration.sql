-- CreateTable
CREATE TABLE "Murti" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleTranslation" TEXT,
    "context" TEXT NOT NULL,
    "narrator" TEXT,
    "narratorLocation" TEXT,
    "slug" TEXT NOT NULL,
    "status" "StoryStatus" NOT NULL DEFAULT 'DRAFT',
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedDate" TIMESTAMP(3),
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Murti_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Murti_slug_key" ON "Murti"("slug");
