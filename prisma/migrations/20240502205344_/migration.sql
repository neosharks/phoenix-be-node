/*
  Warnings:

  - You are about to drop the column `userId` on the `Package` table. All the data in the column will be lost.
  - Added the required column `creatorId` to the `Package` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Package" DROP CONSTRAINT "Package_userId_fkey";

-- AlterTable
ALTER TABLE "Package" DROP COLUMN "userId",
ADD COLUMN     "creatorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "whatsappNumber" TEXT;

-- CreateTable
CREATE TABLE "ClickStream" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "info" JSONB NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "ClickStream_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClickStream" ADD CONSTRAINT "ClickStream_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
