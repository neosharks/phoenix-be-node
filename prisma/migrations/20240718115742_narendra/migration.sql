/*
  Warnings:

  - You are about to drop the column `file` on the `ClassMessage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ClassMessage" DROP COLUMN "file",
ADD COLUMN     "document" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "video" TEXT,
ALTER COLUMN "message" DROP NOT NULL;
