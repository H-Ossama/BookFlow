-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "PlatformFeature" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "key" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlatformFeature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlatformFeature_key_key" ON "PlatformFeature"("key");
