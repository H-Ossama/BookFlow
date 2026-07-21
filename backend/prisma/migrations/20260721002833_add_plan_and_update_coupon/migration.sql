-- DropForeignKey
ALTER TABLE "Coupon" DROP CONSTRAINT "Coupon_companyId_fkey";

-- AlterTable
ALTER TABLE "Coupon" ADD COLUMN     "applicablePlans" TEXT[],
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "description" TEXT,
ALTER COLUMN "companyId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "monthlyBookings" INTEGER NOT NULL,
    "employees" INTEGER NOT NULL,
    "features" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
