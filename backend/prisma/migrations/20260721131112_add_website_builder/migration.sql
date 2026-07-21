-- CreateTable
CREATE TABLE "WebsiteTheme" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "primaryColor" TEXT NOT NULL DEFAULT '#c5a880',
    "secondaryColor" TEXT NOT NULL DEFAULT '#0a0c10',
    "accentColor" TEXT NOT NULL DEFAULT '#e8d5b8',
    "backgroundColor" TEXT NOT NULL DEFAULT '#0a0c10',
    "textColor" TEXT NOT NULL DEFAULT '#ffffff',
    "fontFamily" TEXT NOT NULL DEFAULT 'Inter',
    "borderRadius" TEXT NOT NULL DEFAULT '12px',
    "buttonStyle" TEXT NOT NULL DEFAULT 'solid',
    "animationStyle" TEXT NOT NULL DEFAULT 'fade',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebsiteTheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteSection" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "sectionType" TEXT NOT NULL,
    "layoutVariant" TEXT NOT NULL DEFAULT 'default',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "content" JSONB NOT NULL DEFAULT '{}',
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebsiteSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteTheme_companyId_key" ON "WebsiteTheme"("companyId");

-- CreateIndex
CREATE INDEX "WebsiteSection_companyId_sortOrder_idx" ON "WebsiteSection"("companyId", "sortOrder");

-- AddForeignKey
ALTER TABLE "WebsiteTheme" ADD CONSTRAINT "WebsiteTheme_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebsiteSection" ADD CONSTRAINT "WebsiteSection_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
