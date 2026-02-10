-- CreateEnum
CREATE TYPE "MaterialType" AS ENUM ('VINYL', 'SUBSTRATE', 'LAMINATE', 'INK', 'OTHER');

-- CreateEnum
CREATE TYPE "UnitType" AS ENUM ('SQM', 'LINEAR_METER', 'PIECE');

-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "type" "MaterialType" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "wasteFactor" DOUBLE PRECISION NOT NULL DEFAULT 1.15;

-- CreateTable
CREATE TABLE "PricingTier" (
    "id" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "minQuantity" DOUBLE PRECISION NOT NULL,
    "discountPercent" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PricingTier_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PricingTier" ADD CONSTRAINT "PricingTier_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
