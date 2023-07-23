/*
  Warnings:

  - You are about to drop the column `packageId` on the `Tier` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tierId]` on the table `Package` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tierId` to the `Package` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tier" DROP CONSTRAINT "Tier_packageId_fkey";

-- AlterTable
ALTER TABLE "Package" ADD COLUMN     "tierId" TEXT NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Tier" DROP COLUMN "packageId",
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Package_tierId_key" ON "Package"("tierId");

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "Tier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
