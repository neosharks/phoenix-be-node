/*
  Warnings:

  - You are about to drop the column `image` on the `ClassMessage` table. All the data in the column will be lost.
  - You are about to drop the column `media` on the `ClassMessage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ClassMessage" DROP COLUMN "image",
DROP COLUMN "media",
ADD COLUMN     "file" TEXT;
